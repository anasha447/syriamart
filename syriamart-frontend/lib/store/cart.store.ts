"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface CartItem {
  cartItemId:       string;
  productId:        string;
  productName:      string;
  variationValueId: string | null;
  variationSummary: string | null;
  imageUrl:         string | null;
  unitPrice:        number;
  quantity:         number;
  lineTotal:        number;
  inStock:          boolean;
}

interface CartState {
  items:             CartItem[];
  subtotal:          number;
  discountAmount:    number;
  estimatedTotal:    number;
  appliedCouponCode: string | null;
  isOpen:            boolean;

  // Server sync
  setCart:       (items: CartItem[], subtotal: number, discount: number, total: number, coupon: string | null) => void;
  // Optimistic updates
  optimisticAdd:    (item: CartItem) => void;
  optimisticRemove: (cartItemId: string) => void;
  optimisticUpdate: (cartItemId: string, quantity: number) => void;
  // Drawer
  openCart:   () => void;
  closeCart:  () => void;
  toggleCart: () => void;
  // Misc
  clearCart:  () => void;
  // Computed
  totalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    immer((set, get) => ({
      items:             [],
      subtotal:          0,
      discountAmount:    0,
      estimatedTotal:    0,
      appliedCouponCode: null,
      isOpen:            false,

      setCart: (items, subtotal, discount, total, coupon) =>
        set((s) => {
          s.items             = items;
          s.subtotal          = subtotal;
          s.discountAmount    = discount;
          s.estimatedTotal    = total;
          s.appliedCouponCode = coupon;
        }),

      optimisticAdd: (item) =>
        set((s) => {
          const existing = s.items.find(
            (i) => i.productId === item.productId &&
                   i.variationValueId === item.variationValueId
          );
          if (existing) {
            existing.quantity  += item.quantity;
            existing.lineTotal  = existing.unitPrice * existing.quantity;
          } else {
            s.items.push(item);
          }
          s.subtotal       = s.items.reduce((sum, i) => sum + i.lineTotal, 0);
          s.estimatedTotal = s.subtotal - s.discountAmount;
        }),

      optimisticRemove: (cartItemId) =>
        set((s) => {
          s.items          = s.items.filter((i) => i.cartItemId !== cartItemId);
          s.subtotal       = s.items.reduce((sum, i) => sum + i.lineTotal, 0);
          s.estimatedTotal = s.subtotal - s.discountAmount;
        }),

      optimisticUpdate: (cartItemId, quantity) =>
        set((s) => {
          if (quantity === 0) {
            s.items = s.items.filter((i) => i.cartItemId !== cartItemId);
          } else {
            const item = s.items.find((i) => i.cartItemId === cartItemId);
            if (item) { item.quantity = quantity; item.lineTotal = item.unitPrice * quantity; }
          }
          s.subtotal       = s.items.reduce((sum, i) => sum + i.lineTotal, 0);
          s.estimatedTotal = s.subtotal - s.discountAmount;
        }),

      openCart:   () => set((s) => { s.isOpen = true;  }),
      closeCart:  () => set((s) => { s.isOpen = false; }),
      toggleCart: () => set((s) => { s.isOpen = !s.isOpen; }),

      clearCart: () =>
        set((s) => {
          s.items             = [];
          s.subtotal          = 0;
          s.discountAmount    = 0;
          s.estimatedTotal    = 0;
          s.appliedCouponCode = null;
          s.isOpen            = false;
        }),

      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    })),
    {
      name: "syriamart-cart",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? sessionStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        items:             state.items,
        appliedCouponCode: state.appliedCouponCode,
      }),
    }
  )
);

// ── Selector hooks ─────────────────────────────────────────────────────────
export const useCartItems      = () => useCartStore((s) => s.items);
export const useCartTotalItems = () => useCartStore((s) => s.totalItems());
export const useCartTotal      = () => useCartStore((s) => s.estimatedTotal);
export const useCartIsOpen     = () => useCartStore((s) => s.isOpen);
