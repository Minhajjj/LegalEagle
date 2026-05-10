"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Upload,
  FileText,
  Search,
  Clock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  X,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { processDocument } from "@/app/dashboard/action";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

interface RecentDocument {
  id: string;
  name: string;
  created_at: string;
  status: string;
  risk_count?: number;
}

export default function AnalyzeLandingPage() {
  const reduceMotion = useAppReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [recentDocs, setRecentDocs] = useState<RecentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchRecentDocuments();
  }, []);

  useEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-analyze-hero] > *",
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" },
      );
      gsap.fromTo(
        "[data-analyze-block]",
        { opacity: 0, y: 16, scale: 0.995 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.48,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.12,
        },
      );
    });
    return () => ctx.revert();
  }, [reduceMotion]);

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
      const docIds = (data || []).map((doc) => doc.id);
      let riskCountByDocument: Record<string, number> = {};
      if (docIds.length > 0) {
        const { data: riskRows, error: riskError } = await supabase
          .from("document_risks")
          .select("document_id")
          .in("document_id", docIds);
        if (riskError) throw riskError;
        riskCountByDocument = (riskRows || []).reduce(
          (acc, row) => {
            acc[row.document_id] = (acc[row.document_id] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>,
        );
      }

      const docsWithRisks = (data || []).map((doc: RecentDocument & { id: string }) => ({
        ...doc,
        risk_count: riskCountByDocument[doc.id] || 0,
      }));

      setRecentDocs(docsWithRisks);
    } catch (err) {
      console.error("Error fetching documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Invalid file type. Please upload a PDF file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File size exceeds 5MB limit.");
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
    if (file) handleFileSelect(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setError(null);
    setUploadProgress(0);
    setShowSuccess(false);

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 450);

      const formData = new FormData();
      formData.append("file", selectedFile);
      const result = await processDocument(formData);
      clearInterval(progressInterval);
      setUploadProgress(100);
      setShowSuccess(true);
      setTimeout(() => {
        router.push(`/analyze/${result.documentId}`);
      }, reduceMotion ? 400 : 900);
    } catch (err: unknown) {
      console.error("Upload error:", err);
      const message =
        err instanceof Error ? err.message : "Failed to upload document. Please try again.";
      setError(message);
      setUploading(false);
      setUploadProgress(0);
      setShowSuccess(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setUploading(false);
    setUploadProgress(0);
    setError(null);
    setShowSuccess(false);
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
    if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: le.background }}>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 ml-20 p-6 sm:p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div data-analyze-hero className="mb-10">
              <h1 className="text-3xl sm:text-[36px] font-bold mb-2" style={{ color: le.primary }}>
                Document analysis
              </h1>
              <p className="text-base font-medium max-w-xl" style={{ color: le.muted }}>
                Upload a PDF for structured risk review and clause-level guidance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6" data-analyze-block>
                <AnimatePresence mode="wait">
                  {!selectedFile ? (
                    <motion.div
                      key="drop"
                      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                      transition={{ duration: 0.35 }}
                    >
                      <motion.div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className="rounded-[16px] border-2 border-dashed p-10 sm:p-12 flex flex-col items-center justify-center text-center cursor-pointer bg-white"
                        style={{
                          borderColor: isDragging ? le.secondary : "rgba(100,116,139,0.35)",
                          boxShadow: isDragging
                            ? `0 0 0 4px ${le.secondary}22`
                            : "0 4px 24px rgba(15,23,42,0.06)",
                        }}
                        animate={
                          reduceMotion
                            ? undefined
                            : {
                                scale: isDragging ? 1.02 : 1,
                                backgroundColor: isDragging ? `${le.secondary}0d` : "#ffffff",
                              }
                        }
                        transition={{ duration: 0.25 }}
                        onClick={() => document.getElementById("file-upload")?.click()}
                      >
                        <motion.div
                          className="w-16 h-16 rounded-[12px] flex items-center justify-center mb-6"
                          style={{ backgroundColor: `${le.primary}12` }}
                          animate={
                            reduceMotion
                              ? undefined
                              : { y: isDragging ? -4 : 0, scale: isDragging ? 1.05 : 1 }
                          }
                        >
                          <Upload className="w-8 h-8" style={{ color: le.primary }} />
                        </motion.div>
                        <h3 className="text-xl font-semibold mb-2" style={{ color: le.text }}>
                          Drop your PDF here
                        </h3>
                        <p className="text-sm mb-8 max-w-sm" style={{ color: le.muted }}>
                          PDF only, up to 5 MB. Your file is processed securely.
                        </p>
                        <input
                          type="file"
                          id="file-upload"
                          className="hidden"
                          accept=".pdf,application/pdf"
                          onChange={handleFileInput}
                        />
                        <motion.div
                          whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                          transition={springSnappy}
                        >
                          <Button
                            type="button"
                            className="font-semibold text-white rounded-[8px] px-8"
                            style={{ backgroundColor: le.primary }}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById("file-upload")?.click();
                            }}
                          >
                            Browse files
                          </Button>
                        </motion.div>
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="file"
                      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={reduceMotion ? undefined : { opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.35 }}
                      className="rounded-[16px] border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50"
                    >
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <div className="flex items-center gap-4 min-w-0">
                          <div
                            className="w-12 h-12 rounded-[12px] flex items-center justify-center shrink-0"
                            style={{ backgroundColor: `${le.secondary}15` }}
                          >
                            <FileText className="w-6 h-6" style={{ color: le.secondary }} />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-semibold truncate" style={{ color: le.text }}>
                              {selectedFile.name}
                            </h3>
                            <p className="text-sm" style={{ color: le.muted }}>
                              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        {!uploading && (
                          <motion.button
                            type="button"
                            onClick={cancelUpload}
                            className="p-2 rounded-full hover:bg-slate-100 shrink-0"
                            style={{ color: le.muted }}
                            whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>

                      <AnimatePresence mode="wait">
                        {showSuccess ? (
                          <motion.div
                            key="ok"
                            initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="flex flex-col items-center py-8"
                          >
                            <motion.div
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={springSnappy}
                            >
                              <CheckCircle2 className="w-14 h-14 mb-3" style={{ color: le.success }} />
                            </motion.div>
                            <p className="font-semibold" style={{ color: le.text }}>
                              Processing complete
                            </p>
                            <p className="text-sm mt-1" style={{ color: le.muted }}>
                              Opening your analysis…
                            </p>
                          </motion.div>
                        ) : uploading ? (
                          <motion.div key="prog" className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-semibold flex items-center gap-2" style={{ color: le.primary }}>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Working…
                              </span>
                              <span className="font-semibold tabular-nums" style={{ color: le.secondary }}>
                                {uploadProgress}%
                              </span>
                            </div>
                            <div className="w-full h-2.5 rounded-full overflow-hidden bg-slate-100">
                              <motion.div
                                className="h-full rounded-full"
                                style={{ backgroundColor: le.secondary }}
                                initial={{ width: 0 }}
                                animate={{ width: `${uploadProgress}%` }}
                                transition={{ duration: 0.35, ease: "linear" }}
                              />
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="go"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                          >
                            <motion.div
                              whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                              transition={springSnappy}
                            >
                              <Button
                                type="button"
                                onClick={handleUpload}
                                className="w-full font-semibold text-white py-6 rounded-[8px]"
                                style={{ backgroundColor: le.secondary }}
                              >
                                Start analysis
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {error && (
                          <motion.div
                            initial={reduceMotion ? false : { opacity: 0, x: 0 }}
                            animate={
                              reduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, x: [0, -8, 8, -5, 5, 0] }
                            }
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.45 }}
                            className="mt-4 p-4 rounded-[8px] border"
                            style={{
                              backgroundColor: `${le.warning}10`,
                              borderColor: `${le.warning}55`,
                              color: le.warning,
                            }}
                          >
                            <p className="text-sm font-semibold">{error}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="grid grid-cols-2 gap-4" data-analyze-block>
                  {[
                    { icon: ShieldCheck, label: "Encrypted in transit" },
                    { icon: FileText, label: "Structured extraction" },
                  ].map((item) => (
                    <motion.div
                      key={item.label}
                      className="p-4 bg-white rounded-[12px] border border-slate-200 flex items-center gap-3"
                      whileHover={
                        reduceMotion ? undefined : { y: -2, boxShadow: "0 8px 24px rgba(15,23,42,0.08)" }
                      }
                    >
                      <div className="p-2 rounded-[8px]" style={{ backgroundColor: `${le.primary}10` }}>
                        <item.icon className="w-5 h-5" style={{ color: le.primary }} />
                      </div>
                      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: le.primary }}>
                        {item.label}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="space-y-6" data-analyze-block>
                <div className="bg-white rounded-[16px] border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-sm uppercase tracking-wider flex items-center gap-2" style={{ color: le.primary }}>
                      <Clock className="w-4 h-4" /> Recent scans
                    </h3>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin" style={{ color: le.secondary }} />
                    </div>
                  ) : recentDocs.length === 0 ? (
                    <p className="text-sm text-center py-8" style={{ color: le.muted }}>
                      No documents yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {recentDocs.map((doc, i) => (
                        <motion.div
                          key={doc.id}
                          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: reduceMotion ? 0 : i * 0.05 }}
                        >
                          <Link href={`/analyze/${doc.id}`}>
                            <motion.div
                              className="p-4 rounded-[12px] border border-transparent hover:border-slate-200 hover:bg-slate-50/80 cursor-pointer"
                              whileHover={reduceMotion ? undefined : { x: 4 }}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-3 min-w-0">
                                  <div
                                    className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${le.primary}10` }}
                                  >
                                    <FileText className="w-5 h-5" style={{ color: le.primary }} />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold truncate" style={{ color: le.text }}>
                                      {doc.name.length > 22 ? `${doc.name.slice(0, 22)}…` : doc.name}
                                    </p>
                                    <p className="text-xs uppercase font-medium" style={{ color: le.muted }}>
                                      {formatDate(doc.created_at)}
                                    </p>
                                  </div>
                                </div>
                                <span
                                  className="text-[10px] font-bold px-2 py-1 rounded-md shrink-0"
                                  style={{
                                    backgroundColor:
                                      doc.risk_count && doc.risk_count > 3
                                        ? `${le.warning}15`
                                        : `${le.success}15`,
                                    color:
                                      doc.risk_count && doc.risk_count > 3 ? le.warning : le.success,
                                  }}
                                >
                                  {doc.risk_count || 0} risks
                                </span>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  <motion.div whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                    <Button
                      variant="ghost"
                      className="w-full mt-4 font-semibold text-sm rounded-[8px]"
                      style={{ color: le.secondary }}
                      onClick={() => router.push("/dashboard")}
                    >
                      Full history <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </div>

                <div
                  className="rounded-[16px] p-6 text-white"
                  style={{
                    background: `linear-gradient(135deg, ${le.primary} 0%, #243d5c 100%)`,
                  }}
                >
                  <h4 className="font-semibold text-xs uppercase tracking-[0.15em] mb-4 opacity-90">
                    Quick search
                  </h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                    <Input
                      placeholder="Find a document…"
                      className="pl-10 rounded-[8px] border-white/25 bg-white/10 text-white placeholder:text-white/45 focus-visible:ring-2 focus-visible:ring-white/40"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          router.push(`/dashboard?search=${encodeURIComponent(e.currentTarget.value)}`);
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
