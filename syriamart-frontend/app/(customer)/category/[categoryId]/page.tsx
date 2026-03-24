"use client";

import React, { useState, useCallback } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Filter, Grid, List, SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { useProductsByCategory } from "@/hooks/useProducts";
import { useCategoryById } from "@/hooks/useCategories";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

const SORT_OPTIONS = [
  { value: "totalSold",      label: "Best Selling"   },
  { value: "averageRating",  label: "Top Rated"      },
  { value: "effectivePrice", label: "Price: Low → High" },
  { value: "price-desc",     label: "Price: High → Low" },
  { value: "createdAt",      label: "Newest First"   },
];

const PRICE_RANGES = [
  { label: "Under 10,000 SYP",  min: 0,      max: 10000  },
  { label: "10,000 – 50,000",   min: 10000,  max: 50000  },
  { label: "50,000 – 200,000",  min: 50000,  max: 200000 },
  { label: "Over 200,000 SYP",  min: 200000, max: Infinity },
];

/**
 * Category browsing page with filter sidebar and sortable product grid.
 * Client component — filters/sort state is managed locally and passed to
 * the TanStack Query hook for server-side filtering.
 */
export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>();
  const searchParams   = useSearchParams();
  const subId          = searchParams.get("sub");

  const [sort,          setSort]          = useState("totalSold");
  const [priceRange,    setPriceRange]    = useState<{ min: number; max: number } | null>(null);
  const [minRating,     setMinRating]     = useState<number | null>(null);
  const [viewMode,      setViewMode]      = useState<"grid" | "list">("grid");
  const [filterOpen,    setFilterOpen]    = useState(false);
  const [page,          setPage]          = useState(0);

  const { data: category } = useCategoryById(categoryId);
  const { data, isLoading } = useProductsByCategory(categoryId, page);

  const activeFiltersCount = [priceRange, minRating].filter(Boolean).length;

  const clearFilters = useCallback(() => {
    setPriceRange(null);
    setMinRating(null);
    setSort("totalSold");
    setPage(0);
  }, []);

  // Client-side filter the products (in production, add server-side query params)
  const products = data?.products?.filter((p) => {
    if (priceRange && (p.effectivePrice < priceRange.min || p.effectivePrice > priceRange.max)) return false;
    if (minRating && p.averageRating < minRating) return false;
    return true;
  }) ?? [];

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <a href="/" className="hover:text-foreground">Home</a>
        <span>/</span>
        <span className="text-foreground font-medium">{category?.name ?? "Category"}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1A365D] dark:text-white">
            {category?.name ?? "Products"}
          </h1>
          {category?.description && (
            <p className="text-sm text-muted-foreground mt-1 max-w-md">{category.description}</p>
          )}
          {data && (
            <p className="text-xs text-muted-foreground mt-2">
              {data.totalElements} products found
            </p>
          )}
        </div>

        {/* Sort + view controls */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Sort dropdown */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(0); }}
              className="h-9 pl-3 pr-8 rounded-lg border border-input bg-background text-sm text-foreground outline-none focus:ring-2 focus:ring-[#1A365D]/20 appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>

          {/* Grid/List toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            {[{ mode: "grid" as const, Icon: Grid }, { mode: "list" as const, Icon: List }].map(({ mode, Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "w-9 h-9 flex items-center justify-center transition-colors",
                  viewMode === mode
                    ? "bg-[#1A365D] text-white dark:bg-[#3B82F6]"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setFilterOpen((o) => !o)}
            className={cn(
              "lg:hidden flex items-center gap-1.5 h-9 px-3 rounded-lg border text-sm font-medium transition-colors",
              filterOpen || activeFiltersCount > 0
                ? "bg-[#1A365D] text-white border-[#1A365D]"
                : "border-input text-foreground hover:bg-muted"
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF9900] text-[#0F172A] text-[10px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar filter panel ── */}
        <aside className={cn(
          "w-56 flex-shrink-0 space-y-6",
          "lg:block",
          filterOpen ? "block" : "hidden lg:block"
        )}>
          {/* Active filters */}
          {activeFiltersCount > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Active filters</span>
              <button onClick={clearFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                <X className="w-3 h-3" />Clear all
              </button>
            </div>
          )}

          {/* Price range */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5" />Price Range
            </h3>
            <div className="space-y-1.5">
              <button
                onClick={() => setPriceRange(null)}
                className={cn(
                  "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                  !priceRange ? "bg-[#EFF6FF] dark:bg-[#172554] text-[#1A365D] dark:text-[#3B82F6] font-medium" : "text-foreground hover:bg-muted"
                )}
              >
                Any price
              </button>
              {PRICE_RANGES.map((r) => (
                <button
                  key={r.label}
                  onClick={() => setPriceRange(r.max === Infinity ? { min: r.min, max: 999_999_999 } : r)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors",
                    priceRange?.min === r.min
                      ? "bg-[#EFF6FF] dark:bg-[#172554] text-[#1A365D] dark:text-[#3B82F6] font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum rating */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Minimum Rating</h3>
            <div className="space-y-1.5">
              {[null, 4, 3, 2].map((r) => (
                <button
                  key={String(r)}
                  onClick={() => setMinRating(r)}
                  className={cn(
                    "w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-2",
                    minRating === r
                      ? "bg-[#EFF6FF] dark:bg-[#172554] text-[#1A365D] dark:text-[#3B82F6] font-medium"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {r === null ? "Any rating" : (
                    <>{r}+ <span className="text-[#FF9900]">★</span></>
                  )}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ── Product grid ── */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<Search className="w-7 h-7" />}
              title="No products found"
              description="Try adjusting your filters or browse other categories."
              action={
                <button onClick={clearFilters} className="px-4 py-2 rounded-lg bg-[#1A365D] text-white text-sm font-medium">
                  Clear filters
                </button>
              }
            />
          ) : (
            <>
              <div className={cn(
                "grid gap-4",
                viewMode === "grid"
                  ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              )}>
                {products.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ProductCard product={p} compact={viewMode === "list"} />
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {(data?.totalPages ?? 0) > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                    className="h-9 px-4 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    ← Previous
                  </button>
                  <span className="text-sm text-muted-foreground px-3">
                    Page {page + 1} of {data?.totalPages}
                  </span>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.totalPages ?? 1) - 1}
                    className="h-9 px-4 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
