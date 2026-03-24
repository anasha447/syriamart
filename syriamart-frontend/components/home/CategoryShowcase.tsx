"use client";

import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3X3 } from "lucide-react";
import type { CategoryTreeResponse } from "@/types/api";
import { cn } from "@/lib/utils";

interface CategoryShowcaseProps {
  categories: CategoryTreeResponse[];
}

/**
 * Horizontal scrollable category showcase with circular/rounded-square avatars.
 * Shows category images with name below — visually premium.
 * Arrow buttons scroll the container 3 items at a time.
 */
export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.6;
    container.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  if (!categories.length) return null;

  return (
    <div className="relative group">
      {/* Scroll arrows */}
      {[
        { dir: "left"  as const, pos: "-left-4 sm:-left-5", Icon: ChevronLeft  },
        { dir: "right" as const, pos: "-right-4 sm:-right-5", Icon: ChevronRight },
      ].map(({ dir, pos, Icon }) => (
        <button
          key={dir}
          onClick={() => scroll(dir)}
          aria-label={`Scroll ${dir}`}
          className={cn(
            "absolute top-6 z-10 -translate-y-0",
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

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 px-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04, type: "spring", stiffness: 300, damping: 28 }}
            style={{ scrollSnapAlign: "start" }}
            className="flex-shrink-0"
          >
            <Link
              href={`/category/${cat.id}`}
              className="group/cat flex flex-col items-center gap-2.5 w-[80px] sm:w-[90px]"
            >
              {/* Avatar */}
              <div className={cn(
                "relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden",
                "border-2 border-transparent group-hover/cat:border-[#1A365D] dark:group-hover/cat:border-[#3B82F6]",
                "transition-all duration-200 shadow-sm group-hover/cat:shadow-md",
                "bg-neutral-100 dark:bg-neutral-800"
              )}>
                {cat.imageUrl ? (
                  <Image
                    src={cat.imageUrl}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    className="object-cover transition-transform duration-300 group-hover/cat:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Grid3X3 className="w-7 h-7 text-neutral-300" strokeWidth={1} />
                  </div>
                )}
                {/* Teal accent overlay on hover */}
                <div className="absolute inset-0 bg-[#1A365D]/0 group-hover/cat:bg-[#1A365D]/10 transition-colors duration-200" />
              </div>

              {/* Category name */}
              <span className="text-[11px] sm:text-xs font-medium text-center text-neutral-700 dark:text-neutral-300 group-hover/cat:text-[#1A365D] dark:group-hover/cat:text-white transition-colors leading-tight line-clamp-2">
                {cat.name}
              </span>
            </Link>
          </motion.div>
        ))}

        {/* "All categories" tile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: categories.length * 0.04 }}
          style={{ scrollSnapAlign: "start" }}
          className="flex-shrink-0"
        >
          <Link href="/categories" className="group/cat flex flex-col items-center gap-2.5 w-[80px] sm:w-[90px]">
            <div className={cn(
              "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl",
              "border-2 border-dashed border-neutral-200 dark:border-neutral-700",
              "group-hover/cat:border-[#1A365D] dark:group-hover/cat:border-[#3B82F6]",
              "flex items-center justify-center",
              "bg-neutral-50 dark:bg-neutral-800/60",
              "transition-all duration-200"
            )}>
              <Grid3X3 className="w-7 h-7 text-neutral-400 group-hover/cat:text-[#1A365D] dark:group-hover/cat:text-[#3B82F6] transition-colors" />
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-center text-muted-foreground group-hover/cat:text-[#1A365D] dark:group-hover/cat:text-white transition-colors">
              All categories
            </span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
