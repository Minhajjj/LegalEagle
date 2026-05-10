"use client";

import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { le } from "@/lib/design-system";

/**
 * LegalEagle mark: shield + folded document + horizon line (precision / review).
 * Not a single letter — distinctive at favicon and header sizes.
 */
export function BrandMark({
  size = 40,
  className,
}: {
  size?: number;
  className?: string;
}) {
  const uid = useId().replace(/:/g, "");
  const id = `le-grad-${uid}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      className={cn("shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id={id} x1="8" y1="6" x2="42" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor={le.primary} />
          <stop offset="1" stopColor={le.secondary} />
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M24 3.5l17.3 10v21L24 44.5 6.7 34.5v-21L24 3.5z"
      />
      <path
        fill="white"
        fillOpacity={0.94}
        d="M24 11.5l11.2 6.5v13L24 37.5l-11.2-6.5v-13L24 11.5z"
      />
      <path
        fill={le.primary}
        fillOpacity={0.88}
        d="M15 20h18v2H15v-2zm0 5h14v2H15v-2zm0 5h10v2H15v-2z"
      />
      <path
        fill={le.secondary}
        fillOpacity={0.95}
        d="M28 18l6 6-6 6-1.4-1.4 4.6-4.6-4.6-4.6L28 18z"
      />
    </svg>
  );
}

export function BrandLogoLink({
  className,
  showTagline = true,
}: {
  className?: string;
  /** Tagline under wordmark (desktop) */
  showTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("group flex items-center gap-2.5 outline-none", className)}
    >
      <span className="relative rounded-[11px] bg-white p-[2px] shadow-md ring-1 ring-slate-200/90 transition-[box-shadow,transform] duration-200 group-hover:shadow-lg group-hover:ring-[#2563eb]/25">
        <BrandMark size={38} />
      </span>
      <span className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-bold tracking-tight text-[#0f172a] text-[15px] sm:text-base">
          Legal<span className="text-[#2563eb]">Eagle</span>
        </span>
        {showTagline && (
          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 sm:block">
            Contract intelligence
          </span>
        )}
      </span>
    </Link>
  );
}
