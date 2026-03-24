"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Truck, CheckCircle, Clock } from "lucide-react";
import { ordersApi } from "@/lib/api/orders";
import { trackingApi } from "@/lib/api/tracking";
import { queryKeys } from "@/lib/queryClient";
import { formatCurrency, formatDate, getOrderStatusConfig, shortId, cn } from "@/lib/utils";
import type { ScanEventType } from "@/types/api";

const SCAN_ICONS: Record<ScanEventType, React.ReactNode> = {
  INBOUND_WAREHOUSE:   <Package    className="w-3.5 h-3.5" />,
  OUTBOUND_WAREHOUSE:  <Truck      className="w-3.5 h-3.5" />,
  DRIVER_PICKUP:       <Truck      className="w-3.5 h-3.5" />,
  IN_TRANSIT:          <Truck      className="w-3.5 h-3.5" />,
  DELIVERED:           <CheckCircle className="w-3.5 h-3.5" />,
  PICKUP_POINT_DROP:   <MapPin     className="w-3.5 h-3.5" />,
  RETURN_INITIATED:    <ArrowLeft  className="w-3.5 h-3.5" />,
  RETURN_RECEIVED:     <CheckCircle className="w-3.5 h-3.5" />,
};

const SCAN_LABELS: Record<ScanEventType, string> = {
  INBOUND_WAREHOUSE:   "Arrived at warehouse",
  OUTBOUND_WAREHOUSE:  "Left warehouse",
  DRIVER_PICKUP:       "Picked up by driver",
  IN_TRANSIT:          "In transit",
  DELIVERED:           "Delivered",
  PICKUP_POINT_DROP:   "At pickup point",
  RETURN_INITIATED:    "Return initiated",
  RETURN_RECEIVED:     "Return received",
};

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();

  const { data: order, isLoading: orderLoading } = useQuery({
    queryKey: queryKeys.orders.byId(orderId),
    queryFn:  () => ordersApi.getById(orderId),
    enabled:  !!orderId,
  });

  const { data: tracking } = useQuery({
    queryKey: queryKeys.tracking.byOrderId(orderId),
    queryFn:  () => trackingApi.trackOrder(orderId),
    enabled:  !!orderId,
    staleTime: 30 * 1000,
  });

  if (orderLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-4">
        {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-16 rounded-xl" />)}
      </div>
    );
  }

  if (!order) return notFound();

  const statusConfig = getOrderStatusConfig(order.status);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/account/orders" className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-foreground">Order #{shortId(order.id)}</h1>
          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt, "long")}</p>
        </div>
        <span className={cn("ml-auto text-xs font-bold px-3 py-1 rounded-full uppercase", statusConfig.className)}>
          {statusConfig.label}
        </span>
      </div>

      {/* Tracking timeline */}
      {tracking && tracking.timeline.length > 0 && (
        <div className="rounded-2xl border border-border bg-white dark:bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
            <Truck className="w-4 h-4 text-[#1A365D] dark:text-[#3B82F6]" />
            Tracking Timeline
          </h2>
          <div className="space-y-4">
            {[...tracking.timeline].reverse().map((event, i) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <div className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                  i === 0
                    ? "bg-[#1A365D] text-white dark:bg-[#3B82F6]"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-500"
                )}>
                  {SCAN_ICONS[event.eventType]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-sm font-medium", i === 0 ? "text-foreground" : "text-muted-foreground")}>
                    {SCAN_LABELS[event.eventType] ?? event.eventType}
                  </p>
                  <p className="text-xs text-muted-foreground">{event.location}</p>
                  {event.notes && <p className="text-xs text-muted-foreground italic mt-0.5">{event.notes}</p>}
                </div>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {formatDate(event.scannedAt, "relative")}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Order items */}
      <div className="rounded-2xl border border-border bg-white dark:bg-card overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Items Ordered</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-5 py-4">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                {item.imageUrl
                  ? <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="56px" />
                  : <Package className="w-5 h-5 text-neutral-300 m-auto mt-4" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                {item.variationSnapshot && <p className="text-xs text-muted-foreground">{item.variationSnapshot}</p>}
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold text-foreground tabular-nums">{formatCurrency(item.lineTotal)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals + shipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Shipping address */}
        <div className="rounded-2xl border border-border bg-white dark:bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#1A365D] dark:text-[#3B82F6]" />Ship to
          </h2>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="text-foreground font-medium">{order.shippingFullName}</p>
            <p>{order.shippingAddressLine1}</p>
            {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
            <p>{order.shippingCity}, {order.shippingGovernorate}</p>
            <p>{order.shippingPhone}</p>
          </div>
        </div>

        {/* Price summary */}
        <div className="rounded-2xl border border-border bg-white dark:bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">Price Summary</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span className="tabular-nums">{formatCurrency(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-[#16A34A]">
                <span>Discount</span><span className="tabular-nums">−{formatCurrency(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between text-muted-foreground">
              <span>Shipping</span><span className="tabular-nums">{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-foreground border-t border-border pt-2">
              <span>Total</span><span className="tabular-nums text-[#1A365D] dark:text-white">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
