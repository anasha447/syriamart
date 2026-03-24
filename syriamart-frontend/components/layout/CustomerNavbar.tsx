"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, ShoppingCart, User, Menu, X,
  ChevronDown, Package, Heart, LogOut,
  LayoutDashboard, Settings, Grid3X3, ChevronRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCartStore, useCartTotalItems } from "@/lib/store/cart.store";
import { useCategoryTree } from "@/hooks/useCategories";
import { useDebounce } from "@/hooks/useDebounce";
import { cn } from "@/lib/utils";
import type { CategoryTreeResponse } from "@/types/api";

// ── Logo ──────────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
      <div className="w-8 h-8 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold text-sm flex items-center justify-center transition-transform group-hover:scale-105 duration-150">
        S
      </div>
      <span className="font-semibold text-lg text-[#1A365D] dark:text-white hidden sm:block">
        Syrian<span className="text-[#FF9900]">Mart</span>
      </span>
    </Link>
  );
}

// ── Search Bar ────────────────────────────────────────────────────────────────
function SearchBar({ className }: { className?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const debouncedQuery = useDebounce(query, 300); // eslint-disable-line @typescript-eslint/no-unused-vars
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith("/search")) setQuery("");
  }, [pathname]);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const t = query.trim();
    if (!t) return;
    router.push(`/search?q=${encodeURIComponent(t)}`);
    inputRef.current?.blur();
  }, [query, router]);

  return (
    <form onSubmit={handleSearch} className={cn("relative flex-1", className)}>
      <div className={cn(
        "flex items-center h-10 rounded-full border transition-all duration-200",
        "bg-neutral-100 dark:bg-neutral-800",
        isFocused
          ? "border-[#1A365D] dark:border-[#3B82F6] ring-2 ring-[#1A365D]/15 dark:ring-[#3B82F6]/15"
          : "border-transparent"
      )}>
        <Search className="ml-3 w-4 h-4 text-neutral-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search products, brands, sellers…"
          className="flex-1 px-3 bg-transparent text-sm outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 min-w-0"
          autoComplete="off"
        />
        {query && (
          <button type="button" onClick={() => { setQuery(""); inputRef.current?.focus(); }}
            className="mr-2 p-0.5 rounded-full text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}

// ── Mega-Menu ─────────────────────────────────────────────────────────────────
function MegaMenu({ categories, onClose }: { categories: CategoryTreeResponse[]; onClose: () => void }) {
  const [active, setActive] = useState<CategoryTreeResponse | null>(categories[0] ?? null);

  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ type: "spring", stiffness: 400, damping: 32 }}
      className="absolute top-full left-0 right-0 z-dropdown bg-white dark:bg-card border-b border-border shadow-2xl"
      onMouseLeave={onClose}
    >
      <div className="container mx-auto py-7">
        <div className="flex gap-0 max-w-5xl mx-auto">

          {/* LEFT: Category list */}
          <div className="w-64 flex-shrink-0 border-r border-border pr-4">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-3 px-3">
              Browse categories
            </p>
            <div className="space-y-0.5">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onMouseEnter={() => setActive(cat)}
                  onClick={() => { onClose(); }}
                  onKeyDown={(e) => { if (e.key === 'Enter') onClose(); }}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-100 group",
                    active?.id === cat.id
                      ? "bg-[#EFF6FF] dark:bg-[#172554]"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800"
                  )}
                >
                  {/* Category image */}
                  <div className={cn(
                    "w-8 h-8 rounded-lg overflow-hidden flex-shrink-0 border",
                    active?.id === cat.id ? "border-[#1A365D]/20" : "border-border"
                  )}>
                    {cat.imageUrl ? (
                      <Image src={cat.imageUrl} alt={cat.name} width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                        <Grid3X3 className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <span className={cn(
                    "text-sm font-medium truncate flex-1 transition-colors",
                    active?.id === cat.id
                      ? "text-[#1A365D] dark:text-[#3B82F6]"
                      : "text-neutral-700 dark:text-neutral-300 group-hover:text-[#1A365D] dark:group-hover:text-white"
                  )}>
                    {cat.name}
                  </span>
                  {cat.subCategories.length > 0 && (
                    <ChevronRight className={cn(
                      "w-3.5 h-3.5 flex-shrink-0 transition-colors",
                      active?.id === cat.id ? "text-[#1A365D]" : "text-neutral-300"
                    )} />
                  )}
                </button>
              ))}
            </div>
            <Link href="/categories" onClick={onClose}
              className="flex items-center gap-1 px-3 mt-4 text-xs font-semibold text-[#1A365D] dark:text-[#3B82F6] hover:underline"
            >
              All categories →
            </Link>
          </div>

          {/* RIGHT: Sub-categories for the hovered category */}
          <div className="flex-1 pl-8 min-h-[280px]">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 pb-4 border-b border-border">
                    {active.imageUrl && (
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-border flex-shrink-0">
                        <Image src={active.imageUrl} alt={active.name} width={64} height={64} className="object-cover w-full h-full" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{active.name}</h3>
                      {active.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 max-w-xs">{active.description}</p>
                      )}
                      <Link href={`/category/${active.id}`} onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#1A365D] dark:text-[#3B82F6] mt-2 hover:underline"
                      >
                        Shop all {active.name} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>

                  {/* Sub-category grid */}
                  {active.subCategories.length > 0 ? (
                    <div className="grid grid-cols-3 lg:grid-cols-4 gap-2">
                      {active.subCategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${active.id}?sub=${sub.id}`}
                          onClick={onClose}
                          className="group flex items-center gap-2.5 p-2.5 rounded-xl border border-transparent hover:border-border hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-100"
                        >
                          <div className="w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 border border-border flex-shrink-0">
                            {sub.imageUrl ? (
                              <Image src={sub.imageUrl} alt={sub.name} width={36} height={36} className="object-cover w-full h-full" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-neutral-400">
                                {sub.name[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                          <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300 group-hover:text-[#1A365D] dark:group-hover:text-white transition-colors line-clamp-2 leading-tight">
                            {sub.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                      Browse all products in {active.name}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Cart Button ───────────────────────────────────────────────────────────────
function CartButton() {
  const totalItems = useCartTotalItems();
  const toggleCart = useCartStore((s) => s.toggleCart);
  return (
    <button onClick={toggleCart} aria-label={`Cart${totalItems > 0 ? `, ${totalItems}` : ""}`}
      className="relative p-2 rounded-full text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
    >
      <ShoppingCart className="w-5 h-5" strokeWidth={1.8} />
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span key="badge"
            initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#FF9900] text-[#0F172A] text-[10px] font-bold rounded-full flex items-center justify-center leading-none"
          >
            {totalItems > 99 ? "99+" : totalItems}
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

// ── Vendor/Driver Signup Links ────────────────────────────────────────────────
function SignupLinks() {
  const { user, isAuthenticated } = useAuthStore();
  
  // Show only for visitors and customers
  if (isAuthenticated && user?.role !== "CUSTOMER") return null;

  return (
    <div className="hidden lg:flex items-center gap-3 mr-2 pr-3 border-r border-border">
      <Link href="/register/seller" className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#1A365D] dark:hover:text-[#3B82F6] transition-colors">
        Become a Vendor
      </Link>
      <span className="text-border text-sm">|</span>
      <Link href="/register/driver" className="text-sm font-semibold text-neutral-600 dark:text-neutral-300 hover:text-[#1A365D] dark:hover:text-[#3B82F6] transition-colors">
        Become a Driver
      </Link>
    </div>
  );
}

// ── User Menu ─────────────────────────────────────────────────────────────────
function UserMenu() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsOpen(false);
    try {
      const { authApi } = await import("@/lib/api/auth");
      await authApi.logout(useAuthStore.getState().token ?? "");
    } finally {
      clearAuth();
      router.replace("/login");
    }
  }, [clearAuth, router]);

  if (!isAuthenticated || !user) {
    return (
      <Link href="/login"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-[#1A365D] text-[#1A365D] hover:bg-[#1A365D] hover:text-white dark:border-[#3B82F6] dark:text-[#3B82F6] dark:hover:bg-[#3B82F6] dark:hover:text-white transition-colors duration-150"
      >
        <User className="w-4 h-4" />
        <span className="hidden md:block">Sign in</span>
      </Link>
    );
  }

  const items = [
    { icon: User,            label: "My Profile",   href: "/account/profile"   },
    { icon: Package,         label: "My Orders",    href: "/account/orders"    },
    { icon: Heart,           label: "Wishlists",    href: "/account/wishlists" },
    ...(user.role === "SELLER" ? [{ icon: LayoutDashboard, label: "Seller Dashboard", href: "/seller/dashboard" }] : []),
    ...(user.role === "ADMIN"  ? [{ icon: LayoutDashboard, label: "Admin Panel",       href: "/admin/dashboard"  }] : []),
    { icon: Settings,        label: "Settings",     href: "/account/profile"   },
  ];

  return (
    <div ref={menuRef} className="relative">
      <button onClick={() => setIsOpen((o) => !o)} aria-expanded={isOpen}
        className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-[#1A365D] text-white text-xs font-semibold flex items-center justify-center">
          {(user.firstName?.[0] ?? user.email?.[0] ?? "U").toUpperCase()}
        </div>
        <ChevronDown className={cn("hidden lg:block w-4 h-4 text-neutral-400 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-56 z-dropdown bg-white dark:bg-card rounded-xl shadow-lg border border-border overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground truncate">
                {user.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user.email}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{user.email}</p>
            </div>
            <div className="py-1">
              {items.map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href} onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-muted transition-colors"
                >
                  <Icon className="w-4 h-4 text-neutral-400" strokeWidth={1.8} />{label}
                </Link>
              ))}
            </div>
            <div className="border-t border-border py-1">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="w-4 h-4" strokeWidth={1.8} />Sign out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main CustomerNavbar export ────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Deals",      href: "/search?sort=discount" },
  { label: "New in",     href: "/search?sort=newest"   },
  { label: "Top rated",  href: "/search?sort=rating"   },
  { label: "Track order",href: "/tracking"             },
];

export function CustomerNavbar() {
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [isScrolled,   setIsScrolled]   = useState(false);
  const pathname = usePathname();
  const { data: categories } = useCategoryTree();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fn = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setMobileOpen(false); setMegaMenuOpen(false); }, [pathname]);

  return (
    <header className={cn(
      "sticky top-0 z-sticky w-full bg-white dark:bg-[#0F172A] transition-all duration-200",
      "border-b",
      isScrolled ? "border-border shadow-sm" : "border-transparent"
    )}>
      {/* Main row */}
      <div className="container mx-auto">
        <div className="flex items-center gap-3 h-16">
          <Logo />
          <SearchBar className="flex-1 max-w-2xl hidden sm:flex" />
          {/* Spacer pushes right-side controls to the absolute far right */}
          <div className="flex-1 hidden sm:block" />
          <nav className="flex items-center gap-1 ml-auto">
            <SignupLinks />
            <CartButton />
            <UserMenu />
            <button onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </nav>
        </div>

        {/* Mobile search */}
        <div className="pb-3 sm:hidden px-1"><SearchBar /></div>

        {/* Desktop sub-nav */}
        <nav className="hidden md:flex items-center gap-1 pb-1">
          {/* Categories mega-menu trigger */}
          <div
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}
            className="relative"
          >
            <button className={cn(
              "flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
              megaMenuOpen
                ? "text-[#1A365D] dark:text-[#3B82F6] bg-[#EFF6FF] dark:bg-[#172554]"
                : "text-neutral-600 dark:text-neutral-400 hover:text-[#1A365D] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}>
              <Grid3X3 className="w-3.5 h-3.5" />
              Categories
              <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", megaMenuOpen && "rotate-180")} />
            </button>
          </div>

          {NAV_LINKS.map(({ label, href }) => (
            <Link key={href} href={href}
              className={cn(
                "px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
                pathname === href
                  ? "text-[#1A365D] dark:text-[#3B82F6] bg-[#EFF6FF] dark:bg-[#172554]"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-[#1A365D] dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800"
              )}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mega-Menu */}
      <div
        onMouseEnter={() => setMegaMenuOpen(true)}
        onMouseLeave={() => setMegaMenuOpen(false)}
      >
        <AnimatePresence>
          {megaMenuOpen && categories && categories.length > 0 && (
            <MegaMenu categories={categories} onClose={() => setMegaMenuOpen(false)} />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="md:hidden overflow-hidden border-t border-border"
          >
            <nav className="container mx-auto py-3 flex flex-col gap-1">
              <Link href="/categories" className="px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-2">
                <Grid3X3 className="w-4 h-4 text-neutral-400" />Categories
              </Link>
              {NAV_LINKS.map(({ label, href }) => (
                <Link key={href} href={href}
                  className="px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                >
                  {label}
                </Link>
              ))}
              {(!isAuthenticated || user?.role === "CUSTOMER") && (
                <>
                  <div className="h-px bg-border my-1" />
                  <Link href="/register/seller" className="px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Become a Vendor</Link>
                  <Link href="/register/driver" className="px-3 py-2.5 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">Become a Driver</Link>
                </>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
