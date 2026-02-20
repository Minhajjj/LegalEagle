"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { RiskCard } from "@/components/risk-card";
import { ChatInput } from "@/components/chat-input";
import { CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share2, Sparkles } from "lucide-react";

// Mock data
const mockRisks = [
  {
    id: 1,
    severity: "High" as const,
    clauseName: "Unilateral Termination Clause",
    explanation:
      "This clause allows the employer to terminate the agreement without cause with only 7 days notice, while requiring 30 days notice from the employee.",
  },
  {
    id: 2,
    severity: "Medium" as const,
    clauseName: "Non-Compete Duration",
    explanation:
      "The non-compete clause extends for 24 months post-termination, which may be considered excessive in many jurisdictions.",
  },
  {
    id: 3,
    severity: "High" as const,
    clauseName: "Liability Waiver",
    explanation:
      "This clause completely waives the company's liability for any damages, including gross negligence, which may be unenforceable.",
  },
  {
    id: 4,
    severity: "Low" as const,
    clauseName: "Payment Terms",
    explanation:
      "Payment terms are standard with net-30 days, which is reasonable for this type of agreement.",
  },
];

const mockDocumentContent = `
EMPLOYMENT AGREEMENT

This Employment Agreement ("Agreement") is entered into on January 15, 2024, between Tech Corp ("Company") and Employee ("Employee").

1. TERM OF EMPLOYMENT
The term of this Agreement shall commence on the Effective Date and continue until terminated by either party with seven (7) days written notice.

2. NON-COMPETE PROVISION
Employee agrees not to engage in any competitive business activities for a period of twenty-four (24) months following termination of employment.

3. LIABILITY WAIVER
Company shall not be liable for any damages, losses, or expenses incurred by Employee, including but not limited to damages resulting from gross negligence or willful misconduct.

4. COMPENSATION
Employee shall receive a base salary of $X per year, payable in accordance with Company's standard payroll practices, net-30 days.

5. CONFIDENTIALITY
Employee agrees to maintain the confidentiality of all proprietary information disclosed during the course of employment.
`;

const mockRiskSummary = `This employment agreement contains several high-risk clauses that warrant careful review. The unilateral termination provision heavily favors the employer, the non-compete duration may be excessive, and the liability waiver attempts to absolve the company of gross negligence.`;

export default function AnalyzePage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  const [documentId, setDocumentId] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ role: "user" | "assistant"; content: string }>
  >([]);

  useEffect(() => {
    if (params instanceof Promise) {
      params.then((p) => setDocumentId(p.id));
    } else {
      setDocumentId(params.id);
    }
  }, [params]);

  const handleSendMessage = (message: string) => {
    setChatMessages([...chatMessages, { role: "user", content: message }]);
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Based on the document analysis, this clause relates to termination rights. Would you like me to explain the legal implications in more detail?",
        },
      ]);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F2F1EE] flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        {/* Main Layout Container */}
        <div className="flex-1 ml-20 flex overflow-hidden">
          {/* Left Column - Risk List */}
          <div className="w-80 bg-white border-r border-[#308970]/10 p-6 overflow-y-auto">
            <h2 className="text-xl font-bold text-[#308970] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" /> Red Flags
            </h2>
            <div className="space-y-3">
              {mockRisks.map((risk) => (
                <RiskCard
                  key={risk.id}
                  severity={risk.severity}
                  clauseName={risk.clauseName}
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
                    Employment Agreement - Tech Corp
                  </h2>
                  <p className="text-sm font-bold text-[#308970]/60">
                    ID: {documentId} • January 15, 2024
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
                  {mockDocumentContent.split("\n").map((line, index) => {
                    const isRisky =
                      line.includes("TERMINATION") ||
                      line.includes("NON-COMPETE") ||
                      line.includes("LIABILITY");

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
                  })}
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
                {mockRiskSummary}
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
            </div>

            <div className="p-6 border-t border-[#308970]/10">
              <ChatInput onSend={handleSendMessage} />
            </div>
          </div>
        </div>{" "}
        {/* This was the missing closing tag for the flex container */}
      </div>
    </div>
  );
}
