"use client";

import { cn } from "@/lib/utils";
import { FileText, LayoutDashboard, Settings, FileCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "My Documents", href: "/dashboard", icon: FileText },
  { name: "Standard Templates", href: "/templates", icon: FileCheck },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-20 bg-[#1C212B] min-h-screen flex flex-col items-center py-8">
      <div className="mb-12">
        <LayoutDashboard className="w-8 h-8 text-[#308970]" />
      </div>
      <nav className="flex flex-col space-y-4 w-full px-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-3 rounded-lg transition-colors",
                isActive
                  ? "bg-[#308970] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#1C212B]/80"
              )}
              title={item.name}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-xs text-center leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

