"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";

const BLOG_POSTS = [
  {
    slug: "ai-legal-analysis-ethics",
    title: "The Ethics of AI in Legal Document Analysis",
    excerpt:
      "Exploring the balance between algorithmic efficiency and human oversight in modern law practice.",
    date: "October 24, 2025",
    author: "David Chen",
    category: "Industry Trends",
  },
  {
    slug: "understanding-force-majeure",
    title: "Force Majeure Clauses: A Post-2020 Perspective",
    excerpt:
      "How recent global events have reshaped standard contract boilerplate and what you need to look for.",
    date: "November 02, 2025",
    author: "Sarah Jennings",
    category: "Legal Insights",
  },
  {
    slug: "legaleagle-v2-release",
    title: "Announcing LegalEagle v2.0",
    excerpt:
      "Faster processing, deeper risk analysis, and our new collaborative workspace features are here.",
    date: "November 15, 2025",
    author: "Elena Rodriguez",
    category: "Product Updates",
  },
];

export default function BlogPage() {
  const reduceMotion = useAppReducedMotion();

  return (
    <div className="min-h-screen pb-12 pt-24" style={{ backgroundColor: le.background }}>
      <div className="container mx-auto px-6">
        <motion.div
          className="mb-16 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
        >
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl" style={{ color: le.text }}>
            Insights & updates
          </h1>
          <p className="mx-auto max-w-2xl text-xl" style={{ color: le.muted }}>
            Legal tech, contracts, and product news from the LegalEagle team.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: reduceMotion ? 0 : 0.06 * i, duration: 0.4 }}
            >
              <Link
                href="#"
                className="group flex h-full flex-col overflow-hidden rounded-[12px] border border-slate-200 bg-white shadow-sm transition-all hover:border-slate-300 hover:shadow-lg"
              >
                <div className="relative aspect-video w-full bg-slate-100">
                  <div
                    className="absolute inset-0 flex items-center justify-center text-lg font-bold text-slate-300"
                  >
                    {post.category}
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="mb-3 flex items-center gap-4 text-xs" style={{ color: le.muted }}>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {post.author}
                    </span>
                  </div>
                  <h3
                    className="mb-2 text-xl font-bold transition-colors group-hover:text-[#2563eb]"
                    style={{ color: le.text }}
                  >
                    {post.title}
                  </h3>
                  <p className="mb-4 flex-1 text-sm" style={{ color: le.muted }}>
                    {post.excerpt}
                  </p>
                  <div
                    className="mt-auto flex items-center border-t border-slate-100 pt-4 text-sm font-semibold transition-colors group-hover:text-[#1d4ed8]"
                    style={{ color: le.secondary }}
                  >
                    Read article <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
