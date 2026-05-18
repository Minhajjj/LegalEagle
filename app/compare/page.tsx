"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Check, X, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import gsap from "gsap";
import benchmarkClauses from "@/seed/benchmark-clauses.json";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

type BenchmarkClause = (typeof benchmarkClauses)[number];

/** Illustrative “user” clauses for side-by-side UI — static copy only, no API. */
const USER_SNIPPETS: Record<string, string> = {
  confidentiality:
    "Recipient may share confidential information with affiliates without prior consent.",
  force_majeure:
    "Neither party is excused for delay except for acts of war; natural events excluded.",
  termination:
    "This agreement terminates immediately upon written notice without cure period.",
  indemnification:
    "Each party bears its own legal costs; no third-party indemnity is provided.",
  governing_law:
    "Disputes shall be resolved under the laws of New York, USA, in state courts.",
};

export default function ComparePage() {
  const reduceMotion = useAppReducedMotion();
  const [tab, setTab] = useState("all");
  const rows = benchmarkClauses as BenchmarkClause[];

  const filtered = useMemo(() => {
    if (tab === "all") return rows;
    return rows.filter((r) => r.risk_level_if_missing === tab);
  }, [rows, tab]);

  useEffect(() => {
    if (reduceMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-compare-row]",
        { opacity: 0, x: (i) => (i % 2 === 0 ? -24 : 24) },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
        },
      );
    });
    return () => ctx.revert();
  }, [filtered, tab, reduceMotion]);

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: le.background }}>
      <Sidebar />
      <div className="flex-1 overflow-x-hidden w-full max-w-full">
        <div className="container mx-auto px-6 sm:px-8 py-10 max-w-6xl">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-8"
          >
            <Link href="/dashboard">
              <Button variant="ghost" className="mb-4 -ml-2" style={{ color: le.primary }}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: le.text }}>
              Clause comparison
            </h1>
            <p className="text-base max-w-2xl" style={{ color: le.muted }}>
              Side-by-side view of your draft language versus benchmark clauses.
              Reference data is illustrative; connect your own documents from Analyze.
            </p>
          </motion.div>

          <div className="flex flex-wrap gap-2 mb-8 p-1 rounded-[8px] bg-white border border-slate-200 w-fit">
            {[
              { id: "all", label: "All" },
              { id: "high", label: "High risk" },
              { id: "medium", label: "Medium" },
              { id: "low", label: "Low" },
            ].map((t) => (
              <motion.div key={t.id} whileTap={reduceMotion ? undefined : { scale: 0.97 }}>
                <Button
                  type="button"
                  variant={tab === t.id ? "default" : "ghost"}
                  className="rounded-[8px] font-medium"
                  style={
                    tab === t.id
                      ? { backgroundColor: le.primary, color: "#fff" }
                      : { color: le.primary }
                  }
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="space-y-6">
              {filtered.map((clause) => {
                const userText =
                  USER_SNIPPETS[clause.clause_type] ??
                  "No sample draft for this clause type.";
                const differs = true;

                return (
                  <div key={clause.clause_type} data-compare-row>
                    <motion.div
                      className="rounded-[12px] border border-slate-200 bg-white shadow-sm overflow-hidden"
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { boxShadow: "0 14px 32px rgba(15,23,42,0.1)" }
                      }
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2"
                        style={{ backgroundColor: `${le.primary}06` }}
                      >
                        <h2 className="font-semibold" style={{ color: le.text }}>
                          {clause.title}
                        </h2>
                        <span
                          className="text-xs font-semibold uppercase px-2 py-1 rounded-md"
                          style={{
                            backgroundColor:
                              clause.risk_level_if_missing === "high"
                                ? `${le.warning}18`
                                : clause.risk_level_if_missing === "medium"
                                  ? `${le.medium}22`
                                  : `${le.success}18`,
                            color:
                              clause.risk_level_if_missing === "high"
                                ? le.warning
                                : clause.risk_level_if_missing === "medium"
                                  ? le.medium
                                  : le.success,
                          }}
                        >
                          {clause.risk_level_if_missing} if missing
                        </span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                        <motion.div
                          className="p-5"
                          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: le.secondary }}>
                            Your clause
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: le.text }}>
                            {userText}
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: le.warning }}>
                            <motion.span
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={springSnappy}
                            >
                              <X className="w-5 h-5" />
                            </motion.span>
                            Differs from benchmark
                          </div>
                        </motion.div>
                        <motion.div
                          className="p-5"
                          initial={reduceMotion ? false : { opacity: 0, x: 16 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, margin: "-40px" }}
                          transition={{ duration: 0.4 }}
                        >
                          <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: le.success }}>
                            Benchmark
                          </p>
                          <p className="text-sm leading-relaxed" style={{ color: le.text }}>
                            {clause.standard_text}
                          </p>
                          <div className="mt-3 flex items-center gap-2 text-sm font-medium" style={{ color: le.success }}>
                            <motion.span
                              initial={reduceMotion ? false : { scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ ...springSnappy, delay: 0.05 }}
                            >
                              <Check className="w-5 h-5" />
                            </motion.span>
                            {differs ? "Preferred coverage" : "Aligned"}
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
