"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProductSearch } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const q            = searchParams.get("q") ?? "";
  const [page, setPage] = useState(0);
  const query        = useDebounce(q, 150);

  const { data, isLoading } = useProductSearch(query, page);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Search className="w-4 h-4" />
          <span>Search results for</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          "{q}"
          {data && (
            <span className="text-base font-normal text-muted-foreground ml-3">
              {data.totalElements} results
            </span>
          )}
        </h1>
      </div>

      {/* Results grid */}
      <ProductGrid
        products={data?.results ?? []}
        loading={isLoading}
        skeletonCount={12}
        emptyMessage={`No products found for "${q}". Try a different search term.`}
      />

      {/* Pagination */}
      {(data?.totalPages ?? 0) > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="h-9 px-4 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
          >
            ← Previous
          </button>
          <span className="text-sm text-muted-foreground">Page {page + 1} of {data?.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.totalPages ?? 1) - 1}
            className="h-9 px-4 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
