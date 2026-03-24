"use client";

import React from "react";
import { motion } from "framer-motion";
import { Play, Square, Package, TrendingUp, Star, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useDriverDashboard } from "@/hooks/useDriverAuth";
import { useCurrentShift, useStartShift, useEndShift, useUpdateDriverStatus } from "@/hooks/useDriverOrders";
import { useDriverLocation } from "@/hooks/useDriverLocation";
import { useDriverStore }    from "@/lib/store/driver.store";
import { DeliveryCard }      from "@/components/driver/ShiftTimer";
import { ShiftTimer }        from "@/components/driver/ShiftTimer";
import { DriverCardSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatCurrency, cn } from "@/lib/utils";

export default function DriverDashboardPage() {
  // Activate background GPS pinging while on dashboard
  useDriverLocation();

  const driver              = useDriverStore((s) => s.driver);
  const isOnShift           = useDriverStore((s) => s.isOnShift());
  const { data: dashboard, isLoading } = useDriverDashboard();
  const { data: shift }     = useCurrentShift();
  const startShift          = useStartShift();
  const endShift            = useEndShift();
  const updateStatus        = useUpdateDriverStatus();

  const STATUS_CONFIG = {
    OFFLINE:     { label: "Offline",     dot: "bg-slate-500"  },
    AVAILABLE:   { label: "Available",   dot: "bg-green-500"  },
    ON_DELIVERY: { label: "On delivery", dot: "bg-[#FF9900]"  },
    ON_BREAK:    { label: "On break",    dot: "bg-yellow-500" },
    SUSPENDED:   { label: "Suspended",   dot: "bg-red-500"    },
  };

  const currentStatus = driver?.status ?? "OFFLINE";
  const statusConf    = STATUS_CONFIG[currentStatus] ?? STATUS_CONFIG.OFFLINE;

  return (
    <div className="px-4 py-6 space-y-6">

      {/* Header — greeting + status */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between"
      >
        <div>
          <p className="text-slate-400 text-sm">Good {getGreeting()},</p>
          <h1 className="text-xl font-semibold text-white mt-0.5">
            {driver?.firstName ?? "Driver"}
          </h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800 border border-slate-700">
          <span className={cn("w-2 h-2 rounded-full", statusConf.dot)} />
          <span className="text-xs font-medium text-slate-300">{statusConf.label}</span>
        </div>
      </motion.div>

      {/* Shift control card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
        className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
      >
        {isOnShift && shift ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Shift in progress</p>
                <ShiftTimer startedAt={shift.startedAt} className="text-lg" />
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-0.5">Earnings</p>
                <p className="text-base font-semibold text-[#FF9900]">
                  {formatCurrency(shift.shiftEarnings)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800">
              {[
                { label: "Delivered", value: shift.deliveriesCompleted },
                { label: "Failed",    value: shift.deliveriesFailed    },
                { label: "Returns",   value: shift.returnsHandled       },
              ].map(({ label, value }) => (
                <div key={label} className="text-center">
                  <p className="text-lg font-bold text-white">{value}</p>
                  <p className="text-[10px] text-slate-500">{label}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => endShift.mutate()}
              disabled={endShift.isPending}
              className="w-full h-11 rounded-xl border border-slate-700 text-sm font-semibold text-slate-300 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
            >
              <Square className="w-4 h-4" />
              End Shift
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-2">
            <p className="text-sm text-slate-400">You are not on shift</p>
            <button
              onClick={() => startShift.mutate()}
              disabled={startShift.isPending || currentStatus === "SUSPENDED"}
              className="w-full h-12 rounded-xl bg-[#FF9900] text-[#0F172A] font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-40 hover:bg-[#E68A00] active:scale-[0.98] transition-all"
            >
              <Play className="w-4 h-4 fill-[#0F172A]" />
              Start Shift
            </button>
          </div>
        )}
      </motion.div>

      {/* KPI row */}
      {isLoading ? (
        <div className="grid grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <DriverCardSkeleton key={i} />)}
        </div>
      ) : dashboard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-3"
        >
          {[
            { icon: Package,    label: "Today",        value: dashboard.deliveriesToday,    suffix: "deliveries" },
            { icon: TrendingUp, label: "Today earnings",value: formatCurrency(dashboard.earningsToday), suffix: "" },
            { icon: Package,    label: "This month",   value: dashboard.deliveriesThisMonth, suffix: "deliveries" },
            { icon: Star,       label: "Pending payout",value: formatCurrency(dashboard.pendingPayout), suffix: "" },
          ].map(({ icon: Icon, label, value, suffix }) => (
            <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-3.5">
              <Icon className="w-4 h-4 text-slate-500 mb-2" strokeWidth={1.5} />
              <p className="text-base font-bold text-white">{value}<span className="text-xs text-slate-500 ml-1">{suffix}</span></p>
              <p className="text-[10px] text-slate-500 mt-0.5">{label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* Active orders */}
      {dashboard && dashboard.activeOrders.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Active orders</h2>
            <Link href="/driver/orders" className="text-xs text-[#FF9900]">See all</Link>
          </div>
          <div className="space-y-3">
            {dashboard.activeOrders.slice(0, 3).map((order, i) => (
              <DeliveryCard key={order.orderId} order={order} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Messages badge link */}
      {dashboard && dashboard.unreadMessages > 0 && (
        <Link
          href="/driver/messages"
          className="flex items-center gap-3 p-4 rounded-2xl bg-[#1A365D]/30 border border-[#1A365D]/50"
        >
          <MessageSquare className="w-5 h-5 text-[#3B82F6]" />
          <div className="flex-1">
            <p className="text-sm font-medium text-white">New messages</p>
            <p className="text-xs text-slate-400">{dashboard.unreadMessages} unread from dispatcher</p>
          </div>
          <span className="w-5 h-5 rounded-full bg-[#FF9900] text-[#0F172A] text-[10px] font-bold flex items-center justify-center">
            {dashboard.unreadMessages > 9 ? "9+" : dashboard.unreadMessages}
          </span>
        </Link>
      )}
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
