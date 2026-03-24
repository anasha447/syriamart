"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, MapPin, LogOut, Store, Truck } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import { useAuthStore } from "@/lib/store/auth.store";
import { AuthGuard } from "@/components/shared/AuthGuard";
import { cn } from "@/lib/utils";

const NAV = [
  { icon: User,    label: "Profile",    href: "/account/profile"   },
  { icon: Package, label: "My Orders",  href: "/account/orders"    },
  { icon: Heart,   label: "Wishlists",  href: "/account/wishlists" },
  { icon: MapPin,  label: "Addresses",  href: "/account/addresses" },
];

const UPGRADE_NAV = [
  { icon: Store, label: "Become a Vendor", href: "/account/upgrade/vendor",
    desc: "Start selling on SyrianMart" },
  { icon: Truck, label: "Become a Driver", href: "/account/upgrade/driver",
    desc: "Deliver and earn flexibly" },
];

function AccountSidebar() {
  const pathname  = usePathname();
  const user      = useAuthStore((s) => s.user);
  const logout    = useLogout();

  return (
    <aside className="w-52 flex-shrink-0 hidden sm:block">
      {/* User avatar */}
      <div className="flex items-center gap-3 px-3 py-4 mb-2">
        <div className="w-10 h-10 rounded-full bg-[#1A365D] text-white font-bold flex items-center justify-center">
          {(user?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">
            {user?.firstName ?? "My Account"}
          </p>
          <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
        </div>
      </div>

      <nav className="space-y-0.5">
        {NAV.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
              pathname === href || (href !== "/account/profile" && pathname.startsWith(href))
                ? "bg-[#EFF6FF] dark:bg-[#172554] text-[#1A365D] dark:text-[#3B82F6]"
                : "text-neutral-600 dark:text-neutral-400 hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
            {label}
          </Link>
        ))}

        {/* Role-upgrade options — only visible to plain CUSTOMER accounts */}
        {user?.role === "CUSTOMER" && (
          <div className="mt-3 mb-1">
            <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Grow with us
            </p>
            {UPGRADE_NAV.map(({ icon: Icon, label, href }) => (
              <Link key={href} href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group",
                  pathname.startsWith(href)
                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 hover:text-amber-700 dark:hover:text-amber-400"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
                {label}
              </Link>
            ))}
          </div>
        )}

        <button
          onClick={() => logout.mutate()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" strokeWidth={1.8} />
          Sign out
        </button>
      </nav>
    </aside>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["CUSTOMER", "SELLER", "ADMIN"]}>
      <div className="container mx-auto py-8">
        <div className="flex gap-8 items-start">
          <AccountSidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
