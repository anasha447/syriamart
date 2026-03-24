"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/lib/store/auth.store";
import { cn } from "@/lib/utils";

function useBreadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  return segments.map((seg, i) => ({
    label:  seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    href:   "/" + segments.slice(0, i + 1).join("/"),
    isLast: i === segments.length - 1,
  }));
}

export function SellerTopHeader() {
  const breadcrumbs  = useBreadcrumbs();
  const { user }     = useAuthStore();
  const { theme, setTheme } = useTheme();

  return (
    <header className={cn(
      "h-14 flex items-center justify-between px-6",
      "bg-white dark:bg-card border-b border-border sticky top-0 z-raised"
    )}>
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5">
        {breadcrumbs.map(({ label, href, isLast }, i) => (
          <React.Fragment key={href}>
            {i > 0 && <span className="text-neutral-300 dark:text-neutral-600 text-sm">/</span>}
            {isLast
              ? <span className="text-sm font-medium text-foreground">{label}</span>
              : <Link href={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{label}</Link>
            }
          </React.Fragment>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          <Sun className="w-4 h-4 dark:hidden" strokeWidth={1.8} />
          <Moon className="w-4 h-4 hidden dark:block" strokeWidth={1.8} />
        </button>

        <button className="relative p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" strokeWidth={1.8} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#FF9900]" />
        </button>

        <div className="w-7 h-7 rounded-full bg-[#1A365D] text-white text-xs font-semibold flex items-center justify-center ml-1">
          {(user?.firstName?.[0] ?? user?.email?.[0] ?? "S").toUpperCase()}
        </div>
      </div>
    </header>
  );
}
