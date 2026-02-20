"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  FileText,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

// Mock data for recent scans
const recentDocs = [
  {
    id: "1",
    name: "Employment_Agreement_TechCorp.pdf",
    date: "2 mins ago",
    risks: 4,
  },
  { id: "2", name: "NDA_Freelance_Project.pdf", date: "1 hour ago", risks: 1 },
  {
    id: "3",
    name: "Service_Level_Agreement.docx",
    date: "Yesterday",
    risks: 7,
  },
];

export default function AnalyzeLandingPage() {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="min-h-screen bg-[#F2F1EE] flex flex-col">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 ml-20 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            {/* Header Section */}
            <div className="mb-10">
              <h1 className="text-3xl font-black text-[#308970] mb-2">
                Document Analysis
              </h1>
              <p className="text-[#308970]/70 font-bold">
                Upload your legal documents for instant AI forensic review.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Side: Upload Zone */}
              <div className="lg:col-span-2 space-y-6">
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  className={`border-4 border-dashed rounded-3xl p-12 transition-all flex flex-col items-center justify-center text-center ${
                    isDragging
                      ? "border-[#308970] bg-[#308970]/5 scale-[0.99]"
                      : "border-[#308970]/20 bg-white"
                  }`}
                >
                  <div className="w-20 h-20 bg-[#F2F1EE] rounded-2xl flex items-center justify-center mb-6">
                    <Upload className="w-10 h-10 text-[#308970]" />
                  </div>
                  <h3 className="text-xl font-black text-[#308970] mb-2">
                    Click or drop document here
                  </h3>
                  <p className="text-sm font-bold text-[#308970]/60 mb-8 max-w-xs">
                    Support for PDF, DOCX, and TXT. Max file size 25MB.
                  </p>
                  <Button className="bg-[#308970] text-white px-8 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                    Select File
                  </Button>
                </div>

                {/* Features Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-2xl border border-[#308970]/10 flex items-center space-x-4">
                    <div className="p-2 bg-[#F2F1EE] rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-[#308970]" />
                    </div>
                    <span className="text-xs font-black text-[#308970] uppercase">
                      Secure Encryption
                    </span>
                  </div>
                  <div className="p-4 bg-white rounded-2xl border border-[#308970]/10 flex items-center space-x-4">
                    <div className="p-2 bg-[#F2F1EE] rounded-lg">
                      <FileText className="w-5 h-5 text-[#308970]" />
                    </div>
                    <span className="text-xs font-black text-[#308970] uppercase">
                      OCR Document Parsing
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side: Recent Activity */}
              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-[#308970]/10 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-[#308970] text-sm uppercase tracking-widest flex items-center">
                      <Clock className="w-4 h-4 mr-2" /> Recent Scans
                    </h3>
                  </div>

                  <div className="space-y-4">
                    {recentDocs.map((doc) => (
                      <Link key={doc.id} href={`/analyze/${doc.id}`}>
                        <div className="group p-4 rounded-2xl border border-transparent hover:border-[#308970]/20 hover:bg-[#F2F1EE]/50 transition-all cursor-pointer">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-[#F2F1EE] rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-[#308970]" />
                              </div>
                              <div>
                                <p className="text-sm font-black text-[#308970] truncate w-32">
                                  {doc.name}
                                </p>
                                <p className="text-[10px] font-bold text-[#308970]/50 uppercase">
                                  {doc.date}
                                </p>
                              </div>
                            </div>
                            <div
                              className={`px-2 py-1 rounded text-[10px] font-black ${
                                doc.risks > 3
                                  ? "bg-[#E63946]/10 text-[#E63946]"
                                  : "bg-[#308970]/10 text-[#308970]"
                              }`}
                            >
                              {doc.risks} RISKS
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>

                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-[#308970] font-black text-xs uppercase hover:bg-[#F2F1EE]"
                  >
                    View All History <ArrowRight className="w-3 h-3 ml-2" />
                  </Button>
                </div>

                {/* Search / Filter Card */}
                <div className="bg-[#308970] rounded-3xl p-6 text-white">
                  <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-4">
                    Quick Search
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      placeholder="Find a document..."
                      className="bg-white/10 border-white/20 placeholder:text-white/40 text-white pl-10 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
