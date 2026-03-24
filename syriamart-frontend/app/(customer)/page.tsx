/**
 * app/(customer)/page.tsx — SyrianMart Homepage
 *
 * Rendering strategy:
 *   - This file is a React Server Component (no "use client")
 *   - It pre-fetches categories + top-selling for ISR (revalidate: 300s)
 *   - Interactive sections (carousel, scrollable rows) are client components
 *     that receive pre-fetched data as props — zero loading spinners above the fold
 */

import React, { Suspense } from "react";
import Link from "next/link";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ChevronRight, Shield, Truck, Star, RotateCcw } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { ProductRow } from "@/components/home/ProductRow";
import { makeServerQueryClient, queryKeys } from "@/lib/queryClient";
import { categoriesApi } from "@/lib/api/categories";
import { productsApi } from "@/lib/api/products";
import type { Metadata } from "next";

export const revalidate = 300; // ISR: rebuild this page every 5 minutes

export const metadata: Metadata = {
  title: "SyrianMart — Shop Syria's Best",
  description: "SyrianMart is Syria's premier multi-vendor marketplace. Shop electronics, fashion, home goods and more from thousands of verified sellers.",
  openGraph: {
    title: "SyrianMart — Shop Syria's Best",
    description: "Shop from thousands of verified sellers with secure checkout and real-time delivery tracking.",
  },
};


// ── Promo Banners ────────────────────────────────────────────────────────────
function PromoBanners() {
  const banners = [
    {
      title: "Become a Seller",
      desc: "Open your store today and reach thousands of customers.",
      href: "/register/seller",
      bg: "bg-[#1A365D]",
      cta: "Start Selling",
      ctaClass: "bg-[#FF9900] text-[#0F172A]",
    },
    {
      title: "Track Your Order",
      desc: "Real-time QR scanning lets you follow every step.",
      href: "/tracking",
      bg: "bg-[#0F172A]",
      cta: "Track Now",
      ctaClass: "bg-white/10 text-white border border-white/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {banners.map((b) => (
        <div key={b.title} className={`${b.bg} rounded-2xl p-6 flex items-center justify-between gap-4`}>
          <div>
            <h3 className="font-bold text-white text-lg">{b.title}</h3>
            <p className="text-white/60 text-sm mt-1">{b.desc}</p>
          </div>
          <Link
            href={b.href}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-opacity hover:opacity-90 ${b.ctaClass}`}
          >
            {b.cta} →
          </Link>
        </div>
      ))}
    </div>
  );
}

// ── Server-side data + client hydration islands ───────────────────────────────
// Client wrappers that receive pre-fetched data via HydrationBoundary.
// They immediately read from cache without firing any network requests.

async function HomeContent() {
  // Pre-fetch on the server so the page is fully rendered on first load
  const qc = makeServerQueryClient();

  const [categories, topSelling, topRated] = await Promise.all([
    categoriesApi.getTree().catch(() => []),
    productsApi.topSelling(16).catch(() => ({ products: [], totalElements: 0, page: 0, size: 16, totalPages: 0 })),
    productsApi.topRated(16).catch(() => ({ products: [], totalElements: 0, page: 0, size: 16, totalPages: 0 })),
  ]);

  // Seed the server QueryClient so HydrationBoundary can transfer to client
  qc.setQueryData(queryKeys.categories.tree(), categories);
  qc.setQueryData(queryKeys.products.topSelling(), topSelling);
  qc.setQueryData(queryKeys.products.topRated(), topRated);

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <div className="space-y-12 sm:space-y-16">

        {/* Hero carousel — client component, receives no props */}
        <HeroCarousel />       

        {/* Category showcase */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
              Shop by Category
            </h2>
            <Link href="/categories"
              className="text-sm font-semibold text-[#1A365D] dark:text-[#3B82F6] flex items-center gap-1 hover:underline"
            >
              All categories <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <CategoryShowcase categories={categories} />
        </section>

        {/* Promo banners */}
        <PromoBanners />

        {/* Top-selling products row */}
        <ProductRow
          title="Top Selling"
          subtitle="Most-loved by SyrianMart shoppers"
          products={topSelling.products}
          viewAllHref="/search?sort=totalSold"
        />

        {/* Top-rated products row */}
        <ProductRow
          title="Top Rated"
          subtitle="Highest-rated by verified buyers"
          products={topRated.products}
          viewAllHref="/search?sort=rating"
          accentColor="#16A34A"
        />

        {/* Newsletter / sign-up section */}
        <div className="rounded-2xl bg-gradient-to-r from-[#1A365D] to-[#1E3A5F] p-8 sm:p-10 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Get the Best Deals First
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-sm mx-auto">
            Create an account to get personalised deals, track your orders, and shop faster.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register/customer"
              className="px-6 py-3 rounded-full bg-[#FF9900] text-[#0F172A] font-semibold text-sm hover:bg-[#E68A00] transition-colors"
            >
              Create Free Account
            </Link>
            <Link
              href="/register/seller"
              className="px-6 py-3 rounded-full border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Open a Store
            </Link>
          </div>
        </div>

      </div>
    </HydrationBoundary>
  );
}

export default function HomePage() {
  return (
    <div className="container mx-auto py-6 sm:py-10">
      <Suspense
        fallback={
          <div className="space-y-8">
            <div className="skeleton h-80 sm:h-96 rounded-2xl" />
            <div className="skeleton h-20 rounded-xl" />
          </div>
        }
      >
        <HomeContent />
      </Suspense>
    </div>
  );
}
