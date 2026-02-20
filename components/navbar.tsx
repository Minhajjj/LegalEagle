"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search, Bell, User, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-[#308970] border-b border-[#F2F1EE]/30 sticky top-0 z-50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#F2F1EE] rounded-lg flex items-center justify-center">
              <span className="text-[#308970] font-bold text-lg">L</span>
            </div>
            <span className="text-xl font-bold text-[#F2F1EE]">LegalEagle</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/dashboard"
              className={`text-sm font-bold transition-colors ${
                pathname === "/dashboard"
                  ? "text-white underline underline-offset-4"
                  : "text-[#F2F1EE] hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/templates"
              className={`text-sm font-bold transition-colors ${
                pathname === "/templates"
                  ? "text-white underline underline-offset-4"
                  : "text-[#F2F1EE] hover:text-white"
              }`}
            >
              Templates
            </Link>
            <Link
              href="/analyze"
              className={`text-sm font-bold transition-colors ${
                pathname?.startsWith("/analyze")
                  ? "text-white underline underline-offset-4"
                  : "text-[#F2F1EE] hover:text-white"
              }`}
            >
              Analyze
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#F2F1EE]" />
              <Input
                type="text"
                placeholder="Search..."
                className="pl-10 w-64 bg-[#F2F1EE]/10 border-[#F2F1EE]/20 text-[#F2F1EE] placeholder:text-[#F2F1EE]/60 focus-visible:ring-1 focus-visible:ring-[#F2F1EE]"
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#F2F1EE] hover:bg-white/10"
            >
              <Bell className="w-5 h-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-[#F2F1EE] hover:bg-white/10"
              asChild
            >
              <Link href="/settings">
                <User className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-[#F2F1EE] hover:bg-white/10"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
