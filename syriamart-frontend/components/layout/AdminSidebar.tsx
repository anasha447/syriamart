"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, Package, ShoppingBag,
  BarChart2, Tag, Truck, Store, CheckSquare,
  ChevronLeft, ChevronRight, Settings, Globe,
  Warehouse, Star,
} from "lucide-react";
import { useSellerSidebarStore } from "@/lib/store/ui.store";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [
      { label: "Dashboard",   href: "/admin/dashboard",  icon: LayoutDashboard },
      { label: "Analytics",   href: "/admin/analytics",  icon: BarChart2       },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "Users",       href: "/admin/users",      icon: Users    },
      { label: "Sellers",     href: "/admin/sellers",    icon: Store    },
      { label: "Moderation",  href: "/admin/moderation", icon: CheckSquare, badge: "!" },
      { label: "Products",    href: "/admin/products",   icon: Package  },
      { label: "Reviews",     href: "/admin/reviews",    icon: Star     },
    ],
  },
  {
    label: "Sales",
    items: [
      { label: "All Orders",  href: "/admin/orders",     icon: ShoppingBag },
      { label: "Coupons",     href: "/admin/coupons",    icon: Tag         },
      { label: "Revenue",     href: "/admin/revenue",    icon: Globe       },
    ],
  },
  {
    label: "Logistics",
    items: [
      { label: "Drivers",     href: "/admin/drivers",    icon: Truck     },
      { label: "Warehouse",   href: "/admin/warehouse",  icon: Warehouse },
      { label: "Returns",     href: "/admin/returns",    icon: Package   },
    ],
  },
  {
    label: "System",
    items: [
      { label: "Settings",    href: "/admin/settings",   icon: Settings },
    ],
  },
] as const;

export function AdminSidebar() {
  const pathname = usePathname();
  const { isCollapsed, toggle } = useSellerSidebarStore();

  const isActive = (href: string) =>
    href === "/admin/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 35 }}
      className="flex flex-col h-screen sticky top-0 bg-[#0F172A] border-r border-slate-800 overflow-hidden flex-shrink-0"
    >
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-3 border-b border-slate-800 flex-shrink-0">
        <AnimatePresence initial={false}>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="flex items-center gap-2 overflow-hidden"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                A
              </div>
              <span className="font-heading font-semibold text-base text-white whitespace-nowrap">
                Admin <span className="text-purple-400">Panel</span>
              </span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={toggle}
          className={cn(
            "p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex-shrink-0",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
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
                const Icon   = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={isCollapsed ? item.label : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-150 group relative",
                      active
                        ? "bg-purple-800/60 text-white"
                        : "text-slate-400 hover:text-white hover:bg-white/10"
                    )}
                  >
                    <Icon className="flex-shrink-0 w-[18px] h-[18px]" strokeWidth={active ? 2 : 1.8} />
                    <AnimatePresence initial={false}>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }}
                          className="text-sm font-medium truncate overflow-hidden whitespace-nowrap flex-1"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {"badge" in item && item.badge && !isCollapsed && (
                      <span className="ml-auto text-[10px] font-bold bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </motion.aside>
  );
}
