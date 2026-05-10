"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Bell, Shield, CreditCard, Key, ChevronDown, CheckCircle2, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

function Toggle({
  checked,
  onChange,
  id,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  id: string;
}) {
  const reduceMotion = useAppReducedMotion();
  return (
    <button
      type="button"
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="relative h-7 w-12 rounded-full border border-slate-200 shrink-0"
      style={{ backgroundColor: checked ? le.secondary : "#e2e8f0" }}
    >
      <motion.span
        className="absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow-md"
        animate={{ x: checked ? 20 : 0 }}
        transition={reduceMotion ? { duration: 0 } : springSnappy}
      />
    </button>
  );
}

function CollapsibleSection({
  title,
  description,
  icon: Icon,
  defaultOpen = true,
  children,
}: {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const reduceMotion = useAppReducedMotion();
  const [open, setOpen] = useState(defaultOpen);

  return (
    <Card className="rounded-[12px] border-slate-200 shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-6 flex items-start justify-between gap-4 hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex gap-3">
          <div
            className="w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${le.primary}10` }}
          >
            <Icon className="w-5 h-5" style={{ color: le.primary }} />
          </div>
          <div>
            <h2 className="text-lg font-semibold" style={{ color: le.text }}>
              {title}
            </h2>
            <p className="text-sm mt-0.5" style={{ color: le.muted }}>
              {description}
            </p>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 180 : 0 }} transition={springSnappy} className="shrink-0 mt-1">
          <ChevronDown className="w-5 h-5" style={{ color: le.muted }} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 pt-0 border-t border-slate-100">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export default function SettingsPage() {
  const reduceMotion = useAppReducedMotion();
  const [emailNotif, setEmailNotif] = useState(true);
  const [riskAlerts, setRiskAlerts] = useState(true);
  const [weekly, setWeekly] = useState(false);
  const [saved, setSaved] = useState(false);
  const [name, setName] = useState("");
  const [nameTouched, setNameTouched] = useState(false);

  const nameInvalid = nameTouched && name.trim().length === 0;

  const handleSave = () => {
    setNameTouched(true);
    if (!name.trim()) return;
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2800);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: le.background }}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-20">
          <motion.div
            className="container mx-auto px-6 sm:px-8 py-10 max-w-4xl"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <h1 className="text-4xl font-bold mb-2" style={{ color: le.text }}>
              Settings
            </h1>
            <p className="text-base mb-10" style={{ color: le.muted }}>
              Manage preferences and account details.
            </p>

            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.94, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={springSnappy}
                  className="mb-6 flex items-center gap-3 rounded-[12px] border px-4 py-3"
                  style={{
                    backgroundColor: `${le.success}12`,
                    borderColor: `${le.success}40`,
                    color: le.success,
                  }}
                >
                  <motion.span
                    initial={reduceMotion ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={springSnappy}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </motion.span>
                  <span className="text-sm font-semibold">Changes saved</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <CollapsibleSection
                  title="Profile"
                  description="How you appear in LegalEagle"
                  icon={User}
                >
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: le.text }}>
                        Full name
                      </label>
                      <div className="relative">
                        <Input
                          type="text"
                          placeholder="Jane Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          onBlur={() => setNameTouched(true)}
                          className="rounded-[8px] h-11 border-slate-200 focus-visible:ring-2"
                          style={{ ["--tw-ring-color" as string]: `${le.secondary}55` } as React.CSSProperties}
                        />
                        <AnimatePresence>
                          {nameInvalid && (
                            <motion.p
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="text-sm mt-1 font-medium flex items-center gap-1"
                              style={{ color: le.warning }}
                            >
                              <motion.span
                                initial={{ rotate: -12 }}
                                animate={{ rotate: 0 }}
                                className="inline-block"
                              >
                                !
                              </motion.span>
                              Name is required
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: le.text }}>
                        Email
                      </label>
                      <Input
                        type="email"
                        placeholder="you@company.com"
                        className="rounded-[8px] h-11 border-slate-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" style={{ color: le.text }}>
                        Company
                      </label>
                      <Input
                        type="text"
                        placeholder="Organization"
                        className="rounded-[8px] h-11 border-slate-200"
                      />
                    </div>
                    <motion.div
                      whileHover={reduceMotion ? undefined : { scale: 1.02, y: -2 }}
                      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                      transition={springSnappy}
                      className="inline-block"
                    >
                      <Button
                        type="button"
                        className="rounded-[8px] font-semibold text-white"
                        style={{ backgroundColor: le.primary }}
                        onClick={handleSave}
                      >
                        Save changes
                      </Button>
                    </motion.div>
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Notifications"
                  description="Control alerts and summaries"
                  icon={Bell}
                  defaultOpen={false}
                >
                  <div className="space-y-4 pt-4">
                    {[
                      {
                        id: "email",
                        title: "Email notifications",
                        sub: "Product updates and document events",
                        val: emailNotif,
                        set: setEmailNotif,
                      },
                      {
                        id: "risk",
                        title: "Risk alerts",
                        sub: "High-severity clause detection",
                        val: riskAlerts,
                        set: setRiskAlerts,
                      },
                      {
                        id: "weekly",
                        title: "Weekly summary",
                        sub: "Digest of workspace activity",
                        val: weekly,
                        set: setWeekly,
                      },
                    ].map((row, i) => (
                      <div key={row.id}>
                        {i > 0 && <Separator className="my-4" />}
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="font-medium" style={{ color: le.text }}>
                              {row.title}
                            </p>
                            <p className="text-sm" style={{ color: le.muted }}>
                              {row.sub}
                            </p>
                          </div>
                          <Toggle id={row.id} checked={row.val} onChange={row.set} />
                        </div>
                      </div>
                    ))}
                  </div>
                </CollapsibleSection>

                <CollapsibleSection
                  title="Security"
                  description="Credentials and access"
                  icon={Key}
                  defaultOpen={false}
                >
                  <div className="space-y-3 pt-4">
                    <motion.div whileHover={reduceMotion ? undefined : { x: 4 }} className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-[8px] border-slate-200 font-medium h-11"
                        style={{ color: le.primary }}
                      >
                        <Key className="w-4 h-4 mr-2" />
                        Change password
                      </Button>
                    </motion.div>
                    <motion.div whileHover={reduceMotion ? undefined : { x: 4 }} className="block">
                      <Button
                        variant="outline"
                        className="w-full justify-start rounded-[8px] border-slate-200 font-medium h-11"
                        style={{ color: le.primary }}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Two-factor authentication
                      </Button>
                    </motion.div>
                  </div>
                </CollapsibleSection>
              </div>

              <div className="space-y-6">
                <motion.div
                  whileHover={
                    reduceMotion ? undefined : { y: -3, boxShadow: "0 12px 28px rgba(15,23,42,0.1)" }
                  }
                  transition={{ duration: 0.2 }}
                >
                  <Card className="rounded-[12px] border-slate-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <h3 className="font-semibold" style={{ color: le.text }}>
                        Account
                      </h3>
                      <div>
                        <p className="text-sm" style={{ color: le.muted }}>
                          Plan
                        </p>
                        <p className="font-semibold" style={{ color: le.text }}>
                          Professional
                        </p>
                      </div>
                      <Separator />
                      <div>
                        <p className="text-sm" style={{ color: le.muted }}>
                          Documents analyzed
                        </p>
                        <p className="font-semibold" style={{ color: le.text }}>
                          47 / Unlimited
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full rounded-[8px] font-semibold border-slate-200"
                        style={{ color: le.primary }}
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Manage subscription
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
