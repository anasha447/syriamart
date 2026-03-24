/**
 * lib/api/fulfillment.ts
 * Warehouse / fulfillment operations — ROLE_ADMIN only.
 */
import { apiClient as api } from "@/lib/api/client";
import type {
  InboundSummaryResponse,
  OutboundSummaryResponse,
  InventoryStatusResponse,
  WarehouseDashboardResponse,
} from "@/types/api";

export const fulfillmentApi = {
  /** POST /api/fulfillment/inbound */
  scanInbound: (data: { barcode: string; locationId?: string; notes?: string }) =>
    api.post<InboundSummaryResponse>("/api/fulfillment/inbound", { body: data }),

  /** POST /api/fulfillment/outbound */
  scanOutbound: (data: { barcode: string; driverId?: string; notes?: string }) =>
    api.post<OutboundSummaryResponse>("/api/fulfillment/outbound", { body: data }),

  /** GET /api/fulfillment/inventory/{orderId} */
  checkInventory: (orderId: string) =>
    api.get<InventoryStatusResponse>(`/api/fulfillment/inventory/${orderId}`),

  /** POST /api/fulfillment/inventory/bulk */
  checkBulkInventory: (orderIds: string[]) =>
    api.post<InventoryStatusResponse[]>("/api/fulfillment/inventory/bulk", {
      body: { orderIds },
    }),

  /** GET /api/fulfillment/dashboard */
  getDashboard: () =>
    api.get<WarehouseDashboardResponse>("/api/fulfillment/dashboard"),

  /** POST /api/fulfillment/assign?orderId=&driverId= */
  assignDriver: (orderId: string, driverId: string) =>
    api.post<void>(`/api/fulfillment/assign?orderId=${orderId}&driverId=${driverId}`),
};
