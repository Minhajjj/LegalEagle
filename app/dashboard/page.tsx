"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { DocumentCard } from "@/components/document-card";
import { Input } from "@/components/ui/input";
import { Search, Grid, List, Plus, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Mock data
const mockDocuments = [
  { id: 1, name: "Employment Agreement - Tech Corp", riskLevel: "High" as const, date: "2024-01-15" },
  { id: 2, name: "NDA - Partnership Agreement", riskLevel: "Medium" as const, date: "2024-01-10" },
  { id: 3, name: "Service Contract - Client ABC", riskLevel: "Low" as const, date: "2024-01-05" },
  { id: 4, name: "Lease Agreement - Office Space", riskLevel: "Medium" as const, date: "2023-12-28" },
  { id: 5, name: "Purchase Agreement - Equipment", riskLevel: "Low" as const, date: "2023-12-20" },
  { id: 6, name: "Consulting Agreement - Project X", riskLevel: "High" as const, date: "2023-12-15" },
];

export default function DashboardPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDocuments = mockDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F2F1EE]">
      <div className="flex">
        <Sidebar />
        
        <div className="flex-1 ml-20">
          <div className="container mx-auto px-8 py-12">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-[#1C212B] mb-2">Your Vault</h1>
                  <p className="text-[#1C212B]/60">Manage and analyze your legal documents</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button className="bg-[#308970] hover:bg-[#2a7863]" asChild>
                    <Link href="/">
                      <Plus className="w-4 h-4 mr-2" />
                      Upload Document
                    </Link>
                  </Button>
                  <Button variant="outline">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="icon"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#1C212B]/60 mb-1">Total Documents</p>
                    <p className="text-2xl font-bold text-[#1C212B]">{mockDocuments.length}</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#1C212B]/60 mb-1">High Risk</p>
                    <p className="text-2xl font-bold text-[#E63946]">
                      {mockDocuments.filter(d => d.riskLevel === "High").length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#1C212B]/60 mb-1">Medium Risk</p>
                    <p className="text-2xl font-bold text-[#F4A261]">
                      {mockDocuments.filter(d => d.riskLevel === "Medium").length}
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-[#1C212B]/60 mb-1">Low Risk</p>
                    <p className="text-2xl font-bold text-[#308970]">
                      {mockDocuments.filter(d => d.riskLevel === "Low").length}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              {/* Search Bar */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#1C212B]/40" />
                <Input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white"
                />
              </div>
            </div>

          {/* Document Grid/List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Link key={doc.id} href={`/analyze/${doc.id}`}>
                  <DocumentCard
                    name={doc.name}
                    riskLevel={doc.riskLevel}
                    date={doc.date}
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
                  className="block bg-white border border-[#E5E5E5] rounded-lg p-4 flex items-center justify-between cursor-pointer hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${doc.riskLevel === "High" ? "bg-[#E63946]" : doc.riskLevel === "Medium" ? "bg-[#F4A261]" : "bg-[#308970]"}`} />
                    <div>
                      <h3 className="font-semibold text-[#1C212B]">{doc.name}</h3>
                      <p className="text-xs text-[#1C212B]/60">{doc.date}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {filteredDocuments.length === 0 && (
            <div className="text-center py-16">
              <p className="text-[#1C212B]/60">No documents found</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

