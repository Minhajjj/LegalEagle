"use client";

import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";

const BLOG_POSTS = [
  {
    slug: "ai-legal-analysis-ethics",
    title: "The Ethics of AI in Legal Document Analysis",
    excerpt: "Exploring the balance between algorithmic efficiency and human oversight in modern law practice.",
    date: "October 24, 2025",
    author: "David Chen",
    category: "Industry Trends",
  },
  {
    slug: "understanding-force-majeure",
    title: "Force Majeure Clauses: A Post-2020 Perspective",
    excerpt: "How recent global events have reshaped standard contract boilerplate and what you need to look for.",
    date: "November 02, 2025",
    author: "Sarah Jennings",
    category: "Legal Insights",
  },
  {
    slug: "legaleagle-v2-release",
    title: "Announcing LegalEagle v2.0",
    excerpt: "Faster processing, deeper risk analysis, and our new collaborative workspace features are here.",
    date: "November 15, 2025",
    author: "Elena Rodriguez",
    category: "Product Updates",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F2F1EE] pt-24 pb-12">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1C212B] mb-4 font-serif">
            Legal Insights & Updates
          </h1>
          <p className="text-xl text-[#1C212B]/70 max-w-2xl mx-auto">
            Stay informed with the latest trends in legal tech, contract law, and
            LegalEagle product announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {BLOG_POSTS.map((post) => (
            <Link
              href="#"
              key={post.slug}
              className="group flex flex-col h-full bg-white rounded-xl overflow-hidden border border-[#E5E5E5] hover:border-[#308970]/30 hover:shadow-lg transition-all"
            >
              <div className="aspect-video bg-[#1C212B]/5 relative w-full">
                {/* Placeholder for blog image */}
                <div className="absolute inset-0 flex items-center justify-center text-[#1C212B]/20 font-bold text-2xl">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-[#1C212B]/50 mb-3 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.date}
                  </span>
                  <span className="flex items-center">
                    <User className="w-3 h-3 mr-1" />
                    {post.author}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1C212B] mb-2 group-hover:text-[#308970] transition-colors">
                  {post.title}
                </h3>
                <p className="text-[#1C212B]/60 text-sm mb-4 flex-1">
                  {post.excerpt}
                </p>
                <div className="mt-auto pt-4 border-t border-[#E5E5E5] flex items-center text-[#308970] font-medium text-sm group-hover:text-[#266d59]">
                  Read Article <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
