"use client";

import { cn } from "@/lib/utils";
import {
  FileText,
  Settings,
  FileCheck,
  Sparkles,
  GitCompare,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";
import { BrandMark } from "@/components/brand-logo";

const navigation = [
  { name: "My Documents", href: "/dashboard", icon: FileText },
  { name: "Analyze", href: "/analyze", icon: Sparkles },
  { name: "Compare", href: "/compare", icon: GitCompare },
  { name: "Templates", href: "/templates", icon: FileCheck },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const reduceMotion = useAppReducedMotion();

  return (
    <div
      className="hidden md:flex w-20 sticky top-[68px] h-[calc(100vh-68px)] flex-col items-center py-8 border-r border-white/10 shrink-0 overflow-y-auto"
      style={{ backgroundColor: le.primary }}
    >
      <div className="mb-10">
        <Link href="/dashboard" title="Home">
          <motion.div
            className="rounded-xl bg-white/95 p-[3px] shadow-md ring-1 ring-white/20"
            whileHover={reduceMotion ? undefined : { scale: 1.06 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          >
            <BrandMark size={34} />
          </motion.div>
        </Link>
      </div>
      <nav className="flex flex-col space-y-3 w-full px-2">
        {navigation.map((item, i) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : item.href === "/profile"
                ? pathname === "/profile"
                : pathname === item.href ||
                  pathname?.startsWith(`${item.href}/`) ||
                  (item.href === "/analyze" && pathname?.startsWith("/analyze"));
          const Icon = item.icon;
          return (
            <motion.div
              key={item.name}
              initial={reduceMotion ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: reduceMotion ? 0 : i * 0.04 }}
            >
              <Link
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 rounded-[12px] transition-colors",
                  isActive
                    ? "bg-white text-[#1a3a52] shadow-lg"
                    : "text-slate-300 hover:text-white hover:bg-white/10",
                )}
                title={item.name}
              >
                {isActive && (
                  <motion.span
                    layoutId="sidebar-indicator"
                    className="absolute -left-2 w-1.5 h-8 rounded-r-full bg-[#2563eb]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-[10px] text-center leading-tight max-w-[4.5rem]">
                  {item.name}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </nav>
    </div>
  );
}
