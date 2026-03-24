"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, ScanLine, Package, MessageSquare, User,
  ChevronLeft, ChevronRight, Truck
} from "lucide-react";
import { useSellerSidebarStore } from "@/lib/store/ui.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { useDriverStatus } from "@/lib/store/driver.store";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Main",
    items: [
      { label: "Dashboard", href: "/driver/dashboard", icon: LayoutDashboard },
      { label: "Scan Package", href: "/driver/scan", icon: ScanLine },
      { label: "Assigned Orders", href: "/driver/orders", icon: Package },
      { label: "Messages", href: "/driver/messages", icon: MessageSquare },
      { label: "Profile", href: "/driver/profile", icon: User },
    ],
  },
] as const;

const STATUS_COLOR: Record<string, string> = {
  AVAILABLE:   "bg-green-500",
  ON_DELIVERY: "bg-[#FF9900]",
  ON_BREAK:    "bg-yellow-500",
  OFFLINE:     "bg-slate-500",
  SUSPENDED:   "bg-red-500",
};

export function DriverSidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const status = useDriverStatus();
  const { isCollapsed, toggle } = useSellerSidebarStore();

  const isActive = (href: string) =>
    href === "/driver/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="hidden md:flex flex-col h-screen sticky top-0 bg-[#0F172A] border-r border-slate-800 overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-slate-800 flex-shrink-0">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold flex items-center justify-center flex-shrink-0">
                <Truck className="w-4 h-4" />
              </div>
              <span className="font-semibold text-base text-white whitespace-nowrap">
                Driver <span className="text-[#FF9900]">App</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-hide">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-6">
            <AnimatePresence initial={false}>
              {!isCollapsed && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  className="px-3 mb-1.5 text-[10px] font-semibold text-slate-500 uppercase tracking-widest"
                >
                  {group.label}
                </motion.p>
              )}
            </AnimatePresence>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href} href={item.href} title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 group relative",
                      active ? "bg-[#FF9900] text-[#0F172A] shadow-sm font-semibold" : "text-slate-400 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="flex-shrink-0 w-[18px] h-[18px]" strokeWidth={active ? 2 : 1.8} />
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                          className="text-sm truncate overflow-hidden whitespace-nowrap"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 z-tooltip px-2.5 py-1.5 rounded-lg bg-slate-800 text-white text-xs whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        {item.label}
                        <div className="absolute top-1/2 -left-1 -translate-y-1/2 border-4 border-transparent border-r-slate-800" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User bottom */}
      <div className="flex-shrink-0 p-3 border-t border-slate-800 flex items-center gap-3 relative">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-[#1A365D] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {(user?.firstName?.[0] ?? user?.email?.[0] ?? "D").toUpperCase()}
          </div>
          <span className={cn(
            "absolute top-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0F172A]",
            STATUS_COLOR[status] ?? "bg-slate-500"
          )} title={`Status: ${status}`} />
        </div>
        
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
              className="overflow-hidden min-w-0"
            >
              <p className="text-xs font-medium text-white truncate">
                {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : user?.email ?? "Driver"}
              </p>
              <p className="text-[10px] text-slate-500 capitalize">{status.replace('_', ' ').toLowerCase()}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
