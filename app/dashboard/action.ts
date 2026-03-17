"use server";

import { createClient } from "@/utils/supabase/server";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from "@langchain/openai";

// Use require for pdf-parse instead of import
const pdf = require("pdf-parse");

export async function processDocument(formData: FormData) {
  const supabase = await createClient();

  // 1. Get the file and user from the request
  const file = formData.get("file") as File;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 2. Upload the original PDF to Supabase Storage (The Vault)
  const filePath = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // 3. Save document record to the SQL database
  const { data: doc, error: docError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      name: file.name,
      storage_path: filePath,
      file_size: file.size,
      file_type: "pdf",
      status: "processing",
    })
    .select()
    .single();

  if (docError) throw docError;

  // 4. Extract Text from PDF using require
  const arrayBuffer = await file.arrayBuffer();
  const pdfData = await pdf(Buffer.from(arrayBuffer));
  const rawText = pdfData.text;

  // 5. Chunk the Text
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const chunks = await splitter.createDocuments([rawText]);

  // 6. Generate Embeddings and Save to Database
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-3-small",
  });

  // Loop through chunks, vectorize them, and save
  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embeddings.embedQuery(chunks[i].pageContent);

    await supabase.from("document_chunks").insert({
      document_id: doc.id,
      user_id: user.id,
      content: chunks[i].pageContent,
      embedding: embedding,
      chunk_index: i,
      metadata: { page: i + 1 },
    });
  }

  // 7. Update status to completed
  await supabase
    .from("documents")
    .update({ status: "completed" })
    .eq("id", doc.id);

  return { success: true, documentId: doc.id };
}
