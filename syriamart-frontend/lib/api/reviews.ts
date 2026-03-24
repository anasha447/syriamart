/**
 * lib/api/reviews.ts
 * Public reads + CUSTOMER submissions + SELLER replies + ADMIN moderation.
 */
import { apiClient as api } from "@/lib/api/client";
import type { ReviewResponse, ReviewSummaryResponse } from "@/types/api";

export const reviewsApi = {
  // ── Public ────────────────────────────────────────────────────────────────

  /** GET /api/reviews/product/{productId}/summary */
  getSummary: (productId: string) =>
    api.get<ReviewSummaryResponse>(`/api/reviews/product/${productId}/summary`, {
      skipAuth: true,
      next: { revalidate: 60, tags: [`review-summary-${productId}`] },
    }),

  /** GET /api/reviews/product/{productId}?page=&size= */
  getProductReviews: (productId: string, page = 0, size = 10) =>
    api.get<ReviewResponse[]>(
      `/api/reviews/product/${productId}?page=${page}&size=${size}`,
      { skipAuth: true, cache: "no-store" }
    ),

  // ── Customer (ROLE_CUSTOMER) ──────────────────────────────────────────────

  /** POST /api/reviews/product/{productId} */
  submit: (productId: string, data: { rating: number; comment?: string }) =>
    api.post<ReviewResponse>(`/api/reviews/product/${productId}`, { body: data }),

  /** GET /api/reviews/my */
  getMyReviews: (page = 0, size = 10) =>
    api.get<ReviewResponse[]>(`/api/reviews/my?page=${page}&size=${size}`),

  // ── Seller (ROLE_SELLER) ──────────────────────────────────────────────────

  /** POST /api/reviews/{reviewId}/reply?reply= */
  reply: (reviewId: string, reply: string) =>
    api.post<ReviewResponse>(
      `/api/reviews/${reviewId}/reply?reply=${encodeURIComponent(reply)}`
    ),

  // ── Admin (ROLE_ADMIN) ────────────────────────────────────────────────────

  /** PATCH /api/reviews/admin/{reviewId}/approve */
  approve: (reviewId: string) =>
    api.patch<ReviewResponse>(`/api/reviews/admin/${reviewId}/approve`),

  /** DELETE /api/reviews/admin/{reviewId} */
  delete: (reviewId: string) =>
    api.delete<void>(`/api/reviews/admin/${reviewId}`),
};
