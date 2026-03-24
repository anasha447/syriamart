"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCartStore, useCartIsOpen, useCartItems } from "@/lib/store/cart.store";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

// ── Overlay ────────────────────────────────────────────────────────────────
function Overlay({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{   opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-overlay bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      aria-hidden="true"
    />
  );
}

// ── Cart Item Row ──────────────────────────────────────────────────────────
function CartItemRow({ item }: { item: ReturnType<typeof useCartItems>[number] }) {
  const { optimisticUpdate, optimisticRemove } = useCartStore();

  const handleQuantityChange = async (delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      optimisticRemove(item.cartItemId);
      // Fire-and-forget API call
      const { cartApi } = await import("@/lib/api/cart");
      await cartApi.removeItem(item.cartItemId).catch(() => {
        // TanStack Query will invalidate on next mount if this fails
      });
      return;
    }
    optimisticUpdate(item.cartItemId, newQty);
    const { cartApi } = await import("@/lib/api/cart");
    await cartApi.updateItem(item.cartItemId, newQty).catch(() => {});
  };

  const handleRemove = async () => {
    optimisticRemove(item.cartItemId);
    const { cartApi } = await import("@/lib/api/cart");
    await cartApi.removeItem(item.cartItemId).catch(() => {});
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0  }}
      exit={{   opacity: 0, x: 20  }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex gap-3 py-4 border-b border-border last:border-0"
    >
      {/* Product image */}
      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.productName}
            fill
            className="object-cover"
            sizes="64px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ShoppingCart className="w-5 h-5 text-neutral-300" />
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
          {item.productName}
        </p>
        {item.variationSummary && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">
            {item.variationSummary}
          </p>
        )}
        {!item.inStock && (
          <p className="text-xs text-red-500 mt-0.5 font-medium">Out of stock</p>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(-1)}
              className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                "border border-border text-neutral-600 dark:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              aria-label="Decrease quantity"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center text-sm font-semibold tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              className={cn(
                "w-7 h-7 rounded-md flex items-center justify-center transition-colors",
                "border border-border text-neutral-600 dark:text-neutral-300",
                "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              )}
              aria-label="Increase quantity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {/* Price + remove */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {formatCurrency(item.lineTotal)}
            </span>
            <button
              onClick={handleRemove}
              className="p-1 rounded text-neutral-300 hover:text-red-500 transition-colors"
              aria-label={`Remove ${item.productName}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Cart Drawer ────────────────────────────────────────────────────────────
function CartDrawer({ onClose }: { onClose: () => void }) {
  const items          = useCartItems();
  const { subtotal, discountAmount, estimatedTotal, appliedCouponCode } = useCartStore();

  // Trap focus + close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0        }}
      exit={{   x: "100%"    }}
      transition={{ type: "spring", stiffness: 320, damping: 35 }}
      className={cn(
        "fixed right-0 top-0 bottom-0 z-modal",
        "w-full sm:w-[420px]",
        "bg-white dark:bg-card",
        "flex flex-col shadow-xl"
      )}
      role="dialog"
      aria-label="Shopping cart"
      aria-modal="true"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-[#1A365D] dark:text-[#3B82F6]" strokeWidth={1.8} />
          <h2 className="text-base font-semibold text-foreground">
            Shopping Cart
          </h2>
          {items.length > 0 && (
            <span className="text-xs font-medium text-muted-foreground">
              ({items.length} {items.length === 1 ? "item" : "items"})
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className={cn(
            "p-1.5 rounded-lg transition-colors",
            "text-neutral-400 hover:text-foreground",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800"
          )}
          aria-label="Close cart"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Item list — scrollable */}
      <div className="flex-1 overflow-y-auto px-5">
        {items.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <ShoppingCart className="w-7 h-7 text-neutral-300" strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">Your cart is empty</p>
              <p className="text-xs text-muted-foreground mt-1">
                Add products to start shopping
              </p>
            </div>
            <Link
              href="/products"
              onClick={onClose}
              className={cn(
                "mt-2 px-5 py-2 rounded-full text-sm font-medium",
                "bg-[#1A365D] text-white",
                "hover:bg-[#1E3A5F] transition-colors"
              )}
            >
              Browse products
            </Link>
          </div>
        ) : (
          // Item list
          <AnimatePresence initial={false}>
            {items.map((item) => (
              <CartItemRow key={item.cartItemId} item={item} />
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer — summary + CTA */}
      {items.length > 0 && (
        <div className="flex-shrink-0 border-t border-border px-5 py-4 space-y-3">
          {/* Price breakdown */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="tabular-nums">{formatCurrency(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-[#16A34A] dark:text-green-400">
                <span>
                  Discount
                  {appliedCouponCode && (
                    <span className="ml-1 text-[10px] font-mono bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">
                      {appliedCouponCode}
                    </span>
                  )}
                </span>
                <span className="tabular-nums">−{formatCurrency(discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border">
              <span>Estimated Total</span>
              <span className="tabular-nums text-[#1A365D] dark:text-[#3B82F6]">
                {formatCurrency(estimatedTotal)}
              </span>
            </div>
          </div>

          {/* Checkout CTA — Amazon Amber */}
          <Link
            href="/checkout"
            onClick={onClose}
            className={cn(
              "flex items-center justify-center gap-2 w-full",
              "h-11 rounded-full text-sm font-semibold",
              "cta-amber transition-all duration-150",
              "hover:shadow-md active:scale-[0.98]"
            )}
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4" />
          </Link>

          {/* Continue shopping */}
          <button
            onClick={onClose}
            className="w-full text-xs text-center text-muted-foreground hover:text-foreground transition-colors py-1"
          >
            Continue shopping
          </button>
        </div>
      )}
    </motion.div>
  );
}

// ── Main Export: Wrapper ────────────────────────────────────────────────────
export function CartDrawerWrapper() {
  const isOpen   = useCartIsOpen();
  const closeCart = useCartStore((s) => s.closeCart);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay onClose={closeCart} />
          <CartDrawer onClose={closeCart} />
        </>
      )}
    </AnimatePresence>
  );
}
