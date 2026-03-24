/**
 * lib/api/seller.ts
 * All endpoints require ROLE_SELLER JWT.
 */
import { apiClient as api } from "@/lib/api/client";
import type {
  SellerDetailResponse,
  SellerDashboardResponse,
  SellerAnalyticsResponse,
  ReviewResponse,
  CouponResponse,
  DiscountResponse,
  SellerProfileUpdateRequest,
} from "@/types/api";

export interface VendorUpgradeRequest {
  storeName:        string;
  storeDescription?: string;
  phone:            string;
}

export const sellerApi = {
  // ── Profile ──────────────────────────────────────────────────────────────

  /** GET /api/sellers/profile */
  getMyProfile: () =>
    api.get<SellerDetailResponse>("/api/sellers/profile"),

  /** PUT /api/sellers/profile */
  updateProfile: (data: SellerProfileUpdateRequest) =>
    api.put<SellerDetailResponse>("/api/sellers/profile", { body: data }),

  // ── Dashboard & Analytics ─────────────────────────────────────────────────

  /** GET /api/dashboard/seller */
  getDashboard: () =>
    api.get<SellerDashboardResponse>("/api/dashboard/seller"),

  /** GET /api/dashboard/seller/analytics */
  getAnalyticsHistory: () =>
    api.get<SellerAnalyticsResponse[]>("/api/dashboard/seller/analytics"),

  /** GET /api/dashboard/seller/analytics/{year}/{month} */
  getMonthlyAnalytics: (year: number, month: number) =>
    api.get<SellerAnalyticsResponse>(`/api/dashboard/seller/analytics/${year}/${month}`),

  // ── Reviews ───────────────────────────────────────────────────────────────

  /** POST /api/reviews/{reviewId}/reply?reply= */
  replyToReview: (reviewId: string, reply: string) =>
    api.post<ReviewResponse>(
      `/api/reviews/${reviewId}/reply?reply=${encodeURIComponent(reply)}`
    ),

  // ── Coupons ─── GET /api/coupons/my ──────────────────────────────────────

  /** GET /api/coupons/my */
  getMyCoupons: (page = 0, size = 20) =>
    api.get<CouponResponse[]>(`/api/coupons/my?page=${page}&size=${size}`),

  /** POST /api/coupons */
  createCoupon: (data: unknown) =>
    api.post<CouponResponse>("/api/coupons", { body: data }),

  /** PUT /api/coupons/{id} */
  updateCoupon: (id: string, data: unknown) =>
    api.put<CouponResponse>(`/api/coupons/${id}`, { body: data }),

  /** DELETE /api/coupons/{id} */
  deleteCoupon: (id: string) =>
    api.delete<void>(`/api/coupons/${id}`),

  // ── Discounts ─────────────────────────────────────────────────────────────

  /** POST /api/coupons/discounts */
  createDiscount: (data: unknown) =>
    api.post<DiscountResponse>("/api/coupons/discounts", { body: data }),

  // ── Role Upgrade (Customer → Seller) ─────────────────────────────────────

  /**
   * POST /api/sellers/register
   * Called by an already-authenticated CUSTOMER to request a vendor upgrade.
   * Uses the customer JWT — no new account is created.
   */
  applyAsVendor: (data: VendorUpgradeRequest) =>
    api.post<{ message: string }>("/api/sellers/register", { body: data }),
};
