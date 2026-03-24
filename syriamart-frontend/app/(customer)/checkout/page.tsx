"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Loader2, Shield, MapPin, Package, ChevronRight, Tag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCheckout } from "@/hooks/useOrders";
import { useCart, useApplyCoupon } from "@/hooks/useCart";
import { useCartStore, useCartItems } from "@/lib/store/cart.store";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validation/checkout.schema";
import { formatCurrency, cn } from "@/lib/utils";

const SYRIA_GOVERNORATES = [
  "Damascus", "Aleppo", "Homs", "Hama", "Latakia", "Tartus",
  "Deir ez-Zor", "Raqqa", "Hasakah", "Daraa", "As-Suwayda", "Quneitra",
  "Idlib", "Countryside of Damascus", "Rif Dimashq",
];

// ── Order Summary Sidebar ─────────────────────────────────────────────────────
function OrderSummary() {
  const items           = useCartItems();
  const { subtotal, discountAmount, estimatedTotal, appliedCouponCode } = useCartStore();
  const applyCoupon     = useApplyCoupon();
  const [couponInput, setCouponInput] = useState("");

  const shippingFee = subtotal >= 50_000 ? 0 : 3_500;
  const total       = estimatedTotal + shippingFee;

  return (
    <div className="lg:col-span-1 space-y-5">
      <div className="rounded-2xl border border-border bg-white dark:bg-card p-5">
        <h2 className="text-base font-semibold text-foreground mb-4">Order Summary</h2>

        {/* Item list */}
        <div className="space-y-3 mb-5">
          {items.map((item) => (
            <div key={item.cartItemId} className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 flex-shrink-0">
                {item.imageUrl
                  ? <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="48px" />
                  : <Package className="w-5 h-5 text-neutral-300 m-auto mt-3.5" />
                }
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#1A365D] text-white text-[9px] font-bold flex items-center justify-center">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{item.productName}</p>
                {item.variationSummary && (
                  <p className="text-[10px] text-muted-foreground">{item.variationSummary}</p>
                )}
              </div>
              <span className="text-xs font-semibold text-foreground tabular-nums flex-shrink-0">
                {formatCurrency(item.lineTotal)}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon */}
        {!appliedCouponCode ? (
          <div className="flex gap-2 mb-5">
            <div className="relative flex-1">
              <Tag className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400" />
              <input
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="w-full h-9 pl-8 pr-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-[#1A365D] focus:ring-2 focus:ring-[#1A365D]/15 transition-all"
              />
            </div>
            <button
              onClick={() => couponInput && applyCoupon.mutate(couponInput)}
              disabled={!couponInput || applyCoupon.isPending}
              className="h-9 px-3 rounded-lg bg-[#1A365D] text-white text-xs font-semibold disabled:opacity-40 hover:bg-[#1E3A5F] transition-colors"
            >
              {applyCoupon.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Apply"}
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
            <Tag className="w-3.5 h-3.5 text-green-600" />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400 flex-1">{appliedCouponCode}</span>
            <button onClick={() => useCartStore.getState().setCart(useCartStore.getState().items, useCartStore.getState().subtotal, 0, useCartStore.getState().subtotal, null)}>
              <X className="w-3.5 h-3.5 text-green-600" />
            </button>
          </div>
        )}

        {/* Totals */}
        <div className="space-y-2 text-sm border-t border-border pt-4">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-[#16A34A] dark:text-green-400">
              <span>Discount</span>
              <span className="tabular-nums">−{formatCurrency(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between text-muted-foreground">
            <span>Shipping</span>
            <span className="tabular-nums">
              {shippingFee === 0 ? (
                <span className="text-[#16A34A] font-semibold">Free</span>
              ) : formatCurrency(shippingFee)}
            </span>
          </div>
          {shippingFee > 0 && (
            <p className="text-[10px] text-muted-foreground">
              Add {formatCurrency(50_000 - subtotal)} more for free shipping
            </p>
          )}
          <div className="flex justify-between font-bold text-foreground text-base pt-2 border-t border-border">
            <span>Total</span>
            <span className="tabular-nums text-[#1A365D] dark:text-white">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Security badge */}
      <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60">
        <Shield className="w-4 h-4 text-[#16A34A] flex-shrink-0" />
        <p className="text-xs text-muted-foreground">
          Secure checkout. Your information is encrypted and never shared.
        </p>
      </div>
    </div>
  );
}

// ── Main Checkout ─────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const checkout = useCheckout();
  const items    = useCartItems();
  const { subtotal } = useCartStore();
  const shippingFee = subtotal >= 50_000 ? 0 : 3_500;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormData>({ resolver: zodResolver(checkoutSchema) });

  if (!items.length) {
    return (
      <div className="container mx-auto py-16 text-center">
        <Package className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-foreground mb-2">Your cart is empty</h2>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Link href="/" className="px-5 py-2.5 rounded-full bg-[#FF9900] text-[#0F172A] font-semibold text-sm">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const onSubmit = (data: CheckoutFormData) => {
    checkout.mutate(data);
  };

  const fieldClass = (hasError: boolean) => cn(
    "w-full h-11 px-3 rounded-xl border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
    "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
    hasError ? "border-red-400 dark:border-red-500" : "border-input"
  );

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-foreground">Cart</Link>
        <span>/</span>
        <span className="text-foreground font-medium">Checkout</span>
      </nav>

      {/* Progress steps */}
      <div className="flex items-center gap-3 mb-8">
        {[
          { label: "Cart",          done: true,  active: false },
          { label: "Shipping",      done: false, active: true  },
          { label: "Confirmation",  done: false, active: false },
        ].map(({ label, done, active }, i) => (
          <React.Fragment key={label}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center",
                done   && "bg-[#16A34A] text-white",
                active && "bg-[#1A365D] text-white",
                !done && !active && "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
              )}>
                {done ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-xs font-medium",
                active ? "text-foreground" : "text-muted-foreground"
              )}>
                {label}
              </span>
            </div>
            {i < 2 && <ChevronRight className="w-3 h-3 text-neutral-300" />}
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Shipping form ── */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-2xl border border-border bg-white dark:bg-card p-6">
              <h2 className="text-base font-semibold text-foreground mb-5 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#1A365D] dark:text-[#3B82F6]" />
                Shipping Address
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full name */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                  <input {...register("shippingFullName")} placeholder="Mohammed Al-Ahmad"
                    className={fieldClass(!!errors.shippingFullName)}
                  />
                  {errors.shippingFullName && <p className="text-xs text-red-500 mt-1">{errors.shippingFullName.message}</p>}
                </div>

                {/* Phone */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
                  <input {...register("shippingPhone")} type="tel" placeholder="+963 912 345 678"
                    className={fieldClass(!!errors.shippingPhone)}
                  />
                  {errors.shippingPhone && <p className="text-xs text-red-500 mt-1">{errors.shippingPhone.message}</p>}
                </div>

                {/* Address line 1 */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">Address *</label>
                  <input {...register("shippingAddressLine1")} placeholder="Street address, house number"
                    className={fieldClass(!!errors.shippingAddressLine1)}
                  />
                  {errors.shippingAddressLine1 && <p className="text-xs text-red-500 mt-1">{errors.shippingAddressLine1.message}</p>}
                </div>

                {/* Address line 2 */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Apartment / Building <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <input {...register("shippingAddressLine2")} placeholder="Apartment, suite, building"
                    className={fieldClass(false)}
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">City *</label>
                  <input {...register("shippingCity")} placeholder="City"
                    className={fieldClass(!!errors.shippingCity)}
                  />
                  {errors.shippingCity && <p className="text-xs text-red-500 mt-1">{errors.shippingCity.message}</p>}
                </div>

                {/* Governorate */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Governorate *</label>
                  <div className="relative">
                    <select {...register("shippingGovernorate")}
                      className={cn(fieldClass(!!errors.shippingGovernorate), "appearance-none cursor-pointer pr-8")}
                    >
                      <option value="">Select governorate</option>
                      {SYRIA_GOVERNORATES.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 rotate-90 pointer-events-none" />
                  </div>
                  {errors.shippingGovernorate && <p className="text-xs text-red-500 mt-1">{errors.shippingGovernorate.message}</p>}
                </div>

                {/* Notes */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Delivery Notes <span className="text-muted-foreground">(optional)</span>
                  </label>
                  <textarea {...register("notes")} rows={2} placeholder="Any special delivery instructions…"
                    className={cn(fieldClass(false), "h-auto resize-none py-2.5")}
                  />
                </div>
              </div>
            </div>

            {/* Payment note */}
            <div className="rounded-xl border border-border p-4 bg-[#FFF7E6] dark:bg-amber-900/10">
              <p className="text-sm font-semibold text-[#854F0B] dark:text-amber-300 mb-1">
                Payment on Delivery
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Pay with cash when your order arrives. No card required.
              </p>
            </div>

            {/* Place order button */}
            <motion.button
              type="submit"
              disabled={checkout.isPending}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "w-full h-13 py-3.5 rounded-2xl font-bold text-sm",
                "bg-[#FF9900] text-[#0F172A]",
                "hover:bg-[#E68A00] hover:shadow-lg",
                "transition-all duration-150 active:scale-[0.98]",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {checkout.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Placing Order…</>
              ) : (
                <>Place Order — {formatCurrency((useCartStore.getState().estimatedTotal ?? 0) + shippingFee)}</>
              )}
            </motion.button>
          </div>

          {/* Order summary sidebar */}
          <OrderSummary />
        </div>
      </form>
    </div>
  );
}
