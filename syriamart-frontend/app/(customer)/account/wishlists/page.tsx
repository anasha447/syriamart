"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Trash2, Package, Plus } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistsApi } from "@/lib/api/wishlists";
import { useAddToCart } from "@/hooks/useCart";
import { queryKeys } from "@/lib/queryClient";
import { formatCurrency, cn } from "@/lib/utils";
import type { WishlistResponse } from "@/types/api";
import { getErrorMessage } from "@/lib/api/client";

export default function WishlistsPage() {
  const qc = useQueryClient();
  const addToCart = useAddToCart();

  const { data: wishlists, isLoading } = useQuery({
    queryKey: queryKeys.wishlists.mine(),
    queryFn:  wishlistsApi.getMyWishlists,
    staleTime: 2 * 60 * 1000,
  });

  const removeItemMutation = useMutation({
    mutationFn: ({ wishlistId, itemId }: { wishlistId: string; itemId: string }) =>
      wishlistsApi.removeItem(wishlistId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlists.mine() });
      toast.success("Removed from wishlist.");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const moveToCartMutation = useMutation({
    mutationFn: ({ wishlistId, itemId, productId }: { wishlistId: string; itemId: string; productId: string }) =>
      wishlistsApi.moveToCart(wishlistId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlists.mine() });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Added to cart!");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const [activeWishlistId, setActiveWishlistId] = useState<string | null>(null);

  const activeWishlist = wishlists?.find((w) => w.id === activeWishlistId)
    ?? wishlists?.find((w) => w.defaultList)
    ?? wishlists?.[0];

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Wishlists</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Save products you love for later</p>
      </div>

      {!wishlists?.length ? (
        <div className="text-center py-16 rounded-2xl border border-dashed border-border">
          <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground mb-1">No wishlists yet</p>
          <p className="text-xs text-muted-foreground mb-4">Save products by clicking the heart icon on any product.</p>
          <Link href="/products"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1A365D] text-white text-xs font-semibold hover:bg-[#1E3A5F] transition-colors"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* Wishlist tabs */}
          {wishlists.length > 1 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
              {wishlists.map((w) => (
                <button key={w.id}
                  onClick={() => setActiveWishlistId(w.id)}
                  className={cn(
                    "flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                    activeWishlist?.id === w.id
                      ? "bg-[#1A365D] text-white dark:bg-[#3B82F6]"
                      : "border border-border text-muted-foreground hover:text-foreground hover:border-[#1A365D]"
                  )}
                >
                  {w.name} ({w.items.length})
                </button>
              ))}
            </div>
          )}

          {/* Items grid */}
          {activeWishlist && (
            <>
              {activeWishlist.items.length === 0 ? (
                <div className="text-center py-12 rounded-2xl border border-dashed border-border">
                  <Heart className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">This wishlist is empty</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <AnimatePresence mode="popLayout">
                    {activeWishlist.items.map((item, i) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: i * 0.04 }}
                        className="group relative rounded-2xl border border-border bg-white dark:bg-card overflow-hidden"
                      >
                        {/* Product image */}
                        <Link href={`/product/${item.product.slug}`}>
                          <div className="relative aspect-square bg-neutral-50 dark:bg-neutral-900">
                            {item.product.primaryImageUrl ? (
                              <Image
                                src={item.product.primaryImageUrl}
                                alt={item.product.name}
                                fill
                                sizes="(max-width: 640px) 50vw, 33vw"
                                className="object-cover transition-transform group-hover:scale-105"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-neutral-300" />
                              </div>
                            )}
                          </div>
                        </Link>

                        {/* Remove button */}
                        <button
                          onClick={() => removeItemMutation.mutate({ wishlistId: activeWishlist.id, itemId: item.id })}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 dark:bg-card/90 flex items-center justify-center text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Info */}
                        <div className="p-3">
                          <Link href={`/product/${item.product.slug}`}>
                            <p className="text-xs font-medium text-foreground line-clamp-2 hover:text-[#1A365D] transition-colors">
                              {item.product.name}
                            </p>
                          </Link>
                          <p className="text-sm font-bold text-[#1A365D] dark:text-white mt-1 tabular-nums">
                            {formatCurrency(item.product.effectivePrice)}
                          </p>

                          <button
                            onClick={() => moveToCartMutation.mutate({
                              wishlistId: activeWishlist.id,
                              itemId: item.id,
                              productId: item.product.id,
                            })}
                            className="mt-2 w-full h-7 rounded-lg bg-[#FF9900] text-[#0F172A] text-[11px] font-semibold flex items-center justify-center gap-1 hover:bg-[#E68A00] transition-colors"
                          >
                            <ShoppingCart className="w-3 h-3" />Move to Cart
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
