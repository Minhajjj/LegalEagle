"use server";

import { createClient } from "@/utils/supabase/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";
import { generateDocumentRisks } from "@/app/analyze/actions";

async function extractTextFromPdf(arrayBuffer: ArrayBuffer): Promise<string> {
  // Import direct implementation file to avoid package root debug harness.
  const pdfParseModule = await import("pdf-parse/lib/pdf-parse.js");
  const pdfParse = (pdfParseModule as unknown as {
    default?: (buffer: Buffer) => Promise<{ text?: string }>;
  }).default;

  if (!pdfParse) {
    throw new Error("PDF parser could not be loaded.");
  }

  const parsed = await pdfParse(Buffer.from(arrayBuffer));
  return parsed.text ?? "";
}

export async function processDocument(formData: FormData) {
  // Supabase server client: all DB/storage writes for ingestion use this client.
  const supabase = await createClient();

  // 1. Get the file and user from the request
  const file = formData.get("file") as File;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (!file) throw new Error("No file uploaded.");
  if (file.type !== "application/pdf") {
    throw new Error("Only PDF files are supported right now.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("PDF must be smaller than 5 MB.");
  }

  // Overwrite mode: if same user uploads same file name again, delete old record/chunks/storage.
  const { data: existingDocuments } = await supabase
    .from("documents")
    .select("id, storage_path")
    .eq("user_id", user.id)
    .eq("name", file.name)
    .order("created_at", { ascending: false })
    .limit(1);

  const existing = existingDocuments?.[0];
  if (existing) {
    await supabase.from("document_chunks").delete().eq("document_id", existing.id);
    await supabase.from("documents").delete().eq("id", existing.id);
    if (existing.storage_path) {
      await supabase.storage.from("documents").remove([existing.storage_path]);
    }
  }

  // 2) Upload original source file to Supabase Storage bucket: `documents`.
  const filePath = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 3) Insert row into `documents` table (tracks lifecycle/status per upload).
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      name: file.name,
      storage_path: filePath,
      file_size: file.size,
      file_type: "pdf",
      status: "processing",
      metadata: {
        source: "upload",
        mode: "sync",
      },
    })
    .select()
    .single();

  if (docError) throw docError;

  try {
    // 4) Parse file content using Node-safe parser.
    const arrayBuffer = await file.arrayBuffer();
    const rawText = await extractTextFromPdf(arrayBuffer);

    if (!rawText.trim()) {
      throw new Error("Could not extract readable text from this PDF.");
    }

    // 5) LangChain text-splitting step for RAG chunking.
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([rawText]);

    // 6) LangChain embeddings step (OpenAI): vectorize each chunk.
    const canUseEmbeddings = Boolean(process.env.OPENAI_API_KEY);
    const embeddings = canUseEmbeddings
      ? new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
          modelName: "text-embedding-3-small",
        })
      : null;

    let useEmbeddings = canUseEmbeddings;

    for (let i = 0; i < chunks.length; i++) {
      let embedding = null;
      if (useEmbeddings && embeddings) {
        try {
          embedding = await embeddings.embedQuery(chunks[i].pageContent);
        } catch (error) {
          console.warn("Embedding failed (e.g. quota exceeded), falling back to free-mode:", error);
          useEmbeddings = false; // Disable for rest of chunks
        }
      }

      await supabase.from("document_chunks").insert({
        document_id: doc.id,
        user_id: user.id,
        content: chunks[i].pageContent,
        embedding: embedding,
        metadata: { page: i + 1, chunk_index: i },
      });
    }

    // 7) Mark `documents.status` as completed once chunk+embedding persistence finishes.
    await supabase
      .from("documents")
      .update({
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", doc.id);

    await supabase.from("audit_logs").insert({
      user_id: user.id,
      action: "upload_document",
      entity_type: "document",
      entity_id: doc.id,
    });

    // Sync mode: run risk generation before redirecting user to the analysis page.
    await generateDocumentRisks(doc.id);
  } catch (processingError) {
    // Roll back partially created records/files so failed uploads do not create broken docs.
    await supabase.from("document_chunks").delete().eq("document_id", doc.id);
    await supabase.from("documents").delete().eq("id", doc.id);
    await supabase.storage.from("documents").remove([filePath]);
    throw processingError;
  }

  return { success: true, documentId: doc.id };
}

export async function renameDocument(documentId: string, newName: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  if (!newName || !newName.trim()) {
    throw new Error("Document name cannot be empty.");
  }

  const { error } = await supabase
    .from("documents")
    .update({ name: newName.trim(), updated_at: new Date().toISOString() })
    .eq("id", documentId)
    .eq("user_id", user.id);

  if (error) throw error;
  
  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "rename_document",
    entity_type: "document",
    entity_id: documentId,
  });

  return { success: true };
}

export async function deleteDocument(documentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get the document to find its storage path
  const { data: doc, error: fetchError } = await supabase
    .from("documents")
    .select("storage_path")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single();

  if (fetchError || !doc) {
    throw new Error("Document not found or access denied.");
  }

  // Delete all dependencies: chunks, risks, and audit logs can be handled by DB cascade,
  // but we'll manually delete chunks and risks just in case cascade isn't set up.
  await supabase.from("document_chunks").delete().eq("document_id", documentId);
  await supabase.from("document_risks").delete().eq("document_id", documentId);
  
  // Delete the actual document record
  const { error: deleteError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId)
    .eq("user_id", user.id);

  if (deleteError) throw deleteError;

  // Delete from storage
  if (doc.storage_path) {
    await supabase.storage.from("documents").remove([doc.storage_path]);
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "delete_document",
    entity_type: "document",
    entity_id: documentId,
  });

  return { success: true };
}
