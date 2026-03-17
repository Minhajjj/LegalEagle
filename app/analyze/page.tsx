"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  X,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { processDocument } from "@/app/dashboard/action";

interface RecentDocument {
  id: string;
  name: string;
  created_at: string;
  status: string;
  risk_count?: number;
}

export default function AnalyzeLandingPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchRecentDocuments();
  }, []);

  const fetchRecentDocuments = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("documents")
        .select("id, name, created_at, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Add mock risk counts for demo
      const docsWithRisks = (data || []).map((doc: any) => ({
        ...doc,
        risk_count: Math.floor(Math.random() * 10) + 1, // Random 1-10 risks for demo
      }));

      setRecentDocs(docsWithRisks);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (!validTypes.includes(file.type)) {
      setError(
        "Invalid file type. Please upload PDF, DOCX, or TXT files only.",
      );
      return;
    }

    // Validate file size (25MB max)
    if (file.size > 25 * 1024 * 1024) {
      setError("File size exceeds 25MB limit.");
      return;
    }

    setSelectedFile(file);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Create FormData and append file
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Call server action
      const result = await processDocument(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Wait a moment to show 100% then redirect
      setTimeout(() => {
        router.push(`/analyze/${result.documentId}`);
      }, 500);
    } catch (error: any) {
      console.error("Upload error:", error);
      setError(error.message || "Failed to upload document. Please try again.");
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

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
                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
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
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                      onChange={handleFileInput}
                    />
                    <Button
                      onClick={() =>
                        document.getElementById("file-upload")?.click()
                      }
                      className="bg-[#308970] text-white px-8 py-6 rounded-full font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                      Select File
                    </Button>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border-4 border-[#308970]">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F2F1EE] rounded-xl flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[#308970]" />
                        </div>
                        <div>
                          <h3 className="font-black text-[#308970] mb-1">
                            {selectedFile.name}
                          </h3>
                          <p className="text-sm text-[#308970]/60">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      {!uploading && (
                        <button
                          onClick={cancelUpload}
                          className="p-2 hover:bg-[#F2F1EE] rounded-full transition-colors"
                        >
                          <X className="w-5 h-5 text-[#308970]" />
                        </button>
                      )}
                    </div>

                    {uploading ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-bold text-[#308970]">
                            Uploading...
                          </span>
                          <span className="font-bold text-[#308970]">
                            {uploadProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-[#F2F1EE] rounded-full h-2">
                          <div
                            className="bg-[#308970] h-2 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={handleUpload}
                        className="w-full bg-[#308970] text-white font-bold py-6 rounded-xl hover:bg-[#2a7863]"
                      >
                        Start Analysis
                      </Button>
                    )}

                    {error && (
                      <div className="mt-4 p-4 bg-[#E63946]/10 border border-[#E63946] rounded-xl">
                        <p className="text-sm font-bold text-[#E63946]">
                          {error}
                        </p>
                      </div>
                    )}
                  </div>
                )}

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

                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 text-[#308970] animate-spin" />
                    </div>
                  ) : recentDocs.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-sm text-[#308970]/60">
                        No documents yet
                      </p>
                    </div>
                  ) : (
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
                                    {doc.name.length > 20
                                      ? doc.name.substring(0, 20) + "..."
                                      : doc.name}
                                  </p>
                                  <p className="text-[10px] font-bold text-[#308970]/50 uppercase">
                                    {formatDate(doc.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div
                                className={`px-2 py-1 rounded text-[10px] font-black ${
                                  doc.risk_count && doc.risk_count > 3
                                    ? "bg-[#E63946]/10 text-[#E63946]"
                                    : "bg-[#308970]/10 text-[#308970]"
                                }`}
                              >
                                {doc.risk_count || 0}{" "}
                                {doc.risk_count === 1 ? "RISK" : "RISKS"}
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <Button
                    variant="ghost"
                    className="w-full mt-4 text-[#308970] font-black text-xs uppercase hover:bg-[#F2F1EE]"
                    onClick={() => router.push("/dashboard")}
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
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          router.push(
                            `/dashboard?search=${e.currentTarget.value}`,
                          );
                        }
                      }}
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
