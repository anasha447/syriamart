"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cartApi } from "@/lib/api/cart";
import { useCartStore } from "@/lib/store/cart.store";
import { useAuthStore } from "@/lib/store/auth.store";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";
import type { CartAddItemRequest } from "@/types/api";

function useCartQueryKey() {
  const userId = useAuthStore((s) => s.user?.userId ?? "anonymous");
  return queryKeys.cart.get(userId);
}

/**
 * Fetches the cart and syncs it to the Zustand store for instant UI reads.
 * Runs only when the user is authenticated.
 */
export function useCart() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { setCart }     = useCartStore();
  const key             = useCartQueryKey();

  return useQuery({
    queryKey: key,
    queryFn:  async () => {
      const data = await cartApi.get();
      // Sync server state → Zustand so CartButton badge updates instantly
      setCart(data.items, data.subtotal, data.discountAmount, data.estimatedTotal, data.appliedCouponCode);
      return data;
    },
    enabled:   isAuthenticated,
    staleTime: 30 * 1000, // 30s — cart can change from other tabs
  });
}

/**
 * Add-to-cart mutation with optimistic update.
 * The Zustand optimisticAdd runs immediately so the cart badge increments
 * before the network request resolves — zero perceived latency.
 */
export function useAddToCart() {
  const qc                = useQueryClient();
  const { optimisticAdd } = useCartStore();
  const key               = useCartQueryKey();

  return useMutation({
    mutationFn: (data: CartAddItemRequest) => cartApi.addItem(data),

    onMutate: async (data) => {
      // Cancel any in-flight refetches so they don't overwrite the optimistic state
      await qc.cancelQueries({ queryKey: key });
      // Optimistic update — product details are enriched by CartDrawer on render
      optimisticAdd({
        cartItemId:       `optimistic-${Date.now()}`,
        productId:        data.productId,
        productName:      "Adding…",
        variationValueId: data.variationValueId ?? null,
        variationSummary: null,
        imageUrl:         null,
        unitPrice:        0,
        quantity:         data.quantity,
        lineTotal:        0,
        inStock:          true,
      });
    },

    onSuccess: (data) => {
      // Server response overwrites the optimistic item with real data
      const { setCart } = useCartStore.getState();
      setCart(data.items, data.subtotal, data.discountAmount, data.estimatedTotal, data.appliedCouponCode);
      qc.setQueryData(key, data);
      toast.success("Added to cart");
    },

    onError: (error) => {
      // Roll back by invalidating — triggers a fresh fetch from server
      qc.invalidateQueries({ queryKey: key });
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Remove-from-cart mutation with optimistic update.
 */
export function useRemoveFromCart() {
  const qc                  = useQueryClient();
  const { optimisticRemove } = useCartStore();
  const key                  = useCartQueryKey();

  return useMutation({
    mutationFn: (cartItemId: string) => cartApi.removeItem(cartItemId),

    onMutate: (cartItemId) => {
      optimisticRemove(cartItemId);
    },

    onSuccess: (data) => {
      const { setCart } = useCartStore.getState();
      setCart(data.items, data.subtotal, data.discountAmount, data.estimatedTotal, data.appliedCouponCode);
      qc.setQueryData(key, data);
    },

    onError: () => {
      qc.invalidateQueries({ queryKey: key });
      toast.error("Failed to remove item. Please try again.");
    },
  });
}

/**
 * Apply coupon mutation.
 */
export function useApplyCoupon() {
  const qc  = useQueryClient();
  const key = useCartQueryKey();

  return useMutation({
    mutationFn: (code: string) => cartApi.applyCoupon(code),

    onSuccess: (data) => {
      const { setCart } = useCartStore.getState();
      setCart(data.items, data.subtotal, data.discountAmount, data.estimatedTotal, data.appliedCouponCode);
      qc.setQueryData(key, data);
      toast.success(`Coupon "${data.appliedCouponCode}" applied!`);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * Update item quantity mutation.
 */
export function useUpdateCartItem() {
  const qc = useQueryClient();
  const { optimisticUpdate } = useCartStore();
  const key = useCartQueryKey();

  return useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) =>
      cartApi.updateItem(cartItemId, quantity),

    onMutate: ({ cartItemId, quantity }) => {
      optimisticUpdate(cartItemId, quantity);
    },

    onSuccess: (data) => {
      const { setCart } = useCartStore.getState();
      setCart(data.items, data.subtotal, data.discountAmount, data.estimatedTotal, data.appliedCouponCode);
      qc.setQueryData(key, data);
    },

    onError: () => {
      qc.invalidateQueries({ queryKey: key });
      toast.error("Failed to update quantity.");
    },
  });
}
