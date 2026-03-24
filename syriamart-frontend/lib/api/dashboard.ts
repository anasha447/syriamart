/**
 * lib/api/dashboard.ts
 * Analytics for Seller and Admin portals.
 */
import { apiClient as api } from "@/lib/api/client";
import type {
  SellerDashboardResponse,
  SellerAnalyticsResponse,
  AdminDashboardResponse,
  PlatformAnalyticsResponse,
  RevenueBreakdownResponse,
  SellerListResponse,
} from "@/types/api";

export const dashboardApi = {
  // ── Seller (ROLE_SELLER) ──────────────────────────────────────────────────

  /** GET /api/dashboard/seller — summary KPIs */
  getSellerDashboard: () =>
    api.get<SellerDashboardResponse>("/api/dashboard/seller"),

  /** GET /api/dashboard/seller/analytics — full historic list */
  getSellerAnalyticsHistory: () =>
    api.get<SellerAnalyticsResponse[]>("/api/dashboard/seller/analytics"),

  /** GET /api/dashboard/seller/analytics/{year}/{month} */
  getSellerMonthlyAnalytics: (year: number, month: number) =>
    api.get<SellerAnalyticsResponse>(`/api/dashboard/seller/analytics/${year}/${month}`),

  // ── Admin (ROLE_ADMIN) ────────────────────────────────────────────────────

  /** GET /api/dashboard/admin — platform summary KPIs */
  getAdminDashboard: () =>
    api.get<AdminDashboardResponse>("/api/dashboard/admin"),

  /** GET /api/dashboard/admin/analytics/{year}/{month} */
  getPlatformMonthlyAnalytics: (year: number, month: number) =>
    api.get<PlatformAnalyticsResponse>(`/api/dashboard/admin/analytics/${year}/${month}`),

  /** GET /api/dashboard/admin/revenue?months= */
  getRevenueBreakdown: (months = 12) =>
    api.get<RevenueBreakdownResponse>(`/api/dashboard/admin/revenue?months=${months}`),

  /** GET /api/dashboard/admin/top-sellers?limit= */
  getTopSellers: (limit = 10) =>
    api.get<SellerListResponse[]>(`/api/dashboard/admin/top-sellers?limit=${limit}`),
};
