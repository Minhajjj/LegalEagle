"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { le } from "@/lib/design-system";
import { springSoft, useAppReducedMotion } from "@/lib/motion-utils";

interface RiskCardProps {
  id?: string;
  severity: "High" | "Medium" | "Low";
  clauseName: string;
  explanation: string;
  confidence?: number;
  recommendation?: string;
  active?: boolean;
  onClick?: () => void;
}

const severityTheme = {
  High: {
    borderColor: le.warning,
    badgeBg: `${le.warning}18`,
    badgeText: le.warning,
    label: "High",
  },
  Medium: {
    borderColor: "#ca8a04",
    badgeBg: "rgba(202,138,4,0.15)",
    badgeText: "#a16207",
    label: "Medium",
  },
  Low: {
    borderColor: le.success,
    badgeBg: `${le.success}18`,
    badgeText: le.success,
    label: "Low",
  },
};

function ConfidenceRing({
  value,
  size = 48,
  stroke = 3,
}: {
  value: number;
  size?: number;
  stroke?: number;
}) {
  const reduceMotion = useAppReducedMotion();
  const normalized = value > 1 ? value / 100 : value;
  const pct = Math.min(1, Math.max(0, normalized));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={le.secondary}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: reduceMotion ? 0 : 0.8,
            ease: "easeOut",
          }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-xs font-bold tabular-nums"
        style={{ color: le.text }}
      >
        {Math.round(pct * 100)}
      </span>
    </div>
  );
}

export function RiskCard({
  id,
  severity,
  clauseName,
  explanation,
  confidence,
  recommendation,
  active = false,
  onClick,
}: RiskCardProps) {
  const reduceMotion = useAppReducedMotion();
  const theme = severityTheme[severity];
  const [open, setOpen] = useState(active);

  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <Card
      id={id}
      onClick={() => onClick?.()}
      className={cn(
        "mb-3 cursor-pointer rounded-[12px] border border-slate-200/90 border-l-4 bg-white shadow-sm transition-shadow",
        active && "ring-2 ring-[#2563eb]/35 ring-offset-2",
      )}
      style={{ borderLeftColor: theme.borderColor }}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <motion.span
                className="text-xs font-semibold uppercase tracking-wide px-2 py-0.5 rounded-md"
                style={{ backgroundColor: theme.badgeBg, color: theme.badgeText }}
                {...(reduceMotion
                  ? {}
                  : {
                      animate: {
                        scale: [1, 1.04, 1],
                        opacity: [1, 0.92, 1],
                      },
                      transition: {
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      },
                    })}
              >
                {theme.label} risk
              </motion.span>
            </div>
            <h4 className="font-semibold mb-1" style={{ color: le.text }}>
              {clauseName}
            </h4>
            <p className="text-sm line-clamp-2" style={{ color: le.muted }}>
              {explanation}
            </p>
          </div>
          {typeof confidence === "number" && (
            <ConfidenceRing value={confidence} />
          )}
          <button
            type="button"
            className="p-1 rounded-md hover:bg-slate-100 shrink-0 mt-0.5"
            style={{ color: le.primary }}
            aria-expanded={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((v) => !v);
            }}
          >
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={springSoft}
            >
              <ChevronDown className="w-5 h-5" />
            </motion.span>
          </button>
        </div>

        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              initial={reduceMotion ? false : { height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-3 border-t border-slate-100 space-y-3">
                <p className="text-sm leading-relaxed" style={{ color: le.text }}>
                  {explanation}
                </p>
                {recommendation && (
                  <motion.div
                    className="rounded-[8px] p-3 border border-slate-200"
                    style={{
                      backgroundColor: `${le.secondary}08`,
                      borderColor: `${le.secondary}35`,
                    }}
                    whileHover={
                      reduceMotion
                        ? undefined
                        : {
                            boxShadow: `0 0 0 3px ${le.secondary}22`,
                          }
                    }
                    transition={{ duration: 0.2 }}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: le.secondary }}>
                      Recommendation
                    </p>
                    <p className="text-sm" style={{ color: le.text }}>
                      {recommendation}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
