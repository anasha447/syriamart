/**
 * lib/api/sellers.ts
 * Public seller storefront API + admin seller management.
 * (Seller self-service profile operations are in lib/api/seller.ts)
 */
import { apiClient as api } from "@/lib/api/client";
import type { SellerDetailResponse, SellerApprovalRequest } from "@/types/api";

export const sellersApi = {
  // ── Public ────────────────────────────────────────────────────────────────

  /**
   * GET /api/sellers
   * Returns all active/approved sellers. Used for public vendor directory
   * and vendor storefronts at /vendors/[slug].
   */
  getActive: () =>
    api.get<SellerDetailResponse[]>("/api/sellers", {
      skipAuth: true,
      next: { revalidate: 300, tags: ["sellers"] },
    }),

  // ── Admin (ROLE_ADMIN) ────────────────────────────────────────────────────

  /** GET /api/sellers/all — includes unapproved + rejected */
  getAll: () =>
    api.get<SellerDetailResponse[]>("/api/sellers/all"),

  /** GET /api/sellers/pending */
  getPending: () =>
    api.get<SellerDetailResponse[]>("/api/sellers/pending"),

  /**
   * POST /api/sellers/{sellerId}/approve
   * SellerApprovalRequest: { approved, profitPercentage, rejectionReason? }
   * This is the ONLY way to set vendor commission/margin.
   */
  approve: (sellerId: string, data: SellerApprovalRequest) =>
    api.post<void>(`/api/sellers/${sellerId}/approve`, { body: data }),
};
