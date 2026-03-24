"use client";

import React, { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Package, MapPin, Truck, CheckCircle,
  Clock, RotateCcw, Loader2, QrCode,
} from "lucide-react";
import { trackingApi } from "@/lib/api/tracking";
import { queryKeys }   from "@/lib/queryClient";
import { formatDate, cn } from "@/lib/utils";
import type { ScanEventType } from "@/types/api";

const SCAN_EVENT_CONFIG: Record<ScanEventType, { icon: React.ElementType; label: string; color: string }> = {
  INBOUND_WAREHOUSE:  { icon: Package,    label: "Arrived at warehouse",    color: "text-blue-500"    },
  OUTBOUND_WAREHOUSE: { icon: Truck,      label: "Dispatched from warehouse",color: "text-purple-500"  },
  DRIVER_PICKUP:      { icon: Truck,      label: "Picked up by driver",      color: "text-[#FF9900]"   },
  IN_TRANSIT:         { icon: MapPin,     label: "In transit",               color: "text-[#FF9900]"   },
  DELIVERED:          { icon: CheckCircle,label: "Delivered",                color: "text-[#16A34A]"   },
  PICKUP_POINT_DROP:  { icon: Package,    label: "At pickup point",          color: "text-blue-500"    },
  RETURN_INITIATED:   { icon: RotateCcw,  label: "Return initiated",         color: "text-red-500"     },
  RETURN_RECEIVED:    { icon: RotateCcw,  label: "Return received",          color: "text-neutral-500" },
};

export default function TrackingPage() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const [input, setInput] = useState(searchParams.get("orderId") ?? "");
  const [orderId, setOrderId] = useState(searchParams.get("orderId") ?? "");

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.tracking.byOrderId(orderId),
    queryFn:  () => trackingApi.trackOrder(orderId),
    enabled:  !!orderId,
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000, // auto-refresh every minute for live tracking
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const id = input.trim();
    if (!id) return;
    setOrderId(id);
    router.replace(`/tracking?orderId=${encodeURIComponent(id)}`, { scroll: false });
  };

  const STATUS_MAP: Record<string, { label: string; color: string; bg: string }> = {
    PENDING:          { label: "Order Received",   color: "text-amber-700",  bg: "bg-amber-50 dark:bg-amber-900/20"  },
    CONFIRMED:        { label: "Confirmed",        color: "text-blue-700",   bg: "bg-blue-50 dark:bg-blue-900/20"    },
    PROCESSING:       { label: "Being Prepared",   color: "text-purple-700", bg: "bg-purple-50 dark:bg-purple-900/20"},
    SHIPPED:          { label: "Out for Delivery", color: "text-[#854F0B]",  bg: "bg-[#FFF7E6] dark:bg-amber-900/20" },
    DELIVERED:        { label: "Delivered",        color: "text-[#166534]",  bg: "bg-[#F0FDF4] dark:bg-green-900/20" },
    CANCELLED:        { label: "Cancelled",        color: "text-red-700",    bg: "bg-red-50 dark:bg-red-900/20"       },
    RETURN_REQUESTED: { label: "Return Requested", color: "text-neutral-600",bg: "bg-neutral-100 dark:bg-neutral-800" },
    RETURNED:         { label: "Returned",         color: "text-neutral-600",bg: "bg-neutral-100 dark:bg-neutral-800" },
    REFUNDED:         { label: "Refunded",         color: "text-neutral-600",bg: "bg-neutral-100 dark:bg-neutral-800" },
  };

  const statusConf = data ? (STATUS_MAP[data.currentStatus] ?? STATUS_MAP["PENDING"]!) : null;

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] dark:bg-[#172554] flex items-center justify-center mx-auto mb-4">
          <QrCode className="w-7 h-7 text-[#1A365D] dark:text-[#3B82F6]" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-bold text-[#1A365D] dark:text-white">Track Your Order</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Enter your order ID to see real-time delivery status.
        </p>
      </div>

      {/* Search form */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Order ID (e.g. 3f8a2b1c-...)"
            className={cn(
              "w-full h-12 pl-10 pr-4 rounded-xl border bg-background text-sm text-foreground",
              "placeholder:text-muted-foreground outline-none",
              "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
              "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
              "transition-all duration-150 border-input"
            )}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="h-12 px-5 rounded-xl bg-[#1A365D] text-white font-semibold text-sm hover:bg-[#1E3A5F] disabled:opacity-60 flex items-center gap-2 transition-colors"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Track"}
        </button>
      </form>

      {/* Result */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex justify-center py-12"
          >
            <Loader2 className="w-8 h-8 text-[#1A365D] dark:text-[#3B82F6] animate-spin" />
          </motion.div>
        )}

        {error && !isLoading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="text-center py-10"
          >
            <Package className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <p className="font-semibold text-foreground">Order not found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Please check your order ID and try again.
            </p>
          </motion.div>
        )}

        {data && !isLoading && (
          <motion.div
            key={data.orderId}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="space-y-5"
          >
            {/* Status card */}
            <div className={cn("rounded-2xl p-5 border border-transparent", statusConf?.bg)}>
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Current Status</p>
                  <p className={cn("text-xl font-bold", statusConf?.color)}>
                    {statusConf?.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Order ID</p>
                  <p className="font-mono text-sm font-bold text-foreground">
                    #{data.orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {data.assignedDriverName && (
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-current/10">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Driver: {data.assignedDriverName}</span>
                </div>
              )}
            </div>

            {/* Timeline */}
            {data.timeline.length > 0 && (
              <div className="bg-card border border-border rounded-2xl p-5">
                <h2 className="text-sm font-semibold text-foreground mb-5">Delivery Timeline</h2>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-border" />

                  <div className="space-y-5">
                    {[...data.timeline].reverse().map((event, i) => {
                      const conf = SCAN_EVENT_CONFIG[event.eventType as ScanEventType] ?? {
                        icon: Clock, label: event.eventType, color: "text-muted-foreground",
                      };
                      const Icon = conf.icon;
                      const isLatest = i === 0;

                      return (
                        <motion.div
                          key={event.id}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="flex items-start gap-4 relative pl-9"
                        >
                          {/* Icon dot */}
                          <div className={cn(
                            "absolute left-0 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                            isLatest
                              ? "bg-[#1A365D] dark:bg-[#3B82F6]"
                              : "bg-white dark:bg-card border-2 border-border"
                          )}>
                            <Icon className={cn("w-4 h-4", isLatest ? "text-white" : conf.color)} />
                          </div>

                          <div className="flex-1 min-w-0 pb-1">
                            <p className={cn(
                              "text-sm font-semibold",
                              isLatest ? "text-foreground" : "text-muted-foreground"
                            )}>
                              {conf.label}
                            </p>
                            {event.location && (
                              <div className="flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-xs text-muted-foreground truncate">{event.location}</span>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(event.scannedAt, "long")}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* No scans yet */}
            {data.timeline.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-8 text-center">
                <Clock className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm font-medium text-foreground">No scans yet</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Your order is being confirmed. Check back soon.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
