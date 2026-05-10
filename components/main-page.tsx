"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Upload,
  Shield,
  Zap,
  Lock,
  Loader2,
  ArrowRight,
  FileSearch,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { processDocument } from "@/app/dashboard/action";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

const STEPS = [
  {
    n: "01",
    title: "Upload",
    body: "Drop a PDF (up to 5 MB). We parse clauses and structure the text.",
  },
  {
    n: "02",
    title: "Analyze",
    body: "Models score severity and highlight wording that needs legal eyes.",
  },
  {
    n: "03",
    title: "Act",
    body: "Export, compare to benchmarks, and chat about specifics in context.",
  },
];

export function MainPage() {
  const reduceMotion = useAppReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);
  const sectionsRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (reduceMotion) return;
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll("[data-hero-el]"),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, ease: "power3.out" },
      );
    }
    if (sectionsRef.current) {
      gsap.fromTo(
        sectionsRef.current.querySelectorAll("[data-reveal]"),
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.55,
          stagger: 0.06,
          ease: "power2.out",
          delay: 0.15,
        },
      );
    }
  }, [reduceMotion]);

  const onUpload = useCallback(
    async (file: File) => {
      if (!file) return;
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file only.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("PDF must be smaller than 5MB.");
        return;
      }

      try {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        const result = await processDocument(formData);
        if (result.success) {
          router.push(`/analyze/${result.documentId}`);
        }
      } catch (error) {
        console.error("Forensic analysis failed:", error);
        alert("There was an error analyzing the document. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [router],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer.files?.[0]) onUpload(e.dataTransfer.files[0]);
    },
    [onUpload],
  );

  return (
    <main>
      {/* Hero — asymmetric split */}
      <section className="relative overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-white via-[#f8fafc] to-[#e8f0fa]">
        <div
          className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full blur-3xl opacity-40"
          style={{ background: le.secondary }}
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full blur-3xl opacity-25"
          style={{ background: le.primary }}
        />

        <div ref={heroRef} className="container relative mx-auto grid gap-12 px-6 py-16 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <div className="flex flex-col justify-center">
            <p
              data-hero-el
              className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-slate-600 shadow-sm backdrop-blur"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" aria-hidden />
              AI contract review
            </p>
            <h1
              data-hero-el
              className="text-4xl font-bold leading-[1.1] tracking-tight text-[#0f172a] md:text-5xl lg:text-[3.25rem]"
            >
              Clarity before{" "}
              <span className="bg-gradient-to-r from-[#1a3a52] to-[#2563eb] bg-clip-text text-transparent">
                you sign.
              </span>
            </h1>
            <p data-hero-el className="mt-6 max-w-lg text-lg text-slate-600">
              Surface risky clauses, benchmark language, and answer questions in context—without replacing
              your counsel.
            </p>

            <ul data-hero-el className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {["Severity-ranked findings", "Clause comparison", "Private vault"].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-2 text-sm font-semibold text-slate-700"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                  {t}
                </li>
              ))}
            </ul>

            <div data-hero-el className="mt-10 flex flex-wrap gap-3">
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={springSnappy}
              >
                <Button size="lg" className="rounded-[10px] px-8 font-semibold shadow-lg shadow-slate-900/10" asChild>
                  <Link href="/signup">Create free account</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                transition={springSnappy}
              >
                <Button size="lg" variant="outline" className="rounded-[10px] border-slate-300 px-8 font-semibold bg-white/90" asChild>
                  <Link href="/pricing">
                    View pricing <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            <div
              data-hero-el
              className="mt-12 grid max-w-md grid-cols-3 gap-4 border-t border-slate-200/90 pt-10"
            >
              {[
                { v: "Minutes", l: "Typical first pass" },
                { v: "PDF", l: "Supported format" },
                { v: "Vault", l: "Documents secured" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="text-xl font-bold tabular-nums text-[#1a3a52]">{s.v}</p>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upload panel */}
          <div data-hero-el className="relative flex items-center lg:justify-end">
            <motion.div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative w-full max-w-lg rounded-[20px] border-2 border-dashed p-10 shadow-2xl shadow-slate-900/10 backdrop-blur-sm md:p-12 ${
                isUploading ? "cursor-not-allowed opacity-70" : ""
              }`}
              style={{
                borderColor: isDragging ? le.secondary : "rgba(148, 163, 184, 0.55)",
                backgroundColor: isDragging ? "rgba(37, 99, 235, 0.06)" : "rgba(255,255,255,0.92)",
              }}
              animate={reduceMotion ? undefined : { scale: isDragging ? 1.02 : 1 }}
              transition={{ duration: 0.25 }}
            >
              <div
                className="pointer-events-none absolute inset-x-8 top-8 h-24 rounded-full opacity-[0.07]"
                style={{ background: le.primary }}
              />
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,application/pdf"
                onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
              />
              <div className="relative flex flex-col items-center text-center">
                <div
                  className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl shadow-inner ring-1 ring-slate-200/80"
                  style={{ background: `linear-gradient(145deg, ${le.primary}12, white)` }}
                >
                  {isUploading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-[#2563eb]" />
                  ) : (
                    <Upload className="h-8 w-8 text-[#1a3a52]" />
                  )}
                </div>
                <h2 className="text-xl font-bold text-[#0f172a] md:text-2xl">
                  {isUploading ? "Analyzing…" : "Try it now"}
                </h2>
                <p className="mt-2 max-w-xs text-sm text-slate-600">
                  {isUploading
                    ? "Extracting text and running risk detection."
                    : "Drop a contract PDF here or browse. Same pipeline as the app."}
                </p>
                <motion.div className="mt-8 w-full max-w-xs" whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                  <Button
                    className="h-12 w-full rounded-[10px] font-semibold shadow-md"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {isUploading ? "Processing…" : "Choose PDF"}
                  </Button>
                </motion.div>
                <p className="mt-4 text-xs text-slate-500">
                  Sign in is required to complete analysis—then uploads sync to your dashboard.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div ref={sectionsRef} className="bg-[#f8fafc]">
        {/* How it works */}
        <section className="container mx-auto px-6 py-20 lg:py-28">
          <div data-reveal className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">How it works</h2>
            <p className="mt-3 text-slate-600">Three focused steps from file to actionable insight.</p>
          </div>
          <div className="relative mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
            <div
              className="pointer-events-none absolute left-[16%] right-[16%] top-10 hidden h-0.5 bg-gradient-to-r from-transparent via-slate-300 to-transparent md:block"
              aria-hidden
            />
            {STEPS.map((s, i) => (
              <motion.div
                key={s.n}
                data-reveal
                className="relative rounded-[16px] border border-slate-200 bg-white p-8 shadow-sm"
                whileHover={reduceMotion ? undefined : { y: -6, boxShadow: "0 20px 40px rgba(15,23,42,0.08)" }}
              >
                <span
                  className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full text-sm font-black text-white"
                  style={{ background: i === 1 ? le.secondary : le.primary }}
                >
                  {s.n}
                </span>
                <h3 className="text-lg font-bold text-[#0f172a]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Bento capabilities */}
        <section className="border-y border-slate-200 bg-white">
          <div className="container mx-auto px-6 py-20 lg:py-24">
            <div data-reveal className="mb-12 max-w-xl">
              <h2 className="text-3xl font-bold text-[#0f172a] md:text-4xl">Built for review workflows</h2>
              <p className="mt-3 text-slate-600">
                Mix automated scanning with human judgment—organized for teams who live in contracts.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-4 md:grid-rows-2 lg:gap-5">
              <motion.div
                data-reveal
                className="flex flex-col justify-between rounded-[16px] border border-slate-200 bg-gradient-to-br from-[#1a3a52] to-[#243d5c] p-8 text-white md:col-span-2 md:row-span-2 min-h-[280px]"
                whileHover={reduceMotion ? undefined : { scale: 1.01 }}
              >
                <div>
                  <FileSearch className="mb-6 h-10 w-10 text-white/90" />
                  <h3 className="text-2xl font-bold">Structured risk map</h3>
                  <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/75">
                    Findings grouped by severity with confidence and suggested language—so reviewers know where to
                    spend time first.
                  </p>
                </div>
                <Link href="/analyze" className="mt-8 inline-flex items-center text-sm font-bold text-white/95 hover:underline">
                  Open analyzer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </motion.div>

              <motion.div
                data-reveal
                className="rounded-[16px] border border-slate-200 bg-[#f8fafc] p-6 md:col-span-2"
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <Scale className="mb-4 h-9 w-9 text-[#2563eb]" />
                <h3 className="text-lg font-bold text-[#0f172a]">Benchmark comparison</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Line up your clause against reference language—spot drift before it becomes liability.
                </p>
                <Button variant="link" className="mt-3 h-auto p-0 font-semibold text-[#2563eb]" asChild>
                  <Link href="/compare">Explore comparison</Link>
                </Button>
              </motion.div>

              <motion.div
                data-reveal
                className="rounded-[16px] border border-slate-200 p-6"
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <Zap className="mb-4 h-9 w-9 text-amber-500" />
                <h3 className="font-bold text-[#0f172a]">Fast iteration</h3>
                <p className="mt-2 text-sm text-slate-600">Re-run analysis when clauses change—history stays in your vault.</p>
              </motion.div>

              <motion.div
                data-reveal
                className="rounded-[16px] border border-slate-200 p-6"
                whileHover={reduceMotion ? undefined : { y: -4 }}
              >
                <Lock className="mb-4 h-9 w-9 text-emerald-600" />
                <h3 className="font-bold text-[#0f172a]">Private vault</h3>
                <p className="mt-2 text-sm text-slate-600">Encryption in transit and access scoped to your workspace.</p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Classic three columns */}
        <section className="container mx-auto px-6 py-20">
          <h2 data-reveal className="mb-12 text-center text-2xl font-bold text-[#0f172a] md:text-3xl">
            Why teams use LegalEagle
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Shield,
                title: "Defensible process",
                body: "Clear severity and rationale on each flag—easier handoff to counsel.",
              },
              {
                icon: Zap,
                title: "Less manual grep",
                body: "Spend review time on judgment, not hunting boilerplate across PDFs.",
              },
              {
                icon: Lock,
                title: "Control your data",
                body: "Separation by workspace with paths designed for sensitive agreements.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <motion.div
                key={title}
                data-reveal
                className="rounded-[14px] border border-slate-200 bg-white p-8 shadow-sm"
                whileHover={reduceMotion ? undefined : { y: -5 }}
              >
                <Icon className="mb-4 h-10 w-10 text-[#2563eb]" />
                <h3 className="text-lg font-bold text-[#0f172a]">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{body}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section
          className="relative overflow-hidden border-t border-white/10 py-20"
          style={{
            background: `linear-gradient(135deg, ${le.primary} 0%, #152a3f 55%, #1e3a5f 100%)`,
          }}
        >
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <div className="absolute -right-20 top-0 h-80 w-80 rounded-full bg-[#2563eb] blur-[100px]" />
          </div>
          <div data-reveal className="container relative mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold text-white md:text-4xl">Start your next review in minutes</h2>
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-300">
              Save analyses, compare clauses, and keep everything in one vault.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button size="lg" variant="secondary" className="rounded-[10px] px-10 font-semibold shadow-lg" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-[10px] border-white/40 bg-transparent px-10 font-semibold text-white hover:bg-white/10 hover:text-white"
                asChild
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
