"use client";

import { useState, useCallback, useRef } from "react"; // Added useRef
import { Upload, Shield, Zap, Lock, Loader2 } from "lucide-react"; // Added Loader2 for loading icon
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { processDocument } from "@/app/dashboard/action"; // Import your server action
import { useRouter } from "next/navigation";

export function MainPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // New state for loading
  const fileInputRef = useRef<HTMLInputElement>(null); // Ref to trigger file browser
  const router = useRouter();

  // The core upload function
  const onUpload = async (file: File) => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const result = await processDocument(formData);

      if (result.success) {
        // Redirect to the forensics page once the AI is done chunking
        router.push(`/dashboard/documents/${result.documentId}`);
      }
    } catch (error) {
      console.error("Forensic analysis failed:", error);
      alert("There was an error analyzing the document. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]); // Trigger the AI pipeline
    }
  }, []);

  return (
    <main className="container mx-auto px-6 py-20">
      {/* Hero Section */}
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-[#1C212B] mb-6 leading-tight">
          Don't sign what you don't understand.
        </h1>
        <p className="text-xl text-[#1C212B]/70 mb-12 max-w-2xl mx-auto">
          Professional-grade AI forensic analysis for legal documents
        </p>
      </div>

      {/* Drop Zone */}
      <div className="max-w-3xl mx-auto mb-16">
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-2xl p-16 text-center transition-all
            ${isUploading ? "opacity-60 cursor-not-allowed" : ""} 
            ${
              isDragging
                ? "border-[#308970] bg-[#308970]/10"
                : "border-[#308970]/30 bg-[#308970]/5"
            }
          `}
        >
          {/* Hidden File Input for the 'Choose File' button */}
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".pdf,.docx,.txt"
            onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
          />

          <div className="flex flex-col items-center justify-center">
            <div className="mb-6">
              {isUploading ? (
                <Loader2 className="w-16 h-16 text-[#308970] animate-spin" />
              ) : (
                <Upload className="w-16 h-16 text-[#308970]" />
              )}
            </div>
            <h2 className="text-2xl font-semibold text-[#1C212B] mb-3">
              {isUploading ? "Analyzing Document..." : "Drop your document here"}
            </h2>
            <p className="text-[#1C212B]/60 mb-6">
              {isUploading 
                ? "Our AI is extracting clauses and identifying risks..." 
                : "Or click to browse. Supports PDF, DOCX, and TXT files."}
            </p>
            <Button 
              size="lg" 
              className="bg-[#308970] hover:bg-[#2a7863]"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? "Processing..." : "Choose File"}
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto mt-32 mb-20">
        <h2 className="text-3xl font-bold text-[#1C212B] text-center mb-12">
          Why LegalEagle?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-[#E5E5E5]">
            <CardHeader>
              <Shield className="w-10 h-10 text-[#308970] mb-4" />
              <CardTitle>AI-Powered Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#1C212B]/70">
                Advanced AI algorithms scan your documents for hidden risks,
                unfair clauses, and potential legal pitfalls.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#E5E5E5]">
            <CardHeader>
              <Zap className="w-10 h-10 text-[#308970] mb-4" />
              <CardTitle>Lightning Fast</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#1C212B]/70">
                Get comprehensive analysis in minutes, not days. Upload,
                analyze, and understand your documents instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="border-[#E5E5E5]">
            <CardHeader>
              <Lock className="w-10 h-10 text-[#308970] mb-4" />
              <CardTitle>Secure & Private</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#1C212B]/70">
                Your documents are encrypted and stored securely. We never share
                your data with third parties.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trusted By Section */}
      <div className="max-w-4xl mx-auto mb-20">
        <p className="text-center text-sm text-[#1C212B]/50 mb-6 uppercase tracking-wide">
          Trusted by
        </p>
        <div className="flex items-center justify-center gap-12 opacity-40 grayscale">
          <div className="h-8 w-24 bg-[#1C212B]/20 rounded"></div>
          <div className="h-8 w-24 bg-[#1C212B]/20 rounded"></div>
          <div className="h-8 w-24 bg-[#1C212B]/20 rounded"></div>
          <div className="h-8 w-24 bg-[#1C212B]/20 rounded"></div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-2xl mx-auto text-center py-16">
        <h2 className="text-3xl font-bold text-[#1C212B] mb-4">
          Ready to protect your legal interests?
        </h2>
        <p className="text-[#1C212B]/70 mb-8">
          Join thousands of professionals who trust LegalEagle for document
          analysis.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Button size="lg" className="bg-[#308970] hover:bg-[#2a7863]" asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}