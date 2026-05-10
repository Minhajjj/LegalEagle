"use client";

import Link from "next/link";
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { le } from "@/lib/design-system";
import { useAppReducedMotion } from "@/lib/motion-utils";
import { BrandLogoLink } from "@/components/brand-logo";
import { SITE_NAV_COMPANY, SITE_NAV_LEGAL, SITE_NAV_PRODUCT } from "@/lib/site-navigation";

export function Footer() {
  const reduceMotion = useAppReducedMotion();

  return (
    <footer className="mt-auto print:hidden">
      <div className="relative border-t-[5px]" style={{ borderTopColor: le.secondary }}>
        {/* Distinct from page bg (#f8fafc) and from navbar (#dbe6f3 band) */}
        <div
          className="shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]"
          style={{
            background: "linear-gradient(180deg, #c9d8e8 0%, #bacbde 45%, #b4c5d8 100%)",
          }}
        >
          <div className="container mx-auto px-6 py-12 lg:py-14">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5">
                <BrandLogoLink showTagline />
                <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-slate-700">
                  AI-assisted contract review so you understand risk before you sign.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {[
                    { icon: Twitter, href: "#", label: "Twitter" },
                    { icon: Linkedin, href: "#", label: "LinkedIn" },
                    { icon: Github, href: "#", label: "GitHub" },
                    { icon: Mail, href: "/contact", label: "Email" },
                  ].map(({ icon: Icon, href, label }) => (
                    <motion.a
                      key={label}
                      href={href}
                      aria-label={label}
                      className="flex h-11 w-11 items-center justify-center rounded-[10px] border border-white/80 bg-white/95 text-slate-600 shadow-md"
                      whileHover={
                        reduceMotion
                          ? undefined
                          : { y: -3, boxShadow: "0 12px 28px rgba(15,23,42,0.14)" }
                      }
                      whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                    >
                      <Icon className="h-[18px] w-[18px]" style={{ color: le.secondary }} />
                    </motion.a>
                  ))}
                </div>
              </div>

              <nav className="lg:col-span-2" aria-label="Product">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Product
                </h3>
                <ul className="mt-5 space-y-3">
                  {SITE_NAV_PRODUCT.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm font-semibold text-slate-800 transition-colors hover:text-[#1e40af]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="lg:col-span-2" aria-label="Company">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Company
                </h3>
                <ul className="mt-5 space-y-3">
                  {SITE_NAV_COMPANY.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm font-semibold text-slate-800 transition-colors hover:text-[#1e40af]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav className="lg:col-span-3" aria-label="Legal">
                <h3 className="text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                  Legal
                </h3>
                <ul className="mt-5 space-y-3">
                  {SITE_NAV_LEGAL.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm font-semibold text-slate-800 transition-colors hover:text-[#1e40af]"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: le.primary }} className="text-slate-200">
          <div className="container mx-auto flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:justify-between">
            <p className="text-sm font-medium">© {new Date().getFullYear()} LegalEagle. All rights reserved.</p>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm">
              {SITE_NAV_LEGAL.map((item) => (
                <Link key={item.href} href={item.href} className="hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="max-w-md text-xs text-slate-400 md:text-right">
              Not legal advice—consult qualified counsel for your jurisdiction and situation.
            </p>
          </div>
        </div>

        <div className="h-1 w-full" style={{ backgroundColor: le.secondary }} aria-hidden />
      </div>
    </footer>
  );
}
