'use client';

import React, { useState, useCallback } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart, Heart, Star, ChevronLeft, ChevronRight,
  Check, Truck, Shield, RotateCcw, Loader2, Share2,
  Package, ZoomIn,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import { ReviewResponse } from "@/types/api";
import { useProductReviewSummary, useProductReviews } from "@/hooks/useReviews";
import { useAddToCart } from "@/hooks/useCart";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCartStore } from "@/lib/store/cart.store";
import { queryKeys } from "@/lib/queryClient";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { StarRating } from "@/components/product/ProductCard";

// ── Image Gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images }: { images: { url: string; altText?: string | null; isPrimary: boolean }[] }) {
  const sorted = [...images].sort((a, b) => (b.isPrimary ? 1 : 0) - (a.isPrimary ? 1 : 0));
  const [active, setActive] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  const go = (dir: 1 | -1) => setActive((p) => ((p + dir + sorted.length) % sorted.length));

  if (!sorted.length) {
    return (
      <div className="aspect-square rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
        <Package className="w-16 h-16 text-neutral-300" strokeWidth={1} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-neutral-50 dark:bg-neutral-900 group cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="absolute inset-0"
          >
            <Image
              src={sorted[active]!.url}
              alt={sorted[active]?.altText ?? "Product image"}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
              priority={active === 0}
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        {sorted.length > 1 && (
          <>
            <button onClick={(e) => { e.stopPropagation(); go(-1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); go(1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 dark:bg-card/80 backdrop-blur-sm flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-4 h-4 text-neutral-500" />
        </div>
      </div>

      {/* Thumbnail row */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                i === active
                  ? "border-[#1A365D] dark:border-[#3B82F6]"
                  : "border-border hover:border-neutral-400"
              )}
            >
              <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}
                         
      {/* Zoom modal */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal bg-black/90 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <div className="relative w-full max-w-2xl aspect-square">
              <Image src={sorted[active]!.url} alt="Zoomed" fill className="object-contain" />
            </div>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Variation Selector ───────────────────────────────────────────────────────
function VariationSelector({
  variations,
  selectedValueIds,
  onChange,
}: {
  variations: { id: string; name: string; options: { id: string; value: string; colorHex?: string | null }[] }[];
  selectedValueIds: Record<string, string>;
  onChange: (axisId: string, valueId: string) => void;
}) {
  return (
    <div className="space-y-4">
      {variations.map((axis) => (
        <div key={axis.id}>
          <p className="text-sm font-semibold text-foreground mb-2">
            {axis.name}
            {selectedValueIds[axis.id] && (
              <span className="ml-2 font-normal text-muted-foreground">
                {axis.options.find((o) => o.id === selectedValueIds[axis.id])?.value}
              </span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {axis.options.map((opt) => {
              const isSelected = selectedValueIds[axis.id] === opt.id;
              return opt.colorHex ? (
                // Colour swatch
                <button
                  key={opt.id}
                  onClick={() => onChange(axis.id, opt.id)}
                  title={opt.value}
                  className={cn(
                    "w-8 h-8 rounded-full border-2 transition-all",
                    isSelected ? "border-[#1A365D] scale-110 shadow-md" : "border-transparent hover:scale-105"
                  )}
                  style={{ background: opt.colorHex }}
                />
              ) : (
                // Text pill
                <button
                  key={opt.id}
                  onClick={() => onChange(axis.id, opt.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150",
                    isSelected
                      ? "bg-[#1A365D] text-white border-[#1A365D] dark:bg-[#3B82F6] dark:border-[#3B82F6]"
                      : "border-border text-foreground hover:border-[#1A365D] dark:hover:border-[#3B82F6] hover:text-[#1A365D] dark:hover:text-[#3B82F6]"
                  )}
                >
                  {opt.value}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Reviews Section ──────────────────────────────────────────────────────────
function ReviewsSection({ productId }: { productId: string }) {
  const [page, setPage] = useState(0);
  const { data: summary } = useProductReviewSummary(productId);
  const { data: reviews, isLoading } = useProductReviews(productId, page);

  if (!summary) return null;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="flex items-start gap-8">
        <div className="text-center">
          <p className="text-5xl font-bold text-foreground">{summary.averageRating.toFixed(1)}</p>
          <StarRating rating={summary.averageRating} size={16} />
          <p className="text-xs text-muted-foreground mt-1">{summary.totalReviews} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = summary.ratingDistribution[String(star)] ?? 0;
            const pct = summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-3">{star}</span>
                <Star className="w-3 h-3 text-[#FF9900] fill-[#FF9900]" />
                <div className="flex-1 h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-[#FF9900] rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  />
                </div>
                <span className="text-xs text-muted-foreground w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review list */}
      <div className="space-y-4">
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="skeleton h-4 w-32 rounded" />
              <div className="skeleton h-3 w-full rounded" />
              <div className="skeleton h-3 w-3/4 rounded" />
            </div>
          ))
          : reviews?.map((review: ReviewResponse) => (
            <div key={review.id} className="border-b border-border pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#1A365D] text-white text-xs font-bold flex items-center justify-center">
                    {review.customerId.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <StarRating rating={review.rating} size={12} />
                    {review.verifiedPurchase && (
                      <span className="text-[10px] text-[#16A34A] font-medium flex items-center gap-0.5">
                        <Check className="w-2.5 h-2.5" /> Verified purchase
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{formatDate(review.createdAt, "short")}</span>
              </div>
              {review.comment && <p className="text-sm text-foreground">{review.comment}</p>}
              {review.sellerReply && (
                <div className="mt-2 pl-3 border-l-2 border-[#1A365D]/20">
                  <p className="text-xs font-semibold text-[#1A365D] dark:text-[#3B82F6]">Seller reply</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{review.sellerReply}</p>
                </div>
              )}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── Main PDP ─────────────────────────────────────────────────────────────────
export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const addToCart = useAddToCart();
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  const openCart = useCartStore((s) => s.openCart);
  const [added, setAdded] = useState(false);
  const [qty, setQty] = useState(1);
  const [selectedVarIds, setVarIds] = useState<Record<string, string>>({});

  const { data: product, isLoading } = useQuery({
    queryKey: queryKeys.products.bySlug(slug),
    queryFn: () => productsApi.getBySlug(slug),
    staleTime: 60 * 1000,
    enabled: !!slug,
  });

  const handleVarChange = useCallback((axisId: string, valueId: string) => {
    setVarIds((prev) => ({ ...prev, [axisId]: valueId }));
  }, []);

  const handleAddToCart = async () => {
    if (!isAuth) {
      window.location.href = `/login?returnTo=/product/${slug}`;
      return;
    }
    addToCart.mutate(
      { productId: product!.id, quantity: qty },
      {
        onSuccess: () => {
          setAdded(true);
          openCart();
          setTimeout(() => setAdded(false), 1500);
        },
      }
    );
  };

  const discountPct = product && product.basePrice > product.effectivePrice
    ? Math.round(((product.basePrice - product.effectivePrice) / product.basePrice) * 100)
    : 0;

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="aspect-square skeleton rounded-2xl" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => <div key={i} className={`skeleton h-${i === 0 ? 8 : 4} rounded`} />)}
        </div>
      </div>
    );
  }

  if (!product) return notFound();

  return (
    <div className="container mx-auto py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href={`/category/${product.categoryId}`} className="hover:text-foreground">
          Category
        </Link>
        <span>/</span>
        <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">

        {/* Left: Image gallery */}
        <ImageGallery images={product.images} />

        {/* Right: Product info */}
        <div className="space-y-6">
          {/* Status badge */}
          {product.status !== "ACTIVE" && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
              {product.status.replace(/_/g, " ")}
            </span>
          )}

          {/* Title */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#1A365D] dark:text-white leading-tight">
              {product.name}
            </h1>
            {product.totalReviews > 0 && (
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={product.averageRating} size={14} />
                <span className="text-sm text-muted-foreground">
                  {product.averageRating.toFixed(1)} ({product.totalReviews} reviews)
                </span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-bold text-[#1A365D] dark:text-white tabular-nums">
              {formatCurrency(product.effectivePrice)}
            </span>
            {discountPct >= 5 && (
              <>
                <span className="text-lg text-neutral-400 line-through tabular-nums">
                  {formatCurrency(product.basePrice)}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-sm font-bold">
                  -{discountPct}%
                </span>
              </>
            )}
          </div>

          {/* Variations */}
          {product.variations.length > 0 && (
            <VariationSelector
              variations={product.variations}
              selectedValueIds={selectedVarIds}
              onChange={handleVarChange}
            />
          )}

          {/* Quantity + Add to Cart */}
          <div className="flex items-center gap-3">
            {/* Qty stepper */}
            <div className="flex items-center border border-border rounded-xl h-11 overflow-hidden">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="w-10 text-center text-sm font-semibold tabular-nums">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stockQuantity, q + 1))}
                className="w-10 h-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>

            {/* Add to Cart */}
            <motion.button
              onClick={handleAddToCart}
              disabled={addToCart.isPending || added || product.stockQuantity === 0}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex-1 h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-150",
                added
                  ? "bg-[#16A34A] text-white"
                  : product.stockQuantity === 0
                    ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed"
                    : "bg-[#FF9900] text-[#0F172A] hover:bg-[#E68A00] hover:shadow-md active:scale-[0.98]",
                "disabled:opacity-60"
              )}
            >
              {addToCart.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Adding…</>
              ) : added ? (
                <><Check className="w-4 h-4" />Added to Cart!</>
              ) : product.stockQuantity === 0 ? (
                "Out of Stock"
              ) : (
                <><ShoppingCart className="w-4 h-4" />Add to Cart</>
              )}
            </motion.button>

            {/* Wishlist */}
            <button className="w-11 h-11 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-red-500 hover:border-red-300 transition-colors">
              <Heart className="w-4 h-4" />
            </button>
          </div>

          {/* Stock indicator */}
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", product.stockQuantity > 0 ? "bg-[#16A34A]" : "bg-red-500")} />
            <span className={cn("text-sm font-medium", product.stockQuantity > 0 ? "text-[#16A34A]" : "text-red-500")}>
              {product.stockQuantity > 0
                ? `${product.stockQuantity} in stock`
                : "Out of stock"}
            </span>
            {product.totalSold > 0 && (
              <span className="text-xs text-muted-foreground">· {product.totalSold.toLocaleString()} sold</span>
            )}
          </div>

          {/* Delivery & returns */}
          <div className="rounded-xl border border-border p-4 space-y-3">
            {[
              { icon: Truck, text: "Free delivery on orders over 50,000 SYP" },
              { icon: Shield, text: "Secure payment — SSL protected checkout" },
              { icon: RotateCcw, text: "Easy returns within 14 days of delivery" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-muted-foreground">
                <Icon className="w-4 h-4 flex-shrink-0 text-[#1A365D] dark:text-[#3B82F6]" strokeWidth={1.8} />
                {text}
              </div>
            ))}
          </div>

          {/* Share */}
          <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-3.5 h-3.5" />
            Share this product
          </button>
        </div>
      </div>

      {/* Description & Reviews */}
      <div className="mt-14 grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Description */}
        <div className="lg:col-span-2 space-y-6">
          {product.description && (
            <div>
              <h2 className="text-lg font-bold text-foreground mb-3">Product Description</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
                {product.description.split("\n").map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div>
            <h2 className="text-lg font-bold text-foreground mb-4">Customer Reviews</h2>
            <ReviewsSection productId={product.id} />
          </div>
        </div>

        {/* Seller info card */}
        <div>
          <div className="rounded-xl border border-border p-5 sticky top-24">
            <h3 className="text-sm font-semibold text-foreground mb-3">Sold by</h3>
            <Link href={`/sellers/${product.sellerId}`}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-[#1A365D] text-white font-bold flex items-center justify-center">
                {product.sellerId.slice(0, 1).toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">View Seller Store</p>
                <p className="text-xs text-muted-foreground">All products from this seller →</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}