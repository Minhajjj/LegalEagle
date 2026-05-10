/** Shared navigation — keep navbar and footer in sync */

export type NavItem = { href: string; label: string; match?: (p: string) => boolean };

/** Product / app surfaces (shown in primary nav when logged in) */
export const SITE_NAV_PRODUCT: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", match: (p) => p === "/dashboard" },
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

export const SITE_NAV_COMPANY: NavItem[] = [
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/careers", label: "Careers" },
  { href: "/contact", label: "Contact" },
];

export const SITE_NAV_LEGAL: NavItem[] = [
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/cookies", label: "Cookies" },
];

export function isNavActive(item: NavItem, pathname: string): boolean {
  if (item.match) return item.match(pathname);
  return pathname === item.href;
}
