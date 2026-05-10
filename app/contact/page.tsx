"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send, Phone, MessageSquare } from "lucide-react";
import gsap from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

export default function ContactPage() {
  const reduceMotion = useAppReducedMotion();
  const [submitted, setSubmitted] = useState(false);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (reduceMotion) return;
    gsap.fromTo(
      [leftRef.current, rightRef.current].filter(Boolean),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.55, stagger: 0.12, ease: "power2.out" },
    );
  }, [reduceMotion]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: le.background }}>
      <main className="flex-grow px-6 py-20">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-2">
            <div ref={leftRef} className="space-y-8">
              <div>
                <h2 className="mb-4 text-4xl font-bold leading-tight" style={{ color: le.primary }}>
                  Contact us
                </h2>
                <p className="max-w-md text-lg font-medium" style={{ color: le.muted }}>
                  Questions about analysis, security, or enterprise plans—we reply quickly.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] text-white"
                    style={{ backgroundColor: le.primary }}
                  >
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: le.muted }}>
                      Email
                    </h4>
                    <p className="font-semibold" style={{ color: le.text }}>
                      support@legaleagle.ai
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[8px] text-white"
                    style={{ backgroundColor: le.primary }}
                  >
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: le.muted }}>
                      Phone
                    </h4>
                    <p className="font-semibold" style={{ color: le.text }}>
                      +1 (555) 000-EAGLE
                    </p>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-3 border-t border-slate-200 pt-8 text-xs font-semibold uppercase tracking-wider"
                style={{ color: le.muted }}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Typical response under 2 hours</span>
              </div>
            </div>

            <motion.div
              ref={rightRef}
              className="rounded-[16px] border border-slate-200 bg-white p-8 shadow-lg md:p-12"
              whileHover={reduceMotion ? undefined : { boxShadow: "0 20px 50px rgba(15,23,42,0.08)" }}
              transition={{ duration: 0.25 }}
            >
              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: le.muted }}>
                        Full name
                      </label>
                      <Input
                        placeholder="Jane Doe"
                        className="h-12 rounded-[8px] border-slate-200 bg-slate-50/80"
                        style={{ color: le.text }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: le.muted }}>
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="jane@company.com"
                        className="h-12 rounded-[8px] border-slate-200 bg-slate-50/80"
                        style={{ color: le.text }}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider" style={{ color: le.muted }}>
                        Message
                      </label>
                      <Textarea
                        placeholder="How can we help?"
                        className="min-h-[150px] rounded-[8px] border-slate-200 bg-slate-50/80"
                        style={{ color: le.text }}
                        required
                      />
                    </div>
                    <motion.div
                      whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
                      transition={springSnappy}
                    >
                      <Button type="submit" className="flex h-12 w-full items-center justify-center gap-2 rounded-[8px]">
                        <Send className="h-5 w-5" />
                        Send message
                      </Button>
                    </motion.div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="done"
                    initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center"
                  >
                    <div
                      className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${le.success}18` }}
                    >
                      <Send className="h-10 w-10" style={{ color: le.success }} />
                    </div>
                    <h3 className="mb-2 text-2xl font-bold" style={{ color: le.text }}>
                      Message sent
                    </h3>
                    <p style={{ color: le.muted }}>We&apos;ll get back to you shortly.</p>
                    <Button
                      variant="ghost"
                      onClick={() => setSubmitted(false)}
                      className="mt-8 font-semibold"
                      style={{ color: le.secondary }}
                    >
                      Send another
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
