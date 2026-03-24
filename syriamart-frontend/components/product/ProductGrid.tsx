import React from "react";
import { ProductCard } from "./ProductCard";
import { ProductGridSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductSummaryResponse } from "@/types/api";

interface ProductGridProps {
  products:   ProductSummaryResponse[];
  loading?:   boolean;
  skeletonCount?: number;
  columns?:   "4" | "5" | "auto";
  className?: string;
  emptyMessage?: string;
}

/**
 * RSC-compatible product grid — accepts serializable props only.
 * Each ProductCard is a client component (Add to Cart button).
 */
export function ProductGrid({
  products,
  loading        = false,
  skeletonCount  = 8,
  columns        = "auto",
  className,
  emptyMessage   = "No products found.",
}: ProductGridProps) {
  const gridClass = cn(
    "grid gap-4",
    columns === "4"    && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    columns === "5"    && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    columns === "auto" && "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    className
  );

  if (loading) return <ProductGridSkeleton count={skeletonCount} />;

  if (!products.length) {
    return (
      <EmptyState
        icon={<Search className="w-7 h-7" />}
        title="No products found"
        description={emptyMessage}
        className="py-16"
      />
    );
  }

  return (
    <div className={gridClass}>
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
