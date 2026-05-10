import { ChatOpenAI } from "@langchain/openai";

export type RiskSeverity = "High" | "Medium" | "Low";

export interface RiskFinding {
  id: string;
  severity: RiskSeverity;
  clause_name: string;
  explanation: string;
  confidence: number;
  recommendation: string;
}

interface BenchmarkClause {
  clause_type: string;
  title: string;
  standard_text: string;
  jurisdiction: string;
  risk_level_if_missing: "high" | "medium" | "low";
  notes?: string;
}

const hasOpenAIKey = Boolean(process.env.OPENAI_API_KEY);
const model = hasOpenAIKey
  ? new ChatOpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      model: "gpt-3.5-turbo",
      temperature: 0.2,
    })
  : null;

function normalizeSeverity(value: string): RiskSeverity {
  const normalized = value.toLowerCase();
  if (normalized === "high") return "High";
  if (normalized === "medium") return "Medium";
  return "Low";
}

function extractContent(rawContent: unknown): string {
  if (typeof rawContent === "string") return rawContent;
  if (Array.isArray(rawContent)) {
    return rawContent
      .map((part) => {
        if (typeof part === "string") return part;
        if (part && typeof part === "object" && "text" in part) {
          return String((part as { text?: string }).text ?? "");
        }
        return "";
      })
      .join("\n");
  }
  return "";
}

function pickSeverityFromConfidence(confidence: number): RiskSeverity {
  if (confidence >= 0.75) return "High";
  if (confidence >= 0.55) return "Medium";
  return "Low";
}

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 2);
}

function lexicalScore(text: string, queryTokens: string[]): number {
  if (queryTokens.length === 0) return 0;
  const haystack = text.toLowerCase();
  return queryTokens.reduce((score, token) => score + (haystack.includes(token) ? 1 : 0), 0);
}

function generateFallbackRisks(params: {
  documentName: string;
  documentText: string;
  benchmarkClauses: BenchmarkClause[];
}): RiskFinding[] {
  const docTextLower = params.documentText.toLowerCase();
  const findings: RiskFinding[] = [];

  for (const [index, clause] of params.benchmarkClauses.entries()) {
    const clauseTokens = tokenize(`${clause.title} ${clause.standard_text} ${clause.clause_type}`);
    const matchScore = lexicalScore(docTextLower, clauseTokens);
    const coverage = clauseTokens.length ? matchScore / clauseTokens.length : 0;

    // Lower coverage means missing/weak clause presence and therefore higher risk.
    const confidence = Math.max(0.3, Math.min(0.95, 1 - coverage));
    const severity = pickSeverityFromConfidence(confidence);

    if (confidence < 0.55) {
      continue;
    }

    findings.push({
      id: `${index + 1}`,
      severity,
      clause_name: clause.title,
      confidence,
      explanation:
        coverage < 0.35
          ? `This contract appears to weakly cover or omit the expected ${clause.clause_type} protections compared to your benchmark template.`
          : `This contract includes partial ${clause.clause_type} language, but coverage looks weaker than benchmark wording.`,
      recommendation: `Add or strengthen a ${clause.clause_type} clause using the benchmark wording as a baseline.`,
    });
  }

  if (findings.length > 0) {
    return findings.sort((a, b) => b.confidence - a.confidence).slice(0, 8);
  }

  return [
    {
      id: "1",
      clause_name: "General Contract Review",
      severity: "Medium",
      confidence: 0.6,
      explanation:
        "Automated free-mode analysis did not find strong benchmark mismatches; a manual legal review is still recommended.",
      recommendation:
        "Review termination, liability, indemnity, confidentiality, and dispute resolution language carefully.",
    },
  ];
}

