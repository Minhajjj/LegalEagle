"use server";

import { promises as fs } from "node:fs";
import path from "node:path";
import { createClient } from "@/utils/supabase/server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { hasOpenAIKey, getOpenAIApiKey } from "@/lib/env";
import {
  answerQuestionWithContext,
  generateRisksFromDocument,
  type RiskFinding,
} from "@/lib/legal-ai";

interface BenchmarkClause {
  clause_type: string;
  title: string;
  standard_text: string;
  jurisdiction: string;
  risk_level_if_missing: "high" | "medium" | "low";
  notes?: string;
}

async function loadBenchmarkClauses(): Promise<BenchmarkClause[]> {
  const seedPath = path.join(process.cwd(), "seed", "benchmark-clauses.json");
  const raw = await fs.readFile(seedPath, "utf8");
  const parsed = JSON.parse(raw) as BenchmarkClause[];
  return Array.isArray(parsed) ? parsed : [];
}

function scoreSnippetAgainstRisk(content: string, clauseName: string): number {
  const words = clauseName
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
  if (!words.length) return 0;
  const haystack = content.toLowerCase();
  return words.reduce((score, word) => score + (haystack.includes(word) ? 1 : 0), 0);
}

function extractEvidenceSnippet(content: string): string {
  const compact = content.replace(/\s+/g, " ").trim();
  return compact.length > 280 ? `${compact.slice(0, 280)}...` : compact;
}

function lexicalScore(text: string, query: string): number {
  const tokens = query
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
  if (!tokens.length) return 0;
  const haystack = text.toLowerCase();
  return tokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

export async function generateDocumentRisks(documentId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single();

  if (docError || !doc) throw new Error("Document not found");

  const { data: chunks, error: chunksError } = await supabase
    .from("document_chunks")
    .select("content, metadata, created_at")
    .eq("document_id", documentId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (chunksError) throw chunksError;

  const fullText = (chunks ?? []).map((chunk) => chunk.content).join("\n\n").trim();
  if (!fullText) throw new Error("No document text found for analysis");

  const benchmarkClauses = await loadBenchmarkClauses();
  const baseRisks = await generateRisksFromDocument({
    documentName: doc.name,
    documentText: fullText,
    benchmarkClauses,
  });
  const risks = baseRisks.map((risk) => {
    const bestChunk = (chunks ?? [])
      .map((chunk) => ({
        content: chunk.content,
        score: scoreSnippetAgainstRisk(chunk.content, risk.clause_name),
      }))
      .sort((a, b) => b.score - a.score)[0];

    const evidence = bestChunk?.content
      ? ` Evidence: "${extractEvidenceSnippet(bestChunk.content)}"`
      : "";

    return {
      ...risk,
      explanation: `${risk.explanation}${evidence}`,
    };
  });

  const existingMetadata =
    doc.metadata && typeof doc.metadata === "object" ? doc.metadata : {};
  const metadata = {
    ...existingMetadata,
    analysis: {
      generated_at: new Date().toISOString(),
      model: "gpt-3.5-turbo",
      confidence_policy: "option-b",
      risks,
    },
  };

  const { error: updateError } = await supabase
    .from("documents")
    .update({ metadata, status: "completed", updated_at: new Date().toISOString() })
    .eq("id", doc.id)
    .eq("user_id", user.id);

  if (updateError) throw updateError;

  // Persist normalized risk findings for filtering, analytics, and dashboard queries.
  await supabase.from("document_risks").delete().eq("document_id", doc.id);
  if (risks.length > 0) {
    const rows = risks.map((risk) => ({
      document_id: doc.id,
      user_id: user.id,
      severity: risk.severity,
      clause_name: risk.clause_name,
      explanation: risk.explanation,
      recommendation: risk.recommendation,
      confidence: risk.confidence,
    }));
    const { error: risksInsertError } = await supabase
      .from("document_risks")
      .insert(rows);
    if (risksInsertError) throw risksInsertError;
  }

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "analyze_document",
    entity_type: "document",
    entity_id: doc.id,
  });

  return { risks, content: fullText };
}

export async function askDocumentQuestion(params: {
  documentId: string;
  message: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const { data: doc, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", params.documentId)
    .eq("user_id", user.id)
    .single();

  if (docError || !doc) throw new Error("Document not found");

  const canUseEmbeddings = hasOpenAIKey();
  let documentText = "";
  if (canUseEmbeddings) {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: getOpenAIApiKey(),
      modelName: "text-embedding-3-small",
    });
    
    try {
      const questionEmbedding = await embeddings.embedQuery(params.message);
      const { data: semanticChunks, error: semanticError } = await supabase.rpc(
        "match_document_chunks",
        {
          query_embedding: questionEmbedding,
          match_threshold: 0.2,
          match_count: 6,
          p_document_id: params.documentId,
          p_user_id: user.id,
        },
      );

      if (!semanticError && Array.isArray(semanticChunks) && semanticChunks.length > 0) {
        documentText = semanticChunks
          .map((chunk: { content?: string }) => chunk.content ?? "")
          .join("\n\n")
          .trim();
      }
    } catch (error) {
      console.warn("Embedding question failed, falling back to free-mode lexical search:", error);
    }
  }

  if (!documentText) {
    const { data: fallbackChunks, error: fallbackError } = await supabase
      .from("document_chunks")
      .select("content, created_at")
      .eq("document_id", params.documentId)
      .eq("user_id", user.id)
      .order("created_at", { ascending: true });

    if (fallbackError) throw fallbackError;
    const ranked = (fallbackChunks ?? [])
      .map((chunk) => ({
        content: chunk.content,
        score: lexicalScore(chunk.content, params.message),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    documentText = ranked.map((item) => item.content).join("\n\n").trim();
  }
  const metadata = doc.metadata && typeof doc.metadata === "object" ? doc.metadata : {};
  const { data: riskRows, error: riskRowsError } = await supabase
    .from("document_risks")
    .select("severity, clause_name, explanation, recommendation, confidence, created_at")
    .eq("document_id", params.documentId)
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  if (riskRowsError) throw riskRowsError;

  const risks: RiskFinding[] = (riskRows ?? []).map((row, index) => ({
    id: `${index + 1}`,
    severity: row.severity as "High" | "Medium" | "Low",
    clause_name: row.clause_name,
    explanation: row.explanation,
    recommendation: row.recommendation ?? "Review with legal counsel.",
    confidence: Number(row.confidence ?? 0.5),
  }));

  // Backward-compat fallback to metadata risks if table is empty for older records.
  if (risks.length === 0) {
    const analysis = (metadata as { analysis?: { risks?: RiskFinding[] } }).analysis;
    if (Array.isArray(analysis?.risks)) {
      risks.push(...analysis.risks);
    }
  }

  const answer = await answerQuestionWithContext({
    documentName: doc.name,
    question: params.message,
    documentText,
    risks,
  });

  await supabase.from("audit_logs").insert({
    user_id: user.id,
    action: "ask_document_question",
    entity_type: "document",
    entity_id: doc.id,
  });

  return { answer };
}
