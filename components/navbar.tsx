"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  Menu,
  X,
  LogOut,
  Settings,
  FileText,
  User as UserIcon,
  LogIn,
  ChevronDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth-context";
import { createClient } from "@/utils/supabase/client";
import { signOut as serverSignOut } from "@/app/auth/actions";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { le } from "@/lib/design-system";
import { springSnappy, useAppReducedMotion } from "@/lib/motion-utils";
import { BrandLogoLink } from "@/components/brand-logo";
import {
  SITE_NAV_PRODUCT,
  SITE_NAV_COMPANY,
  SITE_NAV_LEGAL,
  isNavActive,
  type NavItem,
} from "@/lib/site-navigation";

/** Logged-out header: product surfaces that don’t require auth to view */
const SITE_NAV_MARKETING: NavItem[] = [
  {
    href: "/analyze",
    label: "Analyze",
    match: (p) => p.startsWith("/analyze"),
  },
  { href: "/compare", label: "Compare", match: (p) => p === "/compare" },
  {
    href: "/templates",
    label: "Templates",
    match: (p) => p.startsWith("/templates"),
  },
  { href: "/pricing", label: "Pricing", match: (p) => p === "/pricing" },
];

function ExploreMenu({ triggerClassName }: { triggerClassName?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={triggerClassName}
        >
          Explore
          <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52 rounded-xl border-slate-200 shadow-xl">
        <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Company
        </DropdownMenuLabel>
        {SITE_NAV_COMPANY.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="rounded-lg">
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Legal
        </DropdownMenuLabel>
        {SITE_NAV_LEGAL.map((item) => (
          <DropdownMenuItem key={item.href} asChild className="rounded-lg">
            <Link href={item.href}>{item.label}</Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavPills({
  items,
  pathname,
}: {
  items: NavItem[];
  pathname: string;
}) {
  return (
    <div className="flex max-w-[min(100%,720px)] flex-wrap items-center justify-center gap-1 rounded-full border border-slate-300/80 bg-white/70 p-1 shadow-inner">
      {items.map((link) => {
        const active = isNavActive(link, pathname || "");
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-3 py-2 text-[12px] font-semibold transition-colors sm:text-[13px] ${
              active
                ? "bg-[#1a3a52] text-white shadow-sm"
                : "text-slate-600 hover:bg-white hover:text-[#1a3a52]"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduceMotion = useAppReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    try {
      // Clear client-side session state (ignore errors if session is already invalid)
      const supabase = createClient();
      await supabase.auth.signOut().catch(console.error);

      // Use the server action to ensure cookies are cleared properly.
      await serverSignOut().catch(console.error);
    } finally {
      // Force a hard refresh to the homepage to guarantee all client context and Next.js router cache is fully purged
      window.location.href = "/";
    }
  };

  const getAvatarLabel = (): string => {
    if (!user) return "G";
    if (profile?.full_name) {
      const parts = profile.full_name.trim().split(/\s+/).filter(Boolean);
      if (parts.length >= 2) {
        return (parts[0]![0] + parts[parts.length - 1]![0]).toUpperCase().slice(0, 2);
      }
      if (parts[0]) return parts[0]!.slice(0, 2).toUpperCase();
    }
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const avatarLabel = getAvatarLabel();

  const mobileLinks: NavItem[] = user ? SITE_NAV_PRODUCT : SITE_NAV_MARKETING;

  if (
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/auth/callback"
  ) {
    return null;
  }

  return (
    <>
      <header
        className="sticky top-0 z-50 border-b border-[#c5d3e6] transition-[background,box-shadow] duration-300"
        style={{
          background: scrolled
            ? "linear-gradient(180deg, #dce6f3 0%, #d4dff0 100%)"
            : "linear-gradient(180deg, #e4edf7 0%, #dbe6f3 100%)",
          boxShadow: scrolled
            ? "0 12px 36px rgba(26, 58, 82, 0.12)"
            : "0 1px 0 rgba(255,255,255,0.5) inset",
        }}
      >
        <div
          className="h-1 w-full shrink-0"
          style={{
            background: `linear-gradient(90deg, ${le.primary} 0%, ${le.secondary} 50%, ${le.primary} 100%)`,
          }}
          aria-hidden
        />

        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex min-h-[4.25rem] flex-wrap items-center justify-between gap-y-3 py-2 md:flex-nowrap md:py-0">
            <BrandLogoLink />

            <div className="order-last hidden w-full justify-center md:order-none md:flex md:flex-1 md:px-3 lg:w-auto">
              <NavPills
                items={user ? SITE_NAV_PRODUCT : SITE_NAV_MARKETING}
                pathname={pathname || ""}
              />
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5">
              <div className="hidden md:block">
                <ExploreMenu triggerClassName="h-9 rounded-full border-slate-400/50 bg-white/80 text-[13px] font-semibold text-slate-700 hover:bg-white" />
              </div>

              {user && (
                <div className="relative hidden lg:block">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <Input
                    type="text"
                    placeholder="Search documents…"
                    className="h-9 w-48 rounded-full border-slate-400/60 bg-white pl-9 text-sm placeholder:text-slate-400 xl:w-56"
                  />
                </div>
              )}

              {!user && (
                <>
                  <Button variant="ghost" size="sm" className="hidden rounded-full font-semibold sm:inline-flex" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button size="sm" className="hidden rounded-full font-semibold sm:inline-flex" asChild>
                    <Link href="/signup">Get started</Link>
                  </Button>
                </>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { scale: 1.04 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  >
                    <Button
                      variant="outline"
                      className="relative h-10 min-w-[2.25rem] rounded-full border-slate-400/70 bg-white px-1.5 shadow-sm hover:bg-white"
                      disabled={isSigningOut}
                      aria-label="Account menu"
                    >
                      {user ? (
                        <Avatar className="h-8 w-8 border border-slate-200">
                          <AvatarFallback className="rounded-full text-xs font-bold !bg-white !text-[#1a3a52] ring-2 ring-[#1a3a52]/20">
                            <span className="tabular-nums leading-none">{avatarLabel}</span>
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <UserIcon className="mx-1 h-5 w-5 text-slate-600" />
                      )}
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-64 rounded-xl border border-slate-200 bg-white shadow-xl"
                  align="end"
                  sideOffset={8}
                >
                  {user ? (
                    <>
                      <DropdownMenuLabel className="rounded-t-lg border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white p-4 font-normal">
                        <div className="flex gap-3">
                          <Avatar className="h-11 w-11 border border-slate-200">
                            <AvatarFallback
                              className="text-sm font-bold"
                              style={{ backgroundColor: "#eff6ff", color: le.primary }}
                            >
                              {avatarLabel}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {loading ? "…" : profile?.full_name || "User"}
                            </p>
                            <p className="truncate text-xs text-slate-500">{user.email}</p>
                            <span
                              className="mt-0.5 w-fit rounded-full px-2 py-0.5 text-[11px] font-semibold"
                              style={{
                                backgroundColor: `${le.secondary}14`,
                                color: le.secondary,
                              }}
                            >
                              {profile?.subscription_tier || "Free"} plan
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-1.5">
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                          <Link href="/profile" className="flex w-full items-center gap-3 px-2 py-2">
                            <UserIcon className="h-4 w-4" style={{ color: le.primary }} />
                            <span>Profile</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                          <Link href="/dashboard" className="flex w-full items-center gap-3 px-2 py-2">
                            <FileText className="h-4 w-4" style={{ color: le.primary }} />
                            <span>Dashboard</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                          <Link href="/settings" className="flex w-full items-center gap-3 px-2 py-2">
                            <Settings className="h-4 w-4" style={{ color: le.primary }} />
                            <span>Settings</span>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-1.5 pb-2">
                        <DropdownMenuItem
                          onClick={handleLogout}
                          disabled={isSigningOut}
                          variant="destructive"
                          className="cursor-pointer rounded-lg"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          <span>{isSigningOut ? "Signing out…" : "Sign out"}</span>
                        </DropdownMenuItem>
                      </div>
                    </>
                  ) : (
                    <>
                      <DropdownMenuLabel className="rounded-t-lg border-b border-slate-100 bg-slate-50 p-4 font-normal">
                        <p className="text-sm font-semibold text-slate-900">Welcome</p>
                        <p className="text-xs text-slate-500">Sign in to save analyses</p>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <div className="p-1.5">
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                          <Link href="/login" className="flex w-full items-center gap-3 px-2 py-2">
                            <LogIn className="h-4 w-4 text-[#2563eb]" />
                            <span>Log in</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                          <Link href="/signup" className="flex w-full items-center gap-3 px-2 py-2">
                            <UserIcon className="h-4 w-4 text-[#2563eb]" />
                            <span>Sign up</span>
                          </Link>
                        </DropdownMenuItem>
                      </div>
                      <DropdownMenuSeparator />
                      <div className="p-1.5 pb-2">
                        {SITE_NAV_COMPANY.map((item) => (
                          <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-lg">
                            <Link href={item.href} className="px-2 py-2">
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                        {SITE_NAV_LEGAL.map((item) => (
                          <DropdownMenuItem key={item.href} asChild className="cursor-pointer rounded-lg">
                            <Link href={item.href} className="px-2 py-2 text-sm">
                              {item.label}
                            </Link>
                          </DropdownMenuItem>
                        ))}
                      </div>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0 rounded-full border-slate-400/70 bg-white md:hidden"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={reduceMotion ? undefined : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-slate-900/45 backdrop-blur-[2px]"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              className="absolute bottom-0 left-0 top-0 flex w-[min(92vw,320px)] flex-col bg-[#edf2fa] pt-[84px] shadow-2xl ring-1 ring-[#b8c9dc]"
              initial={reduceMotion ? undefined : { x: "-100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? undefined : { x: "-100%" }}
              transition={springSnappy}
            >
              <div className="border-b border-[#c5d3e6] px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Menu</p>
              </div>
              <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">
                {mobileLinks.map((link, i) => {
                  const active = isNavActive(link, pathname || "");
                  return (
                    <motion.div
                      key={link.href}
                      initial={reduceMotion ? undefined : { opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: reduceMotion ? 0 : 0.03 + i * 0.04 }}
                    >
                      <Link
                        href={link.href}
                        className={`block rounded-xl px-4 py-3 text-base font-semibold ${
                          active ? "bg-[#1a3a52] text-white" : "bg-white/80 text-slate-700 ring-1 ring-slate-200/80"
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  );
                })}
                <p className="px-2 pt-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Company
                </p>
                {SITE_NAV_COMPANY.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <p className="px-2 pt-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Legal
                </p>
                {SITE_NAV_LEGAL.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-xl px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-white"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              {!user && (
                <div className="flex gap-2 border-t border-[#c5d3e6] p-4">
                  <Button variant="outline" className="flex-1 rounded-full font-semibold" asChild>
                    <Link href="/login" onClick={() => setMobileOpen(false)}>
                      Sign in
                    </Link>
                  </Button>
                  <Button className="flex-1 rounded-full font-semibold" asChild>
                    <Link href="/signup" onClick={() => setMobileOpen(false)}>
                      Get started
                    </Link>
                  </Button>
                </div>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
