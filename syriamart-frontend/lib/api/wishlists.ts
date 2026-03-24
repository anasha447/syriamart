/**
 * lib/api/wishlists.ts
 * All endpoints require ROLE_CUSTOMER JWT.
 */
import { apiClient as api } from "@/lib/api/client";
import type { WishlistResponse } from "@/types/api";

export const wishlistsApi = {
  /** GET /api/wishlists */
  getAll: () =>
    api.get<WishlistResponse[]>("/api/wishlists"),

  /** GET /api/wishlists/default */
  getDefault: () =>
    api.get<WishlistResponse>("/api/wishlists/default"),

  /** POST /api/wishlists */
  create: (name: string) =>
    api.post<WishlistResponse>("/api/wishlists", { body: { name } }),

  /** POST /api/wishlists/{wishlistId}/items */
  addItem: (wishlistId: string, productId: string) =>
    api.post<WishlistResponse>(`/api/wishlists/${wishlistId}/items`, {
      body: { productId },
    }),

  /** DELETE /api/wishlists/{wishlistId}/items/{productId} */
  removeItem: (wishlistId: string, productId: string) =>
    api.delete<WishlistResponse>(`/api/wishlists/${wishlistId}/items/${productId}`),

  /**
   * POST /api/wishlists/{wishlistId}/move-to-cart
   * Moves ALL items in the wishlist to the cart atomically (server-side).
   */
  moveToCart: (wishlistId: string) =>
    api.post<void>(`/api/wishlists/${wishlistId}/move-to-cart`),

  /** DELETE /api/wishlists/{wishlistId} */
  delete: (wishlistId: string) =>
    api.delete<void>(`/api/wishlists/${wishlistId}`),
};
