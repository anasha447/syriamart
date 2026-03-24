"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutDashboard, ScanLine, Package, MessageSquare, User } from "lucide-react";
import { useDriverStatus } from "@/lib/store/driver.store";
import { cn } from "@/lib/utils";

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE:   "bg-green-500",
  ON_DELIVERY: "bg-[#FF9900]",
  ON_BREAK:    "bg-yellow-500",
  OFFLINE:     "bg-slate-500",
  SUSPENDED:   "bg-red-500",
};

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Home",     href: "/driver/dashboard",  isPrimary: false },
  { icon: Package,         label: "Orders",   href: "/driver/orders",     isPrimary: false },
  { icon: ScanLine,        label: "Scan",     href: "/driver/scan",       isPrimary: true  },
  { icon: MessageSquare,   label: "Messages", href: "/driver/messages",   isPrimary: false },
  { icon: User,            label: "Profile",  href: "/driver/profile",    isPrimary: false },
] as const;

export function DriverBottomNav() {
  const pathname = usePathname();
  const status   = useDriverStatus();

  const isActive = (href: string) =>
    href === "/driver/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-sticky bg-[#0F172A] border-t border-slate-800 safe-bottom px-2 pt-2 max-w-md mx-auto"
      aria-label="Driver navigation"
    >
      <div className="flex items-end justify-around">
        {NAV_ITEMS.map((item) => {
          const Icon   = item.icon;
          const active = isActive(item.href);

          if (item.isPrimary) {
            return (
              <Link
                key={item.href} href={item.href}
                aria-label="Scan package"
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center gap-1 -mt-4"
              >
                <motion.div
                  whileTap={{ scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                    active ? "bg-[#E68A00]" : "bg-[#FF9900]",
                    active && "animate-scan-pulse"
                  )}
                >
                  <ScanLine className="w-7 h-7 text-[#0F172A]" strokeWidth={2} />
                </motion.div>
                <span className={cn("text-[10px] font-medium pb-1", active ? "text-[#FF9900]" : "text-slate-500")}>
                  Scan
                </span>
              </Link>
            );
          }

          const isProfileItem = item.href === "/driver/profile";
          return (
            <Link
              key={item.href} href={item.href}
              aria-current={active ? "page" : undefined}
              className="flex flex-col items-center gap-1 py-1 px-3 min-w-[56px] relative"
            >
              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-150",
                    active ? "bg-[#1A365D]/80 text-white" : "text-slate-400"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2 : 1.8} />
                </motion.div>
                {isProfileItem && (
                  <span className={cn(
                    "absolute top-0 right-0 w-2 h-2 rounded-full border-2 border-[#0F172A]",
                    STATUS_COLOR[status] ?? "bg-slate-500"
                  )} />
                )}
              </div>
              <span className={cn("text-[10px] font-medium transition-colors duration-150", active ? "text-white" : "text-slate-500")}>
                {item.label}
              </span>
              {active && (
                <motion.div
                  layoutId="driver-nav-indicator"
                  className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#FF9900]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