export async function generateRisksFromDocument(params: {
  documentName: string;
  documentText: string;
  benchmarkClauses: BenchmarkClause[];
}): Promise<RiskFinding[]> {
  if (!model) {
    return generateFallbackRisks(params);
  }

  const benchmarkSummary = params.benchmarkClauses
    .map(
      (clause, index) =>
        `${index + 1}. [${clause.clause_type}] ${clause.title}\nStandard: ${clause.standard_text}\nRisk if missing: ${clause.risk_level_if_missing}`,
    )
    .join("\n\n");

  const prompt = `You are a legal contract risk auditor.
Return strict JSON only with this shape:
{
  "risks": [
    {
      "clause_name": "string",
      "severity": "High|Medium|Low",
      "confidence": 0.0,
      "explanation": "short grounded explanation",
      "recommendation": "short actionable fix"
    }
  ]
}

Rules:
- Use exactly 3-level severity: High, Medium, Low.
- Confidence must be between 0 and 1.
- Option-B confidence policy:
  - High if confidence >= 0.75
  - Medium if confidence >= 0.55 and < 0.75
  - Low if confidence < 0.55
- Use benchmark clauses to judge fairness and missing protections.
- Maximum 8 risks, minimum 1 risk.
- No markdown, no prose, JSON only.

Document Name: ${params.documentName}

Benchmark Clauses:
${benchmarkSummary}

Document Text:
${params.documentText.slice(0, 18000)}`;

  let content = "";
  try {
    const response = await model.invoke(prompt);
    content = extractContent(response.content).trim();
  } catch {
    return generateFallbackRisks(params);
  }

  let parsed: {
    risks?: Array<{
      clause_name?: string;
      severity?: string;
      confidence?: number;
      explanation?: string;
      recommendation?: string;
    }>;
  } = {};

  try {
    parsed = JSON.parse(content);
  } catch {
    parsed = { risks: [] };
  }

  const risks = (parsed.risks ?? [])
    .filter((risk) => risk.clause_name && risk.explanation)
    .map((risk, index) => {
      const confidence = Math.max(0, Math.min(1, Number(risk.confidence ?? 0.5)));
      const severityFromThreshold = pickSeverityFromConfidence(confidence);

      return {
        id: `${index + 1}`,
        clause_name: String(risk.clause_name),
        explanation: String(risk.explanation),
        recommendation: String(risk.recommendation ?? "Review this clause with legal counsel."),
        confidence,
        severity: risk.severity
          ? normalizeSeverity(risk.severity)
          : severityFromThreshold,
      };
    });

  if (risks.length > 0) {
    return risks.slice(0, 8);
  }

  return [
    {
      id: "1",
      clause_name: "General Contract Review",
      severity: "Medium",
      confidence: 0.6,
      explanation:
        "Automated analysis could not extract structured risks reliably; manual legal review is recommended.",
      recommendation: "Review termination, liability, indemnity, and dispute resolution clauses manually.",
    },
  ];
}

function generateFallbackAnswer(params: {
  question: string;
  documentText: string;
  risks: RiskFinding[];
}): string {
  const questionTokens = tokenize(params.question);
  const bestParagraph =
    params.documentText
      .split(/\n{2,}/)
      .map((paragraph) => ({
        paragraph: paragraph.trim(),
        score: lexicalScore(paragraph, questionTokens),
      }))
      .sort((a, b) => b.score - a.score)[0]?.paragraph ?? "";

  const topRisk = params.risks[0];
  if (bestParagraph) {
    return `Free-mode answer: Based on matching contract text, this appears relevant: "${bestParagraph.slice(0, 420)}${bestParagraph.length > 420 ? "..." : ""}". ${topRisk ? `Top related risk currently flagged is "${topRisk.clause_name}" (${topRisk.severity}).` : ""} For final legal interpretation, consult a lawyer.`;
  }
  return "Free-mode answer: I could not find a strong text match for this question in the stored document excerpts. Please try a more specific clause question (for example: termination, liability, indemnity).";
}

export async function answerQuestionWithContext(params: {
  documentName: string;
  question: string;
  documentText: string;
  risks: RiskFinding[];
}): Promise<string> {
  if (!model) {
    return generateFallbackAnswer(params);
  }

  const risksText =
    params.risks.length === 0
      ? "No explicit risks detected yet."
      : params.risks
          .map(
            (risk) =>
              `- ${risk.clause_name} (${risk.severity}, confidence ${risk.confidence.toFixed(2)}): ${risk.explanation}`,
          )
          .join("\n");

  const prompt = `You are LegalEagle's assistant.
Answer the user question using only the provided document context and detected risks.
If the answer is uncertain, say so clearly.
Keep the answer concise (3-6 sentences), practical, and non-definitive legal advice.

Document Name: ${params.documentName}
Detected Risks:
${risksText}

Document Context:
${params.documentText.slice(0, 14000)}

User Question:
${params.question}`;

  try {
    const response = await model.invoke(prompt);
    const content = extractContent(response.content).trim();
    return content || generateFallbackAnswer(params);
  } catch {
    return generateFallbackAnswer(params);
  }
}
