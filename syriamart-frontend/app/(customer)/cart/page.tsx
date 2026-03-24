"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store/cart.store";
import { useRemoveFromCart, useUpdateCartItem, useApplyCoupon } from "@/hooks/useCart";
import { formatCurrency } from "@/lib/utils";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, Tag } from "lucide-react";

export default function CartPage() {
  const { items, subtotal, discountAmount, estimatedTotal, appliedCouponCode } = useCartStore();
  const removeItem = useRemoveFromCart();
  const updateItem = useUpdateCartItem();
  const applyCoupon = useApplyCoupon();
  const [couponCode, setCouponCode] = useState("");

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim()) {
      applyCoupon.mutate(couponCode.trim());
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto py-24 text-center max-w-lg page-enter">
        <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-neutral-400" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8">
          Looks like you haven&apos;t added anything to your cart yet. Discover our top products and start shopping!
        </p>
        <Link href="/" className="btn-cta inline-flex items-center justify-center h-12 px-8 rounded-full text-base">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="container mx-auto py-10 lg:py-14 page-enter">
      <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Cart Items */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-border">
              {items.map((item) => (
                <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row gap-6">
                  {/* Image */}
                  <Link href={`/product/${item.productId}`} className="w-24 h-24 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex-shrink-0 border border-border overflow-hidden relative">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingCart className="w-8 h-8 text-neutral-300" />
                      </div>
                    )}
                  </Link>

                  {/* Details */}
                  <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                    <div className="space-y-1 relative">
                      <Link href={`/product/${item.productId}`} className="text-lg font-bold text-foreground hover:text-[#1A365D] dark:hover:text-[#3B82F6] transition-colors line-clamp-2">
                        {item.productName}
                      </Link>
                      {item.variationSummary && (
                        <p className="text-sm text-muted-foreground">{item.variationSummary}</p>
                      )}
                      <p className="text-lg font-semibold text-[#1A365D] dark:text-[#3B82F6] pt-1">
                        {formatCurrency(item.unitPrice)}
                      </p>
                      {!item.inStock && (
                        <p className="text-sm text-red-500 font-medium">Out of stock</p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-4 h-full">
                      <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1 border border-border">
                        <button
                          onClick={() => updateItem.mutate({ cartItemId: item.cartItemId, quantity: Math.max(1, item.quantity - 1) })}
                          disabled={item.quantity <= 1 || updateItem.isPending}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateItem.mutate({ cartItemId: item.cartItemId, quantity: item.quantity + 1 })}
                          disabled={updateItem.isPending}
                          className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white dark:hover:bg-neutral-700 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem.mutate(item.cartItemId)}
                        disabled={removeItem.isPending}
                        className="text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm sticky top-24 space-y-6">
            <h2 className="text-xl font-bold text-foreground border-b border-border pb-4">Order Summary</h2>

            <div className="space-y-3 pb-4 border-b border-border text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span className="text-foreground font-medium">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                  <span>Discount {appliedCouponCode && `(${appliedCouponCode})`}</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>

            <div className="flex justify-between text-xl font-bold text-foreground">
              <span>Total</span>
              <span>{formatCurrency(estimatedTotal)}</span>
            </div>

            <Link
              href="/checkout"
              className="btn-cta w-full flex items-center justify-center gap-2 h-12 rounded-xl text-base"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Link>

            {/* Coupon Code Inline Form */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Tag className="w-4 h-4" /> Have a promo code?
              </p>
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-input bg-background text-sm focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] uppercase"
                />
                <button
                  type="submit"
                  disabled={!couponCode.trim() || applyCoupon.isPending}
                  className="h-10 px-4 rounded-lg bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-sm font-medium hover:bg-neutral-300 dark:hover:bg-neutral-700 disabled:opacity-50 transition-colors"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
