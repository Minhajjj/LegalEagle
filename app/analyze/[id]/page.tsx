"use client";

import { useState, useEffect, useRef } from "react";
import { Sidebar } from "@/components/sidebar";
import { RiskCard } from "@/components/risk-card";
import { ChatInput } from "@/components/chat-input";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { askDocumentQuestion, generateDocumentRisks } from "@/app/analyze/actions";
import { motion } from "framer-motion";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";

interface Risk {
  id: string;
  severity: "High" | "Medium" | "Low";
  clause_name: string;
  explanation: string;
  confidence?: number;
  recommendation?: string;
}

interface Document {
  id: string;
  name: string;
  created_at: string;
  status: string;
  content?: string;
  metadata?: {
    analysis?: {
      generated_at?: string;
      model?: string;
      confidence_policy?: string;
      risks?: Risk[];
    };
  };
}

export default function AnalyzePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const reduceMotion = useAppReducedMotion();
  const [documentId, setDocumentId] = useState<string>("");
  const [document, setDocument] = useState<Document | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedRiskId, setSelectedRiskId] = useState<string | null>(null);
  const leftPaneRef = useRef<HTMLDivElement | null>(null);
  const centerPaneRef = useRef<HTMLDivElement | null>(null);
  const rightPaneRef = useRef<HTMLDivElement | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      if (params instanceof Promise) {
        const resolved = await params;
        setDocumentId(resolved.id);
      } else {
        setDocumentId(params.id);
      }
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (documentId) {
      fetchDocumentData();
    }
  }, [documentId]);

  useEffect(() => {
    if (loading || reduceMotion) return;
    const targets = [leftPaneRef.current, centerPaneRef.current, rightPaneRef.current].filter(
      Boolean,
    );
    gsap.fromTo(
      targets,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" },
    );
  }, [loading, documentId, reduceMotion]);

  useGSAP(
    () => {
      if (reduceMotion || !leftPaneRef.current || !risks.length) return;
      gsap.registerPlugin(ScrollTrigger);
      const scroller = leftPaneRef.current;
      scroller.querySelectorAll(".risk-row").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 14,
          duration: 0.45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
      });
    },
    { scope: leftPaneRef, dependencies: [risks.length, reduceMotion, documentId] },
  );

  const fetchDocumentData = async () => {
    setLoading(true);
    try {
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (docError) throw docError;
      setDocument(docData);

      const { data: chunksData, error: chunksError } = await supabase
        .from("document_chunks")
        .select("content, metadata, created_at")
        .eq("document_id", documentId)
        .order("created_at", { ascending: true });

      if (chunksError) throw chunksError;

      const fullContent =
        chunksData?.map((chunk) => chunk.content).join("\n\n") || "";

      const { data: dbRisks, error: dbRisksError } = await supabase
        .from("document_risks")
        .select("id, severity, clause_name, explanation, recommendation, confidence")
        .eq("document_id", documentId)
        .order("created_at", { ascending: true });

      if (dbRisksError) throw dbRisksError;

      let resolvedRisks =
        (dbRisks ?? []).map((risk) => ({
          id: risk.id,
          severity: risk.severity as "High" | "Medium" | "Low",
          clause_name: risk.clause_name,
          explanation: risk.explanation,
          recommendation: risk.recommendation ?? undefined,
          confidence: Number(risk.confidence ?? 0.5),
        })) ?? [];

      if (!resolvedRisks.length) {
        try {
          const generated = await generateDocumentRisks(documentId);
          resolvedRisks = generated.risks;
        } catch (analysisError) {
          console.error("Risk generation fallback:", analysisError);
          resolvedRisks = [];
        }
      }

      setRisks(resolvedRisks);
      setSelectedRiskId(resolvedRisks[0]?.id ?? null);
      setDocument({ ...docData, content: fullContent });
    } catch (error) {
      console.error("Error fetching document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    setChatMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsAnalyzing(true);

    try {
      const result = await askDocumentQuestion({
        documentId,
        message,
      });
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: result.answer,
        },
      ]);
    } catch (error) {
      console.error("Question handling error:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "I could not answer that right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const highlightRiskyClauses = (content: string) => {
    const riskKeywords = risks.map(
      (r) => r.clause_name.toLowerCase().split(" ")[0],
    );

    return content.split("\n").map((line, index) => {
      const isRisky = riskKeywords.some((keyword) =>
        line.toLowerCase().includes(keyword),
      );

      return (
        <motion.p
          key={index}
          className="mb-4 rounded-r"
          style={
            isRisky
              ? {
                  backgroundColor: `${le.warning}0d`,
                  borderLeft: `4px solid ${le.warning}`,
                  paddingLeft: "0.75rem",
                  paddingTop: "0.5rem",
                  paddingBottom: "0.5rem",
                  fontWeight: 500,
                }
              : undefined
          }
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.35, delay: Math.min(index * 0.02, 0.4) }}
        >
          {line}
        </motion.p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: le.background }}>
        <Sidebar />
        <div className="flex-1 flex w-full max-w-full overflow-x-hidden items-center justify-center">
          <div className="text-center">
            <Loader2
              className="w-12 h-12 mx-auto mb-4 animate-spin"
              style={{ color: le.secondary }}
            />
            <p className="font-semibold" style={{ color: le.primary }}>
              Loading document…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen flex" style={{ backgroundColor: le.background }}>
        <Sidebar />
        <div className="flex-1 flex w-full max-w-full overflow-x-hidden items-center justify-center">
          <div className="text-center">
            <p className="font-semibold mb-4" style={{ color: le.primary }}>
              Document not found
            </p>
            <Button
              onClick={() => router.push("/dashboard")}
              className="rounded-[8px] font-semibold text-white"
              style={{ backgroundColor: le.primary }}
            >
              Back to dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const formattedDate = new Date(document.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  const highRiskCount = risks.filter((r) => r.severity === "High").length;
  const mediumRiskCount = risks.filter((r) => r.severity === "Medium").length;
  const lowRiskCount = risks.filter((r) => r.severity === "Low").length;

  const riskSummary = `This document contains ${highRiskCount} high-risk, ${mediumRiskCount} medium-risk, and ${lowRiskCount} low-risk clauses that warrant review.`;

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: le.background }}>
      <Sidebar />

      <div className="flex-1 flex w-full max-w-full overflow-hidden">
        <div
          ref={leftPaneRef}
          className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto shrink-0"
        >
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: le.primary }}>
            <Sparkles className="w-5 h-5" style={{ color: le.secondary }} />
            Findings ({risks.length})
          </h2>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "High", n: highRiskCount, c: le.warning },
              { label: "Med", n: mediumRiskCount, c: le.medium },
              { label: "Low", n: lowRiskCount, c: le.success },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-[12px] px-2 py-2 text-center border border-slate-100"
                style={{ backgroundColor: `${s.c}12` }}
              >
                <p className="text-[10px] font-bold uppercase" style={{ color: s.c }}>
                  {s.label}
                </p>
                <p className="text-lg font-bold tabular-nums" style={{ color: le.text }}>
                  {s.n}
                </p>
              </div>
            ))}
          </div>
          <div className="space-y-0">
            {risks.map((risk) => (
              <div key={risk.id} className="risk-row">
                <RiskCard
                  id={`risk-${risk.id}`}
                  severity={risk.severity}
                  clauseName={risk.clause_name}
                  explanation={risk.explanation}
                  confidence={risk.confidence}
                  recommendation={risk.recommendation}
                  active={selectedRiskId === risk.id}
                  onClick={() => setSelectedRiskId(risk.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <div ref={centerPaneRef} className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: le.primary }}>
                  {document.name}
                </h2>
                <p className="text-sm font-medium" style={{ color: le.muted }}>
                  {documentId} · {formattedDate} · {document.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-[8px] font-semibold border-slate-200"
                  style={{ color: le.primary }}
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button
                  size="sm"
                  className="rounded-[8px] font-semibold text-white"
                  style={{ backgroundColor: le.secondary }}
                >
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-[12px] shadow-sm border border-slate-200 p-8 sm:p-12">
              <div className="font-serif leading-relaxed" style={{ color: le.text }}>
                {document.content ? (
                  highlightRiskyClauses(document.content)
                ) : (
                  <p className="italic" style={{ color: le.muted }}>
                    Document content not available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={rightPaneRef}
          className="w-96 bg-white border-l border-slate-200 flex flex-col shrink-0"
        >
          <div
            className="p-6 border-b border-slate-200"
            style={{ backgroundColor: `${le.primary}08` }}
          >
            <CardTitle className="text-lg font-bold mb-3" style={{ color: le.primary }}>
              Risk summary
            </CardTitle>
            <p className="text-sm font-medium leading-relaxed" style={{ color: le.text }}>
              {riskSummary}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {chatMessages.map((msg, index) => (
              <motion.div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 font-medium text-sm ${
                    msg.role === "user"
                      ? "rounded-tr-sm text-white"
                      : "rounded-tl-sm border border-slate-200"
                  }`}
                  style={
                    msg.role === "user"
                      ? { backgroundColor: le.primary }
                      : { backgroundColor: le.background, color: le.text }
                  }
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}
            {isAnalyzing && (
              <motion.div
                className="flex justify-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div
                  className="rounded-2xl rounded-tl-sm p-4 border border-slate-200"
                  style={{ backgroundColor: le.background, color: le.primary }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing…
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="p-6 border-t border-slate-200 bg-white">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
