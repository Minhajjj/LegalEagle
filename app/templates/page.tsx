"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileCheck, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import gsap from "gsap";
import Link from "next/link";
import { templates } from "@/lib/templates";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";

export default function TemplatesPage() {
  const reduceMotion = useAppReducedMotion();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(templates.map((template) => template.category)));
    return ["All", ...unique];
  }, []);

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const inCategory =
        activeCategory === "All" || template.category === activeCategory;
      const inSearch =
        template.name.toLowerCase().includes(search.toLowerCase()) ||
        template.description.toLowerCase().includes(search.toLowerCase());
      return inCategory && inSearch;
    });
  }, [activeCategory, search]);

  useEffect(() => {
    if (reduceMotion) return;
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" },
      );
    }
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { y: 24, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.05,
          ease: "power2.out",
          delay: 0.2,
        },
      );
    }
  }, [filteredTemplates.length, reduceMotion]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: le.background }}>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-20">
          <div className="container mx-auto px-8 py-12">
            <div ref={headerRef} className="mb-8 space-y-4">
              <h1 className="text-4xl font-bold tracking-tight" style={{ color: le.text }}>
                Standard Templates
              </h1>
              <p className="max-w-2xl" style={{ color: le.muted }}>
                Browse practical legal starters for contracts, privacy, business,
                and operations. Use them as a drafting base before legal review.
              </p>

              <div className="bg-white border border-slate-200 rounded-[12px] p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between shadow-sm">
                <div className="relative w-full md:max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: le.muted }} />
                  <Input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search templates..."
                    className="pl-10 rounded-[8px] border-slate-200"
                  />
                </div>
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: le.muted }}>
                  {filteredTemplates.length} templates
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                      activeCategory === category
                        ? "text-white border-transparent shadow-md"
                        : "bg-white border-slate-200"
                    }`}
                    style={
                      activeCategory === category
                        ? { backgroundColor: le.primary }
                        : { color: le.primary }
                    }
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>

            <div
              ref={gridRef}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            >
              {filteredTemplates.map((template) => (
                <Link href={`/templates/${template.id}`} key={template.id} className="block group">
                  <motion.div
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { y: -4, boxShadow: "0 16px 40px rgba(15,23,42,0.12)" }
                    }
                    transition={{ duration: 0.2 }}
                  >
                  <Card
                    className="h-full bg-white border-slate-200 rounded-[12px] group-hover:border-slate-300 transition-colors duration-300"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div className="w-11 h-11 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: `${le.primary}12` }}>
                          <FileCheck className="w-6 h-6" style={{ color: le.primary }} />
                        </div>
                        <span className="text-[10px] px-2 py-1 rounded-full uppercase font-bold tracking-wider" style={{ backgroundColor: `${le.secondary}15`, color: le.secondary }}>
                          {template.category}
                        </span>
                      </div>
                      <CardTitle className="text-lg transition-colors" style={{ color: le.text }}>
                        {template.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col flex-1 justify-between">
                      <p className="text-sm mb-4 min-h-12" style={{ color: le.muted }}>
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto pt-4">
                        <p className="text-xs" style={{ color: le.muted }}>
                          {template.downloads.toLocaleString()} downloads
                        </p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-[8px] font-semibold border-slate-200 group-hover:text-white group-hover:border-transparent group-hover:bg-[#2563eb]"
                          style={{ color: le.primary }}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Open
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                </Link>
              ))}
              {!filteredTemplates.length && (
                <div className="col-span-full bg-white rounded-[12px] border border-slate-200 p-10 text-center shadow-sm">
                  <p className="font-semibold" style={{ color: le.muted }}>
                    No template matches your search/filter.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
