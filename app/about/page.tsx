"use client";

import { useEffect, useRef } from "react";
import { Users, Shield, Zap, Globe } from "lucide-react";
import gsap from "gsap";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";

export default function AboutPage() {
  const reduceMotion = useAppReducedMotion();
  const heroRef = useRef<HTMLElement | null>(null);
  const valuesRef = useRef<HTMLElement | null>(null);
  const teamRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelectorAll("[data-animate-hero]"),
        { y: 18, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power2.out" },
      );
    }
    if (valuesRef.current) {
      gsap.fromTo(
        valuesRef.current.querySelectorAll("[data-animate-value]"),
        { y: 16, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.08,
          delay: 0.15,
          ease: "power2.out",
        },
      );
    }
    if (teamRef.current) {
      gsap.fromTo(
        teamRef.current.querySelectorAll("[data-animate-team]"),
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, delay: 0.25, ease: "power2.out" },
      );
    }
  }, [reduceMotion]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: le.background }}>
      <section
        ref={heroRef}
        className="py-24 text-white"
        style={{ background: `linear-gradient(160deg, ${le.primary} 0%, #243d5c 100%)` }}
      >
        <div className="container mx-auto px-6 text-center">
          <h1
            data-animate-hero
            className="mb-6 font-serif text-4xl font-bold md:text-6xl"
          >
            Democratizing legal intelligence
          </h1>
          <p
            data-animate-hero
            className="mx-auto max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl"
          >
            We make professional-grade document analysis accessible, accurate, and fast—so you can
            decide with confidence.
          </p>
        </div>
      </section>

      <section ref={valuesRef} className="px-6 py-20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Trust first", body: "Security and confidentiality at the core. Your data never trains public models.", },
              { icon: Zap, title: "Radical speed", body: "Complex contracts structured in seconds—not a substitute for counsel, but a head start.", },
              { icon: Users, title: "Human centric", body: "AI suggests; you decide. Built to empower professionals, not replace judgment.", },
              { icon: Globe, title: "Global standard", body: "Designed for cross-border teams who need consistent review workflows.", },
            ].map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                data-animate-value
                className="rounded-[12px] border border-slate-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md"
              >
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-[8px]"
                  style={{ backgroundColor: `${le.secondary}15` }}
                >
                  <Icon className="h-6 w-6" style={{ color: le.secondary }} />
                </div>
                <h3 className="mb-3 text-xl font-bold" style={{ color: le.text }}>
                  {title}
                </h3>
                <p style={{ color: le.muted }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={teamRef} className="border-t border-slate-200 bg-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="mb-12 font-serif text-3xl font-bold" style={{ color: le.text }}>
            Meet the team
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-12 md:grid-cols-3">
            {[
              { name: "Sarah Jennings", role: "CEO & Co-Founder", bio: "Former Big Law partner, M&A.", },
              { name: "David Chen", role: "CTO & Co-Founder", bio: "NLP and retrieval for legal text.", },
              { name: "Elena Rodriguez", role: "Head of Product", bio: "Complex tools, simple surfaces.", },
            ].map((m) => (
              <div key={m.name} data-animate-team className="group cursor-pointer">
                <div
                  className="mx-auto mb-6 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-2 border-transparent transition-all group-hover:border-[#2563eb]"
                  style={{ backgroundColor: le.background }}
                >
                  <span className="text-sm font-medium text-slate-400">Photo</span>
                </div>
                <h3 className="text-xl font-bold" style={{ color: le.text }}>
                  {m.name}
                </h3>
                <p className="mb-2 font-medium" style={{ color: le.secondary }}>
                  {m.role}
                </p>
                <p className="text-sm" style={{ color: le.muted }}>
                  {m.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
