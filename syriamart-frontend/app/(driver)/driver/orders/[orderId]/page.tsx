"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Phone, Package, Navigation, ScanLine, Loader2 } from "lucide-react";
import { driverApi } from "@/lib/api/driver";
import { trackingApi } from "@/lib/api/tracking";
import { queryKeys } from "@/lib/queryClient";
import { getOrderStatusConfig, formatDate, shortId, cn } from "@/lib/utils";
import type { ScanEventType } from "@/types/api";

// Leaflet is browser-only — dynamic import is required
const OrderMap = dynamic(
  () => import("@/components/driver/OrderMap").then((m) => m.OrderMap),
  { ssr: false, loading: () => <div className="w-full h-48 skeleton rounded-xl" /> }
);

const SCAN_STEP_LABELS: Partial<Record<ScanEventType, string>> = {
  INBOUND_WAREHOUSE:   "Warehouse received",
  OUTBOUND_WAREHOUSE:  "Dispatched from warehouse",
  DRIVER_PICKUP:       "Driver picked up",
  IN_TRANSIT:          "In transit",
  DELIVERED:           "Delivered",
  PICKUP_POINT_DROP:   "Left at pickup point",
  RETURN_INITIATED:    "Return initiated",
  RETURN_RECEIVED:     "Return received",
};

export default function DriverOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router      = useRouter();

  const { data: orders } = useQuery({
    queryKey: queryKeys.driver.orders(),
    queryFn:  driverApi.getMyActiveOrders,
    staleTime: 60 * 1000,
  });

  const { data: tracking, isLoading: trackingLoading } = useQuery({
    queryKey: queryKeys.tracking.byOrderId(orderId),
    queryFn:  () => trackingApi.trackOrder(orderId),
    staleTime: 30 * 1000,
    enabled:  !!orderId,
  });

  const order = orders?.find((o) => o.orderId === orderId);
  const cfg   = tracking ? getOrderStatusConfig(tracking.currentStatus) : null;

  const isDeliverable = tracking?.currentStatus === "SHIPPED"
    || tracking?.currentStatus === "PROCESSING";

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A]">
      {/* Header */}
      <div className="px-4 pt-5 pb-4">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">My Orders</span>
        </button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-white">Order #{shortId(orderId)}</h1>
            {cfg && (
              <span className={cn("text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mt-1 inline-block", cfg.className)}>
                {cfg.label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Map */}
      {order?.destinationLatitude && order?.destinationLongitude && (
        <div className="px-4 mb-4">
          <OrderMap
            lat={order.destinationLatitude}
            lng={order.destinationLongitude}
            label={order.city ?? "Delivery address"}
          />
        </div>
      )}

      {/* Delivery address */}
      {order && (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#FF9900] mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white">
                {order.shippingAddressLine1 ?? "Delivery address"}
              </p>
              {order.shippingAddressLine2 && (
                <p className="text-xs text-slate-400">{order.shippingAddressLine2}</p>
              )}
              <p className="text-xs text-slate-400">{order.city}, {order.governorate}</p>
            </div>
          </div>

          {order.customerPhone && (
            <a
              href={`tel:${order.customerPhone}`}
              className="flex items-center gap-2 mt-3 px-3 py-2 rounded-xl bg-slate-800 text-sm text-white hover:bg-slate-700 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#FF9900]" />
              Call Customer: {order.customerPhone}
            </a>
          )}

          {order.notes && (
            <p className="mt-2 text-xs text-slate-400 italic">Note: {order.notes}</p>
          )}
        </div>
      )}

      {/* Scan timeline */}
      {trackingLoading ? (
        <div className="px-4"><div className="skeleton h-40 rounded-2xl" /></div>
      ) : tracking?.timeline?.length ? (
        <div className="mx-4 mb-4 p-4 rounded-2xl bg-slate-900 border border-slate-800">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Scan History</h2>
          <div className="space-y-3">
            {[...tracking.timeline].reverse().map((scan, i) => (
              <div key={scan.id} className="flex items-start gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full mt-1.5 flex-shrink-0",
                  i === 0 ? "bg-[#FF9900]" : "bg-slate-600"
                )} />
                <div>
                  <p className="text-xs font-medium text-white">
                    {SCAN_STEP_LABELS[scan.eventType] ?? scan.eventType.replace(/_/g, " ")}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    {formatDate(scan.scannedAt, "long")} · {scan.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Action buttons */}
      <div className="px-4 mt-auto pb-4 space-y-3">
        <Link href="/driver/scan"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-slate-800 text-white font-medium text-sm border border-slate-700"
        >
          <ScanLine className="w-5 h-5 text-[#FF9900]" />
          Scan Package
        </Link>

        {isDeliverable && (
          <Link href={`/driver/orders/${orderId}/deliver`}
            className="flex items-center justify-center gap-2 w-full h-12 rounded-2xl bg-[#FF9900] text-[#0F172A] font-semibold text-sm active:scale-[0.98] transition-transform"
          >
            <Package className="w-5 h-5" />
            Confirm Delivery
          </Link>
        )}
      </div>
    </div>
  );
}
