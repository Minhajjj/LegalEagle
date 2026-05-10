"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { Loader2, Mail, Calendar, FileText, Settings, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";

export default function ProfilePage() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const reduceMotion = useAppReducedMotion();
  const [docCount, setDocCount] = useState<number | null>(null);
  const [countsLoading, setCountsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
      return;
    }

    let cancelled = false;
    const load = async () => {
      setCountsLoading(true);
      try {
        const supabase = createClient();
        const { count, error } = await supabase
          .from("documents")
          .select("*", { count: "exact", head: true })
          .eq("user_id", user.id);
        if (!cancelled && !error) setDocCount(count ?? 0);
      } finally {
        if (!cancelled) setCountsLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [user, loading, router]);

  const initials = () => {
    if (profile?.full_name) {
      const p = profile.full_name.trim().split(/\s+/).filter(Boolean);
      if (p.length >= 2) return (p[0]![0] + p[p.length - 1]![0]).toUpperCase().slice(0, 2);
      return p[0]!.slice(0, 2).toUpperCase();
    }
    return user?.email?.charAt(0).toUpperCase() ?? "?";
  };

  const joined =
    profile?.created_at &&
    new Date(profile.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: le.background }}>
        <Loader2 className="h-10 w-10 animate-spin" style={{ color: le.secondary }} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ backgroundColor: le.background }}>
        <Loader2 className="h-10 w-10 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: le.background }}>
      <Sidebar />
      <div className="flex-1 ml-20">
        <div className="container mx-auto max-w-3xl px-6 py-10 lg:py-14">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: le.text }}>
              Profile
            </h1>
            <p className="mt-2 text-base" style={{ color: le.muted }}>
              Your account overview. Edit details in Settings.
            </p>
          </motion.div>

          <motion.div
            className="mt-10 space-y-6"
            initial={reduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { ...springSnappy, delay: 0.08 }
            }
          >
            <Card className="overflow-hidden rounded-[16px] border-slate-200 shadow-lg shadow-slate-200/60">
              <div
                className="h-24 sm:h-28"
                style={{
                  background: `linear-gradient(120deg, ${le.primary} 0%, ${le.secondary} 95%)`,
                }}
              />
              <CardHeader className="relative pb-2 pt-0">
                <div className="-mt-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                  <Avatar className="h-24 w-24 border-4 border-white shadow-lg ring-2 ring-slate-100">
                    <AvatarFallback
                      className="text-2xl font-bold"
                      style={{ backgroundColor: "#eff6ff", color: le.primary }}
                    >
                      {initials()}
                    </AvatarFallback>
                  </Avatar>
                  <motion.div
                    className="flex flex-wrap gap-2 sm:pb-1"
                    whileHover={reduceMotion ? undefined : { scale: 1.01 }}
                  >
                    <Button className="rounded-[8px] font-semibold" asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </Button>
                    <Button variant="outline" className="rounded-[8px] font-semibold" asChild>
                      <Link href="/dashboard">
                        <FileText className="mr-2 h-4 w-4" />
                        Documents
                      </Link>
                    </Button>
                  </motion.div>
                </div>
                <CardTitle className="mt-4 text-2xl" style={{ color: le.text }}>
                  {profile?.full_name || "Your account"}
                </CardTitle>
                <CardDescription className="text-base" style={{ color: le.muted }}>
                  {user.email}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pb-8 pt-2">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div
                    className="rounded-[12px] border border-slate-100 bg-slate-50/80 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</p>
                    <p className="mt-1 text-lg font-bold capitalize" style={{ color: le.primary }}>
                      {profile?.subscription_tier || "Free"}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Documents</p>
                    <p className="mt-1 text-lg font-bold tabular-nums" style={{ color: le.text }}>
                      {countsLoading ? "…" : docCount ?? "—"}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-slate-100 bg-slate-50/80 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Member since</p>
                    <p className="mt-1 text-lg font-bold" style={{ color: le.text }}>
                      {joined || "—"}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                    Account details
                  </h3>
                  <div className="flex items-start gap-3 rounded-[12px] border border-slate-100 p-4">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0" style={{ color: le.secondary }} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</p>
                      <p className="font-medium text-slate-900">{user.email}</p>
                    </div>
                  </div>
                  {profile?.created_at && (
                    <div className="flex items-start gap-3 rounded-[12px] border border-slate-100 p-4">
                      <Calendar className="mt-0.5 h-5 w-5 shrink-0" style={{ color: le.secondary }} />
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Created</p>
                        <p className="font-medium text-slate-900">
                          {new Date(profile.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-start gap-3 rounded-[12px] border border-slate-100 bg-[#f8fafc] p-4">
                    <Shield className="mt-0.5 h-5 w-5 shrink-0" style={{ color: le.success }} />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Security</p>
                      <p className="text-sm text-slate-600">
                        Manage password and sessions from Settings when available.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
