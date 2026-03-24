/**
 * lib/api/orders.ts
 */
import { apiClient as api } from "@/lib/api/client";
import type {
  CheckoutSummaryResponse,
  OrderDetailResponse,
  OrderListResponse,
  OrderSellerViewResponse,
  OrderStatusEventResponse,
  CheckoutRequest,
} from "@/types/api";

export const ordersApi = {
  // ── Customer ──────────────────────────────────────────────────────────────

  /** POST /api/orders/checkout */
  checkout: (data: CheckoutRequest) =>
    api.post<CheckoutSummaryResponse>("/api/orders/checkout", { body: data }),

  /** GET /api/orders/my */
  getMyOrders: (page = 0, size = 10) =>
    api.get<OrderListResponse[]>(`/api/orders/my?page=${page}&size=${size}`),

  /** GET /api/orders/my/{orderId} */
  getById: (orderId: string) =>
    api.get<OrderDetailResponse>(`/api/orders/my/${orderId}`),

  /** POST /api/orders/my/{orderId}/cancel */
  cancel: (orderId: string) =>
    api.post<void>(`/api/orders/my/${orderId}/cancel`),

  // ── Seller ────────────────────────────────────────────────────────────────

  /** GET /api/orders/seller */
  getSellerOrders: (page = 0, size = 20) =>
    api.get<OrderSellerViewResponse[]>(`/api/orders/seller?page=${page}&size=${size}`),

  /** PATCH /api/orders/seller/items/{orderItemId}/status */
  updateItemStatus: (itemId: string, status: string) =>
    api.patch<OrderStatusEventResponse>(
      `/api/orders/seller/items/${itemId}/status`,
      { body: { status } }
    ),

  // ── Admin ─────────────────────────────────────────────────────────────────

  /** GET /api/orders/admin?status=&page=&size= */
  getAllOrders: (status?: string, page = 0, size = 20) =>
    api.get<OrderListResponse[]>(
      `/api/orders/admin?${status ? `status=${status}&` : ""}page=${page}&size=${size}`
    ),

  /** PATCH /api/orders/admin/{orderId}/status?status= */
  adminUpdateStatus: (orderId: string, status: string) =>
    api.patch<void>(`/api/orders/admin/${orderId}/status?status=${encodeURIComponent(status)}`),
};
