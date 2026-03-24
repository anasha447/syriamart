import { apiClient as api } from "@/lib/api/client";
import type { OrderTrackingResponse, PickupPointResponse } from "@/types/api";

export const trackingApi = {
  trackOrder: (orderId: string) =>
    api.get<OrderTrackingResponse>(`/api/tracking/${orderId}`, {
      skipAuth: true,
      cache: "no-store",
    }),

  getPickupPoints: (city?: string) =>
    api.get<PickupPointResponse[]>(
      city ? `/api/pickup-points?city=${encodeURIComponent(city)}` : "/api/pickup-points",
      { skipAuth: true, next: { revalidate: 300 } }
    ),
};
