/**
 * lib/api/coupons.ts
 * Coupon validation is public. CRUD is role-gated.
 */
import { apiClient as api } from "@/lib/api/client";
import type { CouponResponse, DiscountResponse } from "@/types/api";

export const couponsApi = {
  // ── Public ────────────────────────────────────────────────────────────────

  /** GET /api/coupons/{code}/validate — used by cart UI to preview discount */
  validate: (code: string) =>
    api.get<CouponResponse>(`/api/coupons/${encodeURIComponent(code)}/validate`, {
      skipAuth: true,
      cache: "no-store",
    }),

  /** GET /api/coupons/product/{productId}/discounts */
  getProductDiscounts: (productId: string) =>
    api.get<DiscountResponse[]>(`/api/coupons/product/${productId}/discounts`, {
      skipAuth: true,
      next: { revalidate: 30, tags: [`discounts-${productId}`] },
    }),

  // ── Seller (ROLE_SELLER) ──────────────────────────────────────────────────

  /** GET /api/coupons/my */
  getMyCoupons: (page = 0, size = 20) =>
    api.get<CouponResponse[]>(`/api/coupons/my?page=${page}&size=${size}`),

  /** POST /api/coupons */
  create: (data: unknown) =>
    api.post<CouponResponse>("/api/coupons", { body: data }),

  /** PUT /api/coupons/{id} */
  update: (id: string, data: unknown) =>
    api.put<CouponResponse>(`/api/coupons/${id}`, { body: data }),

  /** DELETE /api/coupons/{id} */
  delete: (id: string) =>
    api.delete<void>(`/api/coupons/${id}`),

  /** POST /api/coupons/discounts */
  createDiscount: (data: unknown) =>
    api.post<DiscountResponse>("/api/coupons/discounts", { body: data }),

  // ── Admin (ROLE_ADMIN) ────────────────────────────────────────────────────

  /** POST /api/coupons/admin/platform */
  createPlatformCoupon: (data: unknown) =>
    api.post<CouponResponse>("/api/coupons/admin/platform", { body: data }),

  /** GET /api/coupons/admin/platform */
  getPlatformCoupons: (page = 0, size = 20) =>
    api.get<CouponResponse[]>(`/api/coupons/admin/platform?page=${page}&size=${size}`),

  /** POST /api/coupons/admin/discounts */
  createPlatformDiscount: (data: unknown) =>
    api.post<DiscountResponse>("/api/coupons/admin/discounts", { body: data }),
};
