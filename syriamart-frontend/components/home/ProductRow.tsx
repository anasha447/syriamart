"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/LoadingSkeleton";
import type { ProductSummaryResponse } from "@/types/api";
import { cn } from "@/lib/utils";

interface ProductRowProps {
  title:       string;
  subtitle?:   string;
  products:    ProductSummaryResponse[];
  loading?:    boolean;
  viewAllHref: string;
  accentColor?: string;
}

/**
 * Horizontal scrollable product row used on the home page.
 * Header: title + subtitle + "View all" link.
 * Body: scroll-snap row with prev/next arrows.
 */
export function ProductRow({
  title,
  subtitle,
  products,
  loading      = false,
  viewAllHref,
  accentColor  = "#1A365D",
}: ProductRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const c = scrollRef.current;
    if (!c) return;
    c.scrollBy({ left: dir === "right" ? c.clientWidth * 0.7 : -(c.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <section>
      {/* Section header */}
      <div className="flex items-end justify-between mb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>
        <Link
          href={viewAllHref}
          className="text-sm font-semibold flex items-center gap-1 hover:underline flex-shrink-0 ml-4"
          style={{ color: accentColor }}
        >
          View all <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Scrollable row */}
      <div className="relative group">
        {/* Arrows */}
        {[
          { dir: "left"  as const, pos: "-left-5", Icon: ChevronLeft  },
          { dir: "right" as const, pos: "-right-5", Icon: ChevronRight },
        ].map(({ dir, pos, Icon }) => (
          <button
            key={dir}
            onClick={() => scroll(dir)}
            aria-label={`Scroll ${dir}`}
            className={cn(
              "absolute top-1/2 -translate-y-1/2 z-10",
              pos,
              "w-9 h-9 rounded-full border border-border bg-white dark:bg-card shadow-md",
              "flex items-center justify-center text-neutral-600 dark:text-neutral-300",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}

        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scrollbar-hide pb-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex-shrink-0 w-[180px] sm:w-[200px]" style={{ scrollSnapAlign: "start" }}>
                  <ProductCardSkeleton />
                </div>
              ))
            : products.map((p) => (
                <div key={p.id} className="flex-shrink-0 w-[180px] sm:w-[200px]" style={{ scrollSnapAlign: "start" }}>
                  <ProductCard product={p} compact />
                </div>
              ))
          }
        </div>
      </div>
    </section>
  );
}
