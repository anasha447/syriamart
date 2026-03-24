"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Check, Loader2 } from "lucide-react";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCartStore } from "@/lib/store/cart.store";
import { formatCurrency, cn } from "@/lib/utils";
import type { ProductSummaryResponse } from "@/types/api";

interface ProductCardProps {
  product:    ProductSummaryResponse;
  className?: string;
  /** Show a more compact layout for carousel rows */
  compact?:   boolean;
}

/**
 * The primary product display card used across the entire customer storefront.
 *
 * Design decisions:
 *   - Image fills a perfect square with object-cover — no layout shifts
 *   - Price in Midnight Trust blue — authority and trust
 *   - "Add to Cart" in Amazon Amber — the conversion engine
 *   - Spring-physics hover lift on the card — premium feel, not gimmicky
 *   - Added-to-cart confirmation with a green checkmark (1.5s) before resetting
 *   - Star rating rendered as filled/half/empty SVG stars for precision
 *   - Discount badge auto-calculated from basePrice vs effectivePrice
 */
export function ProductCard({ product, className, compact = false }: ProductCardProps) {
  const addToCart       = useAddToCart();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openCart        = useCartStore((s) => s.openCart);
  const [added, setAdded] = useState(false);

  const discountPct =
    product.basePrice > product.effectivePrice
      ? Math.round(((product.basePrice - product.effectivePrice) / product.basePrice) * 100)
      : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      window.location.href = `/login?returnTo=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          setAdded(true);
          openCart();
          setTimeout(() => setAdded(false), 1500);
        },
      }
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={cn(
        "group flex flex-col rounded-2xl border border-border bg-white dark:bg-card",
        "overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200",
        className
      )}
    >
      <Link href={`/product/${product.slug}`} className="contents">
        {/* ── Image ── */}
        <div className={cn(
          "relative w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900",
          compact ? "aspect-[4/3]" : "aspect-square"
        )}>
          {product.primaryImageUrl ? (
            <Image
              src={product.primaryImageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingCart className="w-10 h-10 text-neutral-200" strokeWidth={1} />
            </div>
          )}

          {/* Discount badge */}
          {discountPct >= 5 && (
            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              -{discountPct}%
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={(e) => e.preventDefault()}
            className={cn(
              "absolute top-2.5 right-2.5 w-7 h-7 rounded-full",
              "bg-white/90 dark:bg-card/90 backdrop-blur-sm",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
              "text-neutral-400 hover:text-red-500 transition-colors"
            )}
          >
            <Heart className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* ── Content ── */}
        <div className="flex flex-col gap-2 p-3.5 flex-1">
          {/* Product name */}
          <p className={cn(
            "font-medium text-[#1A365D] dark:text-neutral-100 leading-snug",
            compact ? "text-xs line-clamp-1" : "text-sm line-clamp-2 min-h-[2.5rem]"
          )}>
            {product.name}
          </p>

          {/* Star rating */}
          {product.totalReviews > 0 && (
            <div className="flex items-center gap-1.5">
              <StarRating rating={product.averageRating} size={12} />
              <span className="text-[10px] text-neutral-400 tabular-nums">
                ({product.totalReviews})
              </span>
            </div>
          )}

          {/* Price row + Add to Cart */}
          <div className="flex items-end justify-between gap-2 mt-auto pt-2">
            <div className="flex flex-col">
              <span className={cn(
                "font-bold text-[#1A365D] dark:text-white tabular-nums",
                compact ? "text-sm" : "text-base"
              )}>
                {formatCurrency(product.effectivePrice)}
              </span>
              {discountPct >= 5 && (
                <span className="text-[11px] text-neutral-400 line-through tabular-nums">
                  {formatCurrency(product.basePrice)}
                </span>
              )}
            </div>

            {/* Add to Cart — Amazon Amber */}
            <motion.button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || added}
              whileTap={{ scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={cn(
                "h-8 rounded-full font-semibold text-xs transition-all duration-200 flex-shrink-0",
                "flex items-center gap-1.5 px-3",
                "disabled:cursor-not-allowed",
                added
                  ? "bg-[#16A34A] text-white"
                  : "bg-[#FF9900] text-[#0F172A] hover:bg-[#E68A00] hover:shadow-md"
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                {addToCart.isPending ? (
                  <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </motion.span>
                ) : added ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="default"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    {compact ? "" : "Add"}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Star Rating ────────────────────────────────────────────────────────────
function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star;
        const half   = !filled && rating >= star - 0.5;
        return (
          <svg key={star} width={size} height={size} viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1l1.236 2.504L10 3.9l-2 1.95.472 2.75L6 7.25l-2.472 1.35L4 5.85 2 3.9l2.764-.396L6 1z"
              fill={filled ? "#FF9900" : half ? "url(#halfStar)" : "none"}
              stroke={filled || half ? "#FF9900" : "#D1D5DB"}
              strokeWidth="0.8"
            />
            {half && (
              <defs>
                <linearGradient id="halfStar" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="50%" stopColor="#FF9900" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
            )}
          </svg>
        );
      })}
    </div>
  );
}

export { StarRating };
