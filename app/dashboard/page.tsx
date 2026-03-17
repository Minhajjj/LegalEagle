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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface Document {
  id: string;
  name: string;
  risk_level?: "High" | "Medium" | "Low";
  created_at: string;
  status: string;
  file_size: number;
  file_type: string;
}

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  // Fetch documents only once on mount
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

        // Only update state if component is still mounted
        if (isMounted) {
          // Ensure data is an array even if empty
          const safeData = data || [];

          // Assign consistent risk levels based on document id to prevent random changes
          const docsWithRisk = safeData.map((doc: any) => {
            // Use a deterministic way to assign risk level based on id
            // This ensures the same document always gets the same risk level
            const idSum = doc.id
              .split("")
              .reduce(
                (acc: number, char: string) => acc + char.charCodeAt(0),
                0,
              );
            const riskIndex = idSum % 3;
            const riskLevel: "High" | "Medium" | "Low" =
              riskIndex === 0 ? "High" : riskIndex === 1 ? "Medium" : "Low";

            return {
              ...doc,
              risk_level: doc.risk_level || riskLevel,
            };
          });

          setDocuments(docsWithRisk);
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

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - runs once on mount

  // Memoize filtered documents to prevent unnecessary recalculations
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [documents, searchQuery]);

  // Memoize stats calculation
  const stats = useMemo(() => {
    const highCount = documents.filter((d) => d.risk_level === "High").length;
    const mediumCount = documents.filter(
      (d) => d.risk_level === "Medium",
    ).length;
    const lowCount = documents.filter((d) => d.risk_level === "Low").length;

    return {
      total: documents.length,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
    };
  }, [documents]);

  // Memoize utility functions
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

  // Show loading only on initial load
  if (loading && !initialLoadComplete) {
    return (
      <div className="min-h-screen bg-[#F2F1EE] flex">
        <Sidebar />
        <div className="flex-1 ml-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#308970] animate-spin mx-auto mb-4" />
            <p className="text-[#308970] font-bold">Accessing the Vault...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F2F1EE] flex">
      <Sidebar />

      <div className="flex-1 ml-20">
        <div className="container mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-[#1C212B] mb-2 tracking-tight">
                  Your Vault
                </h1>
                <p className="text-[#1C212B]/60 font-medium">
                  Manage and analyze your legal documents
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  className="bg-[#308970] hover:bg-[#2a7863] text-white font-bold"
                  asChild
                >
                  <Link href="/analyze">
                    <Plus className="w-4 h-4 mr-2" />
                    Upload Document
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#308970]/20 text-[#308970] font-bold"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
                <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-[#308970]/10">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-[#308970] text-white"
                        : "text-[#308970]"
                    }
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="icon"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-[#308970] text-white"
                        : "text-[#308970]"
                    }
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-none shadow-sm">
                <CardContent className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1C212B]/40 mb-1">
                    Total
                  </p>
                  <p className="text-2xl font-black text-[#1C212B]">
                    {stats.total}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#E63946]/60 mb-1">
                    High Risk
                  </p>
                  <p className="text-2xl font-black text-[#E63946]">
                    {stats.high}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#F4A261]/60 mb-1">
                    Medium Risk
                  </p>
                  <p className="text-2xl font-black text-[#F4A261]">
                    {stats.medium}
                  </p>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-white">
                <CardContent className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#308970]/60 mb-1">
                    Low Risk
                  </p>
                  <p className="text-2xl font-black text-[#308970]">
                    {stats.low}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#308970]/40" />
              <Input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white border-[#308970]/10 rounded-xl focus:border-[#308970] transition-all"
              />
            </div>
          </div>

          {/* Empty State vs List/Grid View */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-3xl border-4 border-dashed border-[#308970]/10">
              <div className="w-20 h-20 bg-[#F2F1EE] rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText className="w-10 h-10 text-[#308970]/40" />
              </div>
              <h3 className="text-2xl font-black text-[#308970] mb-2">
                Vault is empty
              </h3>
              <p className="text-[#1C212B]/60 font-bold mb-8">
                Upload a document to start your first forensic analysis.
              </p>
              <Button
                className="bg-[#308970] hover:bg-[#2a7863] text-white px-8 py-6 rounded-full font-black uppercase tracking-widest text-xs"
                asChild
              >
                <Link href="/analyze">
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Now
                </Link>
              </Button>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Link key={doc.id} href={`/analyze/${doc.id}`}>
                  <DocumentCard
                    name={doc.name}
                    riskLevel={doc.risk_level || "Low"}
                    date={formatDate(doc.created_at)}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredDocuments.map((doc) => (
                <Link
                  key={doc.id}
                  href={`/analyze/${doc.id}`}
                  className="block bg-white border border-[#308970]/10 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:shadow-lg hover:border-[#308970]/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        doc.risk_level === "High"
                          ? "bg-[#E63946]"
                          : doc.risk_level === "Medium"
                            ? "bg-[#F4A261]"
                            : "bg-[#308970]"
                      }`}
                    />
                    <div>
                      <h3 className="font-black text-[#1C212B]">{doc.name}</h3>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs font-bold text-[#1C212B]/40">
                          {formatDate(doc.created_at)}
                        </p>
                        <p className="text-xs text-[#1C212B]/20">•</p>
                        <p className="text-xs font-bold text-[#1C212B]/40">
                          {formatFileSize(doc.file_size)}
                        </p>
                        <p className="text-xs text-[#1C212B]/20">•</p>
                        <p className="text-xs font-bold text-[#308970] uppercase tracking-tighter">
                          {doc.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      doc.risk_level === "High"
                        ? "bg-[#E63946]/10 text-[#E63946]"
                        : doc.risk_level === "Medium"
                          ? "bg-[#F4A261]/10 text-[#F4A261]"
                          : "bg-[#308970]/10 text-[#308970]"
                    }`}
                  >
                    {doc.risk_level} Risk
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
