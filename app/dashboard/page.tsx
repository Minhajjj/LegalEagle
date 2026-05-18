"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { DocumentCard } from "@/components/document-card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Grid,
  List,
  Plus,
  Filter,
  Loader2,
  FileText,
  Sparkles,
  GitCompare,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { renameDocument, deleteDocument } from "./action";
import { AnimatedCounter } from "@/components/animated-counter";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

interface Document {
  id: string;
  name: string;
  risk_level?: "High" | "Medium" | "Low";
  risk_count?: number;
  created_at: string;
  status: string;
  file_size: number;
  file_type: string;
}

function timeGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const reduceMotion = useAppReducedMotion();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [riskTotals, setRiskTotals] = useState({ high: 0, medium: 0, low: 0 });
  const [riskFilter, setRiskFilter] = useState<"All" | "High" | "Medium" | "Low">("All");
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [greeting] = useState(() => timeGreeting());

  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newDocumentName, setNewDocumentName] = useState("");
  const [isActionLoading, setIsActionLoading] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const fetchDocuments = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("documents")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;

        const { data: riskRows, error: riskError } = await supabase
          .from("document_risks")
          .select("document_id, severity")
          .eq("user_id", user.id);

        if (riskError) throw riskError;

        if (isMounted) {
          const safeData = data || [];
          const safeRiskRows =
            (riskRows as Array<{
              document_id: string;
              severity: "High" | "Medium" | "Low";
            }>) || [];

          const severityWeight: Record<"High" | "Medium" | "Low", number> = {
            High: 3,
            Medium: 2,
            Low: 1,
          };

          const riskByDocument = safeRiskRows.reduce(
            (acc, row) => {
              const bucket = acc[row.document_id] || {
                worst: null as "High" | "Medium" | "Low" | null,
                count: 0,
              };
              bucket.count += 1;
              if (
                !bucket.worst ||
                severityWeight[row.severity] > severityWeight[bucket.worst]
              ) {
                bucket.worst = row.severity;
              }
              acc[row.document_id] = bucket;
              return acc;
            },
            {} as Record<
              string,
              { worst: "High" | "Medium" | "Low" | null; count: number }
            >,
          );

          const docsWithRisk = safeData.map((doc: Document & { id: string }) => {
            const riskInfo = riskByDocument[doc.id];
            return {
              ...doc,
              risk_level: riskInfo?.worst || "Low",
              risk_count: riskInfo?.count || 0,
            };
          });

          const totals = safeRiskRows.reduce(
            (acc, row) => {
              if (row.severity === "High") acc.high += 1;
              if (row.severity === "Medium") acc.medium += 1;
              if (row.severity === "Low") acc.low += 1;
              return acc;
            },
            { high: 0, medium: 0, low: 0 },
          );

          setDocuments(docsWithRisk);
          setRiskTotals(totals);
          setInitialLoadComplete(true);
          setLoading(false);
        }
      } catch (error) {
        console.error("Dashboard Error:", error);
        if (isMounted) {
          setLoading(false);
          setInitialLoadComplete(true);
        }
      }
    };

    fetchDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRename = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDocument || !newDocumentName.trim()) return;
    
    try {
      setIsActionLoading(true);
      await renameDocument(selectedDocument.id, newDocumentName);
      
      setDocuments(prev => 
        prev.map(doc => doc.id === selectedDocument.id ? { ...doc, name: newDocumentName } : doc)
      );
      setIsRenameModalOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error("Rename failed", err);
      alert("Failed to rename document.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedDocument) return;
    
    try {
      setIsActionLoading(true);
      await deleteDocument(selectedDocument.id);
      
      setDocuments(prev => prev.filter(doc => doc.id !== selectedDocument.id));
      setIsDeleteModalOpen(false);
      setSelectedDocument(null);
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete document.");
    } finally {
      setIsActionLoading(false);
    }
  };

  const openRenameModal = (doc: Document, e: React.MouseEvent) => {
    setSelectedDocument(doc);
    setNewDocumentName(doc.name);
    setIsRenameModalOpen(true);
  };

  const openDeleteModal = (doc: Document, e: React.MouseEvent) => {
    setSelectedDocument(doc);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    if (reduceMotion || !initialLoadComplete || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-dashboard-stagger]",
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
          clearProps: "transform",
        },
      );
    });
    return () => ctx.revert();
  }, [initialLoadComplete, loading, reduceMotion, documents.length]);

  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = riskFilter === "All" || doc.risk_level === riskFilter;
      return matchesSearch && matchesFilter;
    });
  }, [documents, searchQuery, riskFilter]);

  const recentDocuments = useMemo(
    () => filteredDocuments.slice(0, 5),
    [filteredDocuments],
  );

  const stats = useMemo(() => {
    return {
      total: documents.length,
      high: riskTotals.high,
      medium: riskTotals.medium,
      low: riskTotals.low,
    };
  }, [documents.length, riskTotals.high, riskTotals.medium, riskTotals.low]);

  const formatFileSize = useCallback((bytes: number) => {
    if (!bytes) return "0 B";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }, []);

  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }, []);

  if (loading && !initialLoadComplete) {
    return (
      <div
        className="min-h-screen flex"
        style={{ backgroundColor: le.background }}
      >
        <Sidebar />
        <div className="flex-1 flex items-center justify-center w-full max-w-full overflow-x-hidden">
          <motion.div
            className="text-center"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
          >
            <Loader2
              className="w-12 h-12 mx-auto mb-4 animate-spin"
              style={{ color: le.primary }}
            />
            <p className="font-semibold" style={{ color: le.primary }}>
              Loading your workspace…
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  const statCardBase =
    "rounded-[12px] border border-slate-200/80 bg-white shadow-sm shadow-slate-200/40";

  return (
    <div
      className="min-h-screen flex"
      style={{ backgroundColor: le.background }}
    >
      <Sidebar />

      <div className="flex-1 overflow-x-hidden w-full max-w-full">
        <motion.div
          className="container mx-auto px-6 sm:px-8 py-10 lg:py-12"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <div className="mb-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between mb-8">
              <motion.div
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: le.muted }}
                >
                  {greeting}
                </p>
                <h1
                  className="text-4xl lg:text-[48px] font-bold tracking-tight mb-2"
                  style={{ color: le.text }}
                >
                  Your vault
                </h1>
                <p className="text-base max-w-xl" style={{ color: le.muted }}>
                  Manage and analyze your legal documents with clarity and
                  confidence.
                </p>
              </motion.div>

              <div className="flex flex-wrap items-center gap-3">
                <motion.div
                  whileHover={
                    reduceMotion ? undefined : { scale: 1.02, y: -2 }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  transition={springSnappy}
                >
                  <Button
                    className="font-semibold text-white shadow-md border-0 rounded-[8px]"
                    style={{ backgroundColor: le.primary }}
                    asChild
                  >
                    <Link href="/analyze">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload document
                    </Link>
                  </Button>
                </motion.div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={
                        reduceMotion ? undefined : { scale: 1.02, y: -2 }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      transition={springSnappy}
                    >
                      <Button
                        variant={riskFilter !== "All" ? "default" : "outline"}
                        className="font-semibold rounded-[8px] border-slate-200"
                        style={
                          riskFilter !== "All"
                            ? { backgroundColor: le.primary, color: "#fff" }
                            : { color: le.primary, backgroundColor: "white" }
                        }
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        {riskFilter === "All" ? "Filter" : riskFilter}
                      </Button>
                    </motion.div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={() => setRiskFilter("All")} className="cursor-pointer">All Risks</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRiskFilter("High")} className="cursor-pointer">High Risk</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRiskFilter("Medium")} className="cursor-pointer">Medium Risk</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setRiskFilter("Low")} className="cursor-pointer">Low Risk</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <div className="flex items-center gap-1 p-1 rounded-[8px] bg-white border border-slate-200 shadow-sm">
                  <motion.div
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      className="rounded-[8px]"
                      style={
                        viewMode === "grid"
                          ? { backgroundColor: le.primary, color: "#fff" }
                          : { color: le.primary }
                      }
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                  </motion.div>
                  <motion.div
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                      className="rounded-[8px]"
                      style={
                        viewMode === "list"
                          ? { backgroundColor: le.primary, color: "#fff" }
                          : { color: le.primary }
                      }
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
              {[
                {
                  label: "Total documents",
                  value: stats.total,
                  accent: le.primary,
                  sub: "In your workspace",
                },
                {
                  label: "High severity",
                  value: stats.high,
                  accent: le.warning,
                  sub: "Flags in corpus",
                },
                {
                  label: "Medium severity",
                  value: stats.medium,
                  accent: le.medium,
                  sub: "Flags in corpus",
                },
                {
                  label: "Low severity",
                  value: stats.low,
                  accent: le.success,
                  sub: "Flags in corpus",
                },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={
                    reduceMotion ? false : { opacity: 0, y: 20 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: reduceMotion ? 0 : i * 0.08,
                    duration: 0.35,
                    ease: "easeOut",
                  }}
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { y: -4, boxShadow: "0 12px 28px rgba(15,23,42,0.12)" }
                  }
                  className={statCardBase}
                >
                  <Card className="border-0 shadow-none bg-transparent rounded-[12px]">
                    <CardContent className="p-5">
                      <p
                        className="text-xs font-semibold uppercase tracking-wider mb-2"
                        style={{ color: le.muted }}
                      >
                        {item.label}
                      </p>
                      <p
                        className="text-3xl font-bold tabular-nums"
                        style={{ color: item.accent }}
                      >
                        <AnimatedCounter value={item.value} />
                      </p>
                      <p
                        className="text-sm mt-1"
                        style={{ color: le.muted }}
                      >
                        {item.sub}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 mb-8">
              {[
                { href: "/analyze", label: "New analysis", icon: Sparkles },
                { href: "/compare", label: "Clause comparison", icon: GitCompare },
                { href: "/templates", label: "Templates", icon: FileText },
              ].map((action, i) => (
                <motion.div
                  key={action.href}
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={
                    reduceMotion ? undefined : { scale: 1.02, y: -2 }
                  }
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  transition={{
                    ...springSnappy,
                    delay: reduceMotion ? 0 : 0.15 + i * 0.06,
                  }}
                >
                  <Button
                    variant="outline"
                    className="rounded-[8px] font-semibold bg-white border border-slate-200 shadow-sm"
                    style={{ color: le.primary }}
                    asChild
                  >
                    <Link href={action.href} className="flex items-center">
                      <action.icon className="w-4 h-4 mr-2" />
                      {action.label}
                    </Link>
                  </Button>
                </motion.div>
              ))}
            </div>

            <motion.div
              className="relative max-w-md mb-8"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: reduceMotion ? 0 : 0.2, duration: 0.35 }}
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: le.muted }}
              />
              <Input
                type="text"
                placeholder="Search documents…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11 rounded-[8px] border-slate-200 bg-white focus-visible:ring-2 transition-shadow"
                style={
                  {
                    ["--tw-ring-color" as string]: `${le.secondary}40`,
                  } as React.CSSProperties
                }
              />
            </motion.div>
          </div>

          {filteredDocuments.length === 0 ? (
            <motion.div
              className="text-center py-20 rounded-[16px] border-2 border-dashed border-slate-200 bg-white"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="w-16 h-16 rounded-[12px] flex items-center justify-center mx-auto mb-5"
                style={{ backgroundColor: `${le.primary}12` }}
              >
                <FileText className="w-8 h-8" style={{ color: le.primary }} />
              </div>
              <h3
                className="text-[28px] font-semibold mb-2"
                style={{ color: le.text }}
              >
                Vault is empty
              </h3>
              <p className="text-base mb-8 max-w-md mx-auto" style={{ color: le.muted }}>
                Upload a document to run your first AI-assisted review.
              </p>
              <motion.div
                whileHover={
                  reduceMotion ? undefined : { scale: 1.02, y: -2 }
                }
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={springSnappy}
                className="inline-block"
              >
                <Button
                  className="font-semibold text-white rounded-[8px] px-8"
                  style={{ backgroundColor: le.secondary }}
                  asChild
                >
                  <Link href="/analyze">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload now
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          ) : (
            <>
              {recentDocuments.length > 0 && (
                <div className="mb-10">
                  <h2
                    className="text-lg font-semibold mb-4"
                    style={{ color: le.text }}
                  >
                    Recent documents
                  </h2>
                  <div className="space-y-2">
                    {recentDocuments.map((doc, i) => (
                      <motion.div
                        key={doc.id}
                        data-dashboard-stagger
                        initial={
                          reduceMotion ? false : { opacity: 0, x: -8 }
                        }
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          delay: reduceMotion ? 0 : i * 0.05,
                          duration: 0.3,
                        }}
                      >
                        <Link href={`/analyze/${doc.id}`}>
                          <motion.div
                            className="flex items-center justify-between rounded-[12px] border border-slate-200 bg-white px-4 py-3"
                            whileHover={
                              reduceMotion
                                ? undefined
                                : {
                                    scale: 1.01,
                                    boxShadow:
                                      "0 10px 25px rgba(15,23,42,0.08)",
                                  }
                            }
                            transition={{ duration: 0.2 }}
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <FileText
                                className="w-5 h-5 shrink-0"
                                style={{ color: le.secondary }}
                              />
                              <div className="min-w-0">
                                <p
                                  className="font-medium truncate"
                                  style={{ color: le.text }}
                                >
                                  {doc.name}
                                </p>
                                <p className="text-sm" style={{ color: le.muted }}>
                                  {formatDate(doc.created_at)} · {doc.status}
                                </p>
                              </div>
                            </div>
                            <span
                              className="text-xs font-semibold uppercase shrink-0 px-2 py-1 rounded-md"
                              style={{
                                backgroundColor:
                                  doc.risk_level === "High"
                                    ? `${le.warning}18`
                                    : doc.risk_level === "Medium"
                                      ? `${le.medium}22`
                                      : `${le.success}18`,
                                color:
                                  doc.risk_level === "High"
                                    ? le.warning
                                    : doc.risk_level === "Medium"
                                      ? le.medium
                                      : le.success,
                              }}
                            >
                              {doc.risk_level}
                            </span>
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              <h2
                className="text-lg font-semibold mb-4"
                style={{ color: le.text }}
              >
                All documents
              </h2>

              {viewMode === "grid" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredDocuments.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      data-dashboard-stagger
                      initial={
                        reduceMotion ? false : { opacity: 0, y: 20 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : (i % 6) * 0.05,
                        duration: 0.35,
                      }}
                    >
                      <Link href={`/analyze/${doc.id}`} className="block relative">
                        <DocumentCard
                          name={doc.name}
                          riskLevel={doc.risk_level || "Low"}
                          date={formatDate(doc.created_at)}
                          onRename={(e) => openRenameModal(doc, e)}
                          onDelete={(e) => openDeleteModal(doc, e)}
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredDocuments.map((doc, i) => (
                    <motion.div
                      key={doc.id}
                      data-dashboard-stagger
                      initial={
                        reduceMotion ? false : { opacity: 0, y: 12 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: reduceMotion ? 0 : (i % 8) * 0.04,
                        duration: 0.3,
                      }}
                    >
                      <Link href={`/analyze/${doc.id}`} className="block">
                        <motion.div
                          className="relative rounded-[12px] border border-slate-200 bg-white p-4 cursor-pointer"
                          whileHover={
                            reduceMotion
                              ? undefined
                              : { y: -3, boxShadow: "0 12px 28px rgba(15,23,42,0.1)" }
                          }
                          transition={{ duration: 0.2 }}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 min-w-0">
                              <div
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    doc.risk_level === "High"
                                      ? le.warning
                                      : doc.risk_level === "Medium"
                                        ? le.medium
                                        : le.success,
                                }}
                              />
                              <div className="min-w-0">
                                <h3
                                  className="font-semibold truncate"
                                  style={{ color: le.text }}
                                >
                                  {doc.name}
                                </h3>
                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-sm" style={{ color: le.muted }}>
                                  <span>{formatDate(doc.created_at)}</span>
                                  <span>·</span>
                                  <span>{formatFileSize(doc.file_size)}</span>
                                  <span>·</span>
                                  <span className="uppercase text-xs font-medium">
                                    {doc.status}
                                  </span>
                                  <span>·</span>
                                  <span>{doc.risk_count || 0} risks</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-3">
                              <div
                                className="text-xs font-semibold uppercase px-3 py-1.5 rounded-full shrink-0"
                                style={{
                                  backgroundColor:
                                    doc.risk_level === "High"
                                      ? `${le.warning}15`
                                      : doc.risk_level === "Medium"
                                        ? `${le.medium}20`
                                        : `${le.success}15`,
                                  color:
                                    doc.risk_level === "High"
                                      ? le.warning
                                      : doc.risk_level === "Medium"
                                        ? le.medium
                                        : le.success,
                                }}
                              >
                                {doc.risk_level} risk
                              </div>
                              <div className="shrink-0 flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 rounded-[8px] text-slate-500 hover:text-slate-800"
                                  onClick={(e) => openRenameModal(doc, e)}
                                >
                                  Rename
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 rounded-[8px] text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={(e) => openDeleteModal(doc, e)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* RENAME MODAL */}
      <AnimatePresence>
        {isRenameModalOpen && selectedDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isActionLoading && setIsRenameModalOpen(false)}
            />
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              transition={springSnappy}
              className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-slate-200"
            >
              <h3 className="text-xl font-bold mb-2 text-slate-900">Rename document</h3>
              <p className="text-sm text-slate-500 mb-6">Enter a new name for your document.</p>
              
              <form onSubmit={handleRename}>
                <Input
                  autoFocus
                  name="rename_input"
                  value={newDocumentName}
                  onChange={(e) => setNewDocumentName(e.target.value)}
                  className="mb-6 h-11"
                  placeholder="Document name"
                  disabled={isActionLoading}
                />
                
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsRenameModalOpen(false)}
                    disabled={isActionLoading}
                    className="rounded-[8px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isActionLoading || !newDocumentName.trim()}
                    style={{ backgroundColor: le.primary }}
                    className="text-white rounded-[8px]"
                  >
                    {isActionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                    Save changes
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && selectedDocument && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => !isActionLoading && setIsDeleteModalOpen(false)}
            />
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 10 }}
              transition={springSnappy}
              className="relative w-[90%] max-w-md bg-white rounded-2xl shadow-2xl p-6 border border-red-100"
            >
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Delete document?</h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete <span className="font-semibold text-slate-900">"{selectedDocument.name}"</span>? 
                This action cannot be undone and all associated analysis will be permanently removed.
              </p>
              
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isActionLoading}
                  className="rounded-[8px]"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleDelete}
                  disabled={isActionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-[8px]"
                >
                  {isActionLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                  Delete permanently
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
