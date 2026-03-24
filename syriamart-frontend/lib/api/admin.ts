/**
 * lib/api/admin.ts
 * All endpoints require ROLE_ADMIN JWT, except where noted.
 */
import { apiClient as api } from "@/lib/api/client";
import type {
  AdminDashboardResponse,
  PlatformAnalyticsResponse,
  RevenueBreakdownResponse,
  SellerListResponse,
  SellerDetailResponse,
  ProductModerationQueueResponse,
  ProductDetailResponse,
  ReviewResponse,
  UserProfileResponse,
  CouponResponse,
  DiscountResponse,
  SellerApprovalRequest,
} from "@/types/api";

export const adminApi = {
  // ── Dashboard & Analytics ─────────────────────────────────────────────────

  /** GET /api/dashboard/admin */
  getDashboard: () =>
    api.get<AdminDashboardResponse>("/api/dashboard/admin"),

  /** GET /api/dashboard/admin/analytics/{year}/{month} */
  getPlatformAnalytics: (year: number, month: number) =>
    api.get<PlatformAnalyticsResponse>(`/api/dashboard/admin/analytics/${year}/${month}`),

  /** GET /api/dashboard/admin/revenue?months= */
  getRevenueBreakdown: (months = 12) =>
    api.get<RevenueBreakdownResponse>(`/api/dashboard/admin/revenue?months=${months}`),

  /** GET /api/dashboard/admin/top-sellers?limit= */
  getTopSellers: (limit = 10) =>
    api.get<SellerListResponse[]>(`/api/dashboard/admin/top-sellers?limit=${limit}`),

  // ── Product Moderation ────────────────────────────────────────────────────

  /** GET /api/products/admin/moderation-queue */
  getModerationQueue: () =>
    api.get<ProductModerationQueueResponse>("/api/products/admin/moderation-queue"),

  /** PATCH /api/products/admin/{id}/moderate */
  approveProduct: (productId: string) =>
    api.patch<ProductDetailResponse>(`/api/products/admin/${productId}/moderate`, {
      body: { status: "ACTIVE" },
    }),

  /** PATCH /api/products/admin/{id}/moderate */
  rejectProduct: (productId: string, rejectionReason: string) =>
    api.patch<ProductDetailResponse>(`/api/products/admin/${productId}/moderate`, {
      body: { status: "REJECTED", rejectionReason },
    }),

  // ── Review Moderation ─────────────────────────────────────────────────────

  /** PATCH /api/reviews/admin/{reviewId}/approve */
  approveReview: (reviewId: string) =>
    api.patch<ReviewResponse>(`/api/reviews/admin/${reviewId}/approve`),

  /** DELETE /api/reviews/admin/{reviewId} */
  deleteReview: (reviewId: string) =>
    api.delete<void>(`/api/reviews/admin/${reviewId}`),

  // ── User Management ───────────────────────────────────────────────────────

  /** GET /api/users */
  getUsers: () =>
    api.get<UserProfileResponse[]>("/api/users"),

  /** POST /api/users/{userId}/ban */
  banUser: (userId: string, reason: string) =>
    api.post<void>(`/api/users/${userId}/ban`, { body: { reason } }),

  // ── Seller Management ─────────────────────────────────────────────────────

  /** GET /api/sellers/all */
  getAllSellers: () =>
    api.get<SellerDetailResponse[]>("/api/sellers/all"),

  /** GET /api/sellers/pending */
  getPendingSellers: () =>
    api.get<SellerDetailResponse[]>("/api/sellers/pending"),

  /**
   * POST /api/sellers/{sellerId}/approve
   * profitPercentage is set here — this is how Vendor Margin is configured.
   */
  approveSeller: (sellerId: string, data: SellerApprovalRequest) =>
    api.post<void>(`/api/sellers/${sellerId}/approve`, { body: data }),

  // ── Platform Coupons ──────────────────────────────────────────────────────

  /** POST /api/coupons/admin/platform */
  createPlatformCoupon: (data: unknown) =>
    api.post<CouponResponse>("/api/coupons/admin/platform", { body: data }),

  /** GET /api/coupons/admin/platform */
  getPlatformCoupons: (page = 0, size = 20) =>
    api.get<CouponResponse[]>(`/api/coupons/admin/platform?page=${page}&size=${size}`),

  /** DELETE /api/coupons/{id} */
  deleteCoupon: (id: string) =>
    api.delete<void>(`/api/coupons/${id}`),

  /** POST /api/coupons/admin/discounts */
  createPlatformDiscount: (data: unknown) =>
    api.post<DiscountResponse>("/api/coupons/admin/discounts", { body: data }),

  // ── Driver Management (Logistics Service) ─────────────────────────────────

  /** GET /api/admin/drivers */
  getDrivers: () =>
    api.get("/api/admin/drivers"),

  /** POST /api/admin/drivers */
  registerDriver: (data: unknown) =>
    api.post("/api/admin/drivers", { body: data }),

  /** GET /api/admin/drivers/{id} */
  getDriver: (id: string) =>
    api.get(`/api/admin/drivers/${id}`),

  /** PUT /api/admin/drivers/{id} */
  updateDriver: (id: string, data: unknown) =>
    api.put(`/api/admin/drivers/${id}`, { body: data }),

  /** PATCH /api/admin/drivers/{id}/status */
  setDriverStatus: (id: string, status: string) =>
    api.patch(`/api/admin/drivers/${id}/status`, { body: { status } }),

  // ── Warehouse / Fulfillment ───────────────────────────────────────────────

  /** GET /api/fulfillment/dashboard */
  getWarehouseDashboard: () =>
    api.get("/api/fulfillment/dashboard"),

  /** POST /api/fulfillment/inbound */
  scanInbound: (data: unknown) =>
    api.post("/api/fulfillment/inbound", { body: data }),

  /** POST /api/fulfillment/outbound */
  scanOutbound: (data: unknown) =>
    api.post("/api/fulfillment/outbound", { body: data }),

  /** POST /api/fulfillment/assign?orderId=&driverId= */
  assignDriver: (orderId: string, driverId: string) =>
    api.post<void>(`/api/fulfillment/assign?orderId=${orderId}&driverId=${driverId}`),

  /** GET /api/fulfillment/inventory/{orderId} */
  checkInventory: (orderId: string) =>
    api.get(`/api/fulfillment/inventory/${orderId}`),

  // ── Category Management ───────────────────────────────────────────────────

  /** POST /api/categories */
  createCategory: (data: unknown) =>
    api.post("/api/categories", { body: data }),

  /** PUT /api/categories/{id} */
  updateCategory: (id: string, data: unknown) =>
    api.put(`/api/categories/${id}`, { body: data }),

  /** DELETE /api/categories/{id} */
  deleteCategory: (id: string) =>
    api.delete<void>(`/api/categories/${id}`),

  /** POST /api/categories/{categoryId}/sub-categories */
  createSubCategory: (categoryId: string, data: unknown) =>
    api.post(`/api/categories/${categoryId}/sub-categories`, { body: data }),

  /** PUT /api/categories/sub-categories/{subId} */
  updateSubCategory: (subId: string, data: unknown) =>
    api.put(`/api/categories/sub-categories/${subId}`, { body: data }),

  /** DELETE /api/categories/sub-categories/{subId} */
  deleteSubCategory: (subId: string) =>
    api.delete<void>(`/api/categories/sub-categories/${subId}`),
};
