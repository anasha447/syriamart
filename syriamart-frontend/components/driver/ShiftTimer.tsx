"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { Clock, Package, MapPin, Phone, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { AssignedOrderResponse } from "@/types/api";
import { getOrderStatusConfig, cn } from "@/lib/utils";

// ═══════════════════════════════════════════════════════════════════════════
// ShiftTimer — live elapsed time display
// ═══════════════════════════════════════════════════════════════════════════

interface ShiftTimerProps {
  startedAt: string;
  className?: string;
}

/**
 * Displays live-updating elapsed shift time in HH:MM:SS.
 * Ticks every second via setInterval.
 */
export function ShiftTimer({ startedAt, className }: ShiftTimerProps) {
  const [elapsed, setElapsed] = useState("00:00:00");

  useEffect(() => {
    function tick() {
      const start = new Date(startedAt).getTime();
      const now   = Date.now();
      const diff  = Math.max(0, Math.floor((now - start) / 1000));
      const h     = Math.floor(diff / 3600).toString().padStart(2, "0");
      const m     = Math.floor((diff % 3600) / 60).toString().padStart(2, "0");
      const s     = (diff % 60).toString().padStart(2, "0");
      setElapsed(`${h}:${m}:${s}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
      <span className="font-mono text-sm font-semibold text-white tabular-nums">{elapsed}</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// EarningsCounter — animated number reveal for shift summary
// ═══════════════════════════════════════════════════════════════════════════

interface EarningsCounterProps {
  amount:     number;
  currency?:  string;
  duration?:  number;
  className?: string;
}

/**
 * Animates from 0 to `amount` using Framer Motion's `useMotionValue`.
 * Used on the shift summary screen to create a satisfying reveal of earnings.
 */
export function EarningsCounter({
  amount,
  currency = "SYP",
  duration = 1.5,
  className,
}: EarningsCounterProps) {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    const controls = animate(motionVal, amount, {
      duration,
      ease: [0.16, 1, 0.3, 1], // Expo-out — starts fast, decelerates smoothly
      onUpdate: (v) => {
        setDisplay(
          new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(Math.round(v))
        );
      },
    });
    return controls.stop;
  }, [amount, duration, motionVal]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className={className}
    >
      <span className="tabular-nums">{display}</span>
      <span className="ml-1 text-sm opacity-60">{currency}</span>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// DeliveryCard — single active order card in the driver's queue
// ═══════════════════════════════════════════════════════════════════════════

interface DeliveryCardProps {
  order: AssignedOrderResponse;
  index: number;
}

/**
 * Compact card shown in the driver's active order list.
 * Tapping navigates to the full order detail + map view.
 * Links to /driver/orders/[orderId].
 */
export function DeliveryCard({ order, index }: DeliveryCardProps) {
  const statusConfig = getOrderStatusConfig(order.currentStatus);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 30 }}
    >
      <Link href={`/driver/orders/${order.orderId}`}>
        <div className={cn(
          "group p-4 rounded-2xl border border-slate-800 bg-slate-900/60",
          "hover:border-slate-600 hover:bg-slate-800/60",
          "active:scale-[0.98] transition-all duration-150",
          "cursor-pointer"
        )}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Order</p>
              <p className="text-sm font-mono font-semibold text-white">
                #{order.orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}
              </p>
            </div>
            <span className={cn(
              "text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide",
              statusConfig.className
            )}>
              {statusConfig.label}
            </span>
          </div>

          <div className="space-y-1.5">
            {/* Address */}
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-slate-300 line-clamp-2">
                {order.shippingAddressLine1
                  ? `${order.shippingAddressLine1}, ${order.city ?? ""}`
                  : order.lastScanLocation ?? "Address not available"}
              </p>
            </div>

            {/* Phone */}
            {order.customerPhone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <p className="text-xs text-slate-400">{order.customerPhone}</p>
              </div>
            )}
          </div>

          {/* Navigate arrow */}
          <div className="flex items-center justify-end mt-3">
            <span className="text-xs text-[#FF9900] font-medium group-hover:underline">
              View details
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-[#FF9900] ml-0.5" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
