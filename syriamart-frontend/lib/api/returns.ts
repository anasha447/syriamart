/**
 * lib/api/returns.ts
 * Return requests — CUSTOMER submits, ADMIN manages.
 */
import { apiClient as api } from "@/lib/api/client";
import type { ReturnResponse } from "@/types/api";

export const returnsApi = {
  // ── Customer (ROLE_CUSTOMER) ──────────────────────────────────────────────

  /** POST /api/returns */
  create: (data: { orderId: string; orderItemId?: string; reason: string; description?: string }) =>
    api.post<ReturnResponse>("/api/returns", { body: data }),

  /** GET /api/returns/my */
  getMyReturns: () =>
    api.get<ReturnResponse[]>("/api/returns/my"),

  // ── Admin (ROLE_ADMIN) ────────────────────────────────────────────────────

  /** GET /api/returns/admin */
  getAllReturns: () =>
    api.get<ReturnResponse[]>("/api/returns/admin"),

  /** PATCH /api/returns/admin/{returnId}/status */
  updateStatus: (returnId: string, status: string) =>
    api.patch<ReturnResponse>(`/api/returns/admin/${returnId}/status`, { body: { status } }),
};
