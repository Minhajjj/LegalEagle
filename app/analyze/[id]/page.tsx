"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { RiskCard } from "@/components/risk-card";
import { ChatInput } from "@/components/chat-input";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Sparkles, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Risk {
  id: string;
  severity: "High" | "Medium" | "Low";
  clause_name: string;
  explanation: string;
  chunk_index: number;
}

interface Document {
  id: string;
  name: string;
  created_at: string;
  status: string;
  content?: string;
}

export default function AnalyzePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const [documentId, setDocumentId] = useState<string>("");
  const [document, setDocument] = useState<Document | null>(null);
  const [risks, setRisks] = useState<Risk[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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

  const fetchDocumentData = async () => {
    setLoading(true);
    try {
      // Fetch document details
      const { data: docData, error: docError } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (docError) throw docError;
      setDocument(docData);

      // Fetch document chunks (content)
      const { data: chunksData, error: chunksError } = await supabase
        .from("document_chunks")
        .select("content, chunk_index")
        .eq("document_id", documentId)
        .order("chunk_index");

      if (chunksError) throw chunksError;

      // Combine chunks into full document content
      const fullContent =
        chunksData?.map((chunk) => chunk.content).join("\n\n") || "";

      // For now, use mock risks. In production, you'd fetch from a risks table
      // or generate them using AI
      const mockRisks: Risk[] = [
        {
          id: "1",
          severity: "High",
          clause_name: "Unilateral Termination Clause",
          explanation:
            "This clause allows the employer to terminate the agreement without cause with only 7 days notice, while requiring 30 days notice from the employee.",
          chunk_index: 0,
        },
        {
          id: "2",
          severity: "Medium",
          clause_name: "Non-Compete Duration",
          explanation:
            "The non-compete clause extends for 24 months post-termination, which may be considered excessive in many jurisdictions.",
          chunk_index: 1,
        },
        {
          id: "3",
          severity: "High",
          clause_name: "Liability Waiver",
          explanation:
            "This clause completely waives the company's liability for any damages, including gross negligence, which may be unenforceable.",
          chunk_index: 2,
        },
        {
          id: "4",
          severity: "Low",
          clause_name: "Payment Terms",
          explanation:
            "Payment terms are standard with net-30 days, which is reasonable for this type of agreement.",
          chunk_index: 3,
        },
      ];

      setRisks(mockRisks);
      setDocument({ ...docData, content: fullContent });
    } catch (error) {
      console.error("Error fetching document:", error);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = (message: string) => {
    setChatMessages([...chatMessages, { role: "user", content: message }]);
    setIsAnalyzing(true);

    // Simulate AI response
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on the document analysis, this clause relates to termination rights. Would you like me to explain the legal implications in more detail?",
        },
      ]);
      setIsAnalyzing(false);
    }, 1500);
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
        <p
          key={index}
          className={`mb-4 ${
            isRisky
              ? "bg-[#E63946]/5 px-3 py-2 rounded-r border-l-4 border-[#E63946] font-medium"
              : ""
          }`}
        >
          {line}
        </p>
      );
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F2F1EE] flex">
        <Sidebar />
        <div className="flex-1 ml-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#308970] animate-spin mx-auto mb-4" />
            <p className="text-[#308970] font-bold">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-[#F2F1EE] flex">
        <Sidebar />
        <div className="flex-1 ml-20 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#308970] font-bold mb-4">Document not found</p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
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
    <div className="min-h-screen bg-[#F2F1EE] flex">
      <Sidebar />

      {/* Main Layout Container */}
      <div className="flex-1 ml-20 flex overflow-hidden">
        {/* Left Column - Risk List */}
        <div className="w-80 bg-white border-r border-[#308970]/10 p-6 overflow-y-auto">
          <h2 className="text-xl font-bold text-[#308970] mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5" /> Red Flags ({risks.length})
          </h2>
          <div className="space-y-3">
            {risks.map((risk) => (
              <RiskCard
                key={risk.id}
                severity={risk.severity}
                clauseName={risk.clause_name}
                explanation={risk.explanation}
              />
            ))}
          </div>
        </div>

        {/* Center Column - PDF Viewer */}
        <div className="flex-1 p-8 overflow-y-auto bg-[#F2F1EE]">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#308970] mb-2">
                  {document.name}
                </h2>
                <p className="text-sm font-bold text-[#308970]/60">
                  ID: {documentId} • {formattedDate} • Status: {document.status}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-[#308970] text-[#308970] font-bold"
                >
                  <Share2 className="w-4 h-4 mr-2" /> Share
                </Button>
                <Button className="bg-[#308970] text-white font-bold">
                  <Download className="w-4 h-4 mr-2" /> Export
                </Button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-[#308970]/10 p-12">
              <div className="font-serif text-[#1C212B] leading-relaxed">
                {document.content ? (
                  highlightRiskyClauses(document.content)
                ) : (
                  <p className="text-[#308970]/60 italic">
                    Document content not available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - AI Chat */}
        <div className="w-96 bg-white border-l border-[#308970]/10 flex flex-col">
          <div className="p-6 border-b border-[#308970]/10 bg-[#308970]/5">
            <CardTitle className="text-lg font-bold text-[#308970] mb-3">
              Risk Summary
            </CardTitle>
            <p className="text-sm font-bold text-[#308970]/80 leading-relaxed">
              {riskSummary}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white">
            {chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-4 font-bold ${
                    msg.role === "user"
                      ? "bg-[#308970] text-white rounded-tr-none"
                      : "bg-[#F2F1EE] text-[#308970] rounded-tl-none border border-[#308970]/10"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isAnalyzing && (
              <div className="flex justify-start">
                <div className="bg-[#F2F1EE] text-[#308970] rounded-2xl rounded-tl-none p-4 border border-[#308970]/10">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <p className="text-sm">Analyzing...</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-[#308970]/10">
            <ChatInput onSend={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
