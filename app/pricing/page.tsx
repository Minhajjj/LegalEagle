"use client";

import { useEffect, useRef } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import gsap from "gsap";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";

export default function PricingPage() {
  const reduceMotion = useAppReducedMotion();
  const heroRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.children,
        { y: 14, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.55, stagger: 0.1, ease: "power2.out" },
      );
    }
    if (cardsRef.current) {
      gsap.fromTo(
        cardsRef.current.children,
        { y: 16, opacity: 0, scale: 0.98 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.55,
          stagger: 0.1,
          delay: 0.2,
          ease: "power2.out",
        },
      );
    }
  }, [reduceMotion]);

  return (
    <div className="min-h-screen pb-12 pt-24" style={{ backgroundColor: le.background }}>
      <div className="container mx-auto px-6">
        <div ref={heroRef} className="mb-16 text-center">
          <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl" style={{ color: le.text }}>
            Simple, transparent pricing
          </h1>
          <p className="mx-auto max-w-2xl text-xl" style={{ color: le.muted }}>
            Choose a plan for your workflow. Cancel anytime.
          </p>
        </div>

        <div ref={cardsRef} className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col rounded-[12px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="mb-4">
              <h3 className="text-xl font-bold" style={{ color: le.text }}>
                Starter
              </h3>
              <p style={{ color: le.muted }}>For individuals</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: le.text }}>
                $0
              </span>
              <span style={{ color: le.muted }}>/month</span>
            </div>
            <Button variant="outline" className="mb-8 w-full" asChild>
              <Link href="/signup">Get started</Link>
            </Button>
            <ul className="flex flex-1 flex-col space-y-4">
              {[
                "3 document analyses / month",
                "Basic risk assessment",
                "Standard parsing",
                "Email support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <Check className="mr-3 h-5 w-5 shrink-0" style={{ color: le.success }} />
                  <span style={{ color: le.text }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="relative flex flex-col rounded-[12px] border border-slate-700/50 p-8 shadow-xl md:-translate-y-4"
            style={{
              background: `linear-gradient(165deg, ${le.primary} 0%, #152a3f 100%)`,
            }}
          >
            <div
              className="absolute right-0 top-0 rounded-bl-lg rounded-tr-[12px] px-3 py-1 text-xs font-bold text-white"
              style={{ backgroundColor: le.secondary }}
            >
              Popular
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-white">Professional</h3>
              <p className="text-white/65">For practicing lawyers</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$49</span>
              <span className="text-white/65">/month</span>
            </div>
            <Button variant="secondary" className="mb-8 w-full border-0 shadow-lg" asChild>
              <Link href="/signup">Start free trial</Link>
            </Button>
            <ul className="flex flex-1 flex-col space-y-4">
              {[
                "Unlimited analyses",
                "Advanced risk detection",
                "Priority queue",
                "Clause comparison",
                "Export PDF & Word",
                "Priority support",
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <Check className="mr-3 h-5 w-5 shrink-0 text-emerald-400" />
                  <span className="text-white/85">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col rounded-[12px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:border-slate-300 hover:shadow-md">
            <div className="mb-4">
              <h3 className="text-xl font-bold" style={{ color: le.text }}>
                Enterprise
              </h3>
              <p style={{ color: le.muted }}>For firms and teams</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold" style={{ color: le.text }}>
                Custom
              </span>
            </div>
            <Button variant="outline" className="mb-8 w-full" asChild>
              <Link href="/contact">Contact sales</Link>
            </Button>
            <ul className="flex flex-1 flex-col space-y-4">
              {[
                "Everything in Professional",
                "API integration",
                "Dedicated success",
                "SSO & advanced security",
                "Training & onboarding",
                "SLA options",
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-sm">
                  <Check className="mr-3 h-5 w-5 shrink-0" style={{ color: le.success }} />
                  <span style={{ color: le.text }}>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
