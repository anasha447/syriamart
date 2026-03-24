/**
 * lib/api/cart.ts
 */
import { apiClient as api } from "@/lib/api/client";
import type { CartResponse, CartAddItemRequest } from "@/types/api";

export const cartApi = {
  get: () =>
    api.get<CartResponse>("/api/cart"),

  addItem: (data: CartAddItemRequest) =>
    api.post<CartResponse>("/api/cart/items", { body: data }),

  updateItem: (itemId: string, quantity: number) =>
    api.put<CartResponse>(`/api/cart/items/${itemId}`, { body: { quantity } }),

  removeItem: (itemId: string) =>
    api.delete<CartResponse>(`/api/cart/items/${itemId}`),

  applyCoupon: (code: string) =>
    api.post<CartResponse>(`/api/cart/coupon?code=${encodeURIComponent(code)}`),

  removeCoupon: () =>
    api.delete<CartResponse>("/api/cart/coupon"),

  clear: () =>
    api.delete<void>("/api/cart"),
};
