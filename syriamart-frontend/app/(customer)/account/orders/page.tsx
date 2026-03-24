"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ChevronRight } from "lucide-react";
import { useMyOrders } from "@/hooks/useOrders";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderListSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatCurrency, formatDate, getOrderStatusConfig, shortId, cn } from "@/lib/utils";

const STATUS_TABS = [
  { value: undefined,          label: "All"           },
  { value: "PENDING",          label: "Pending"       },
  { value: "PROCESSING",       label: "Processing"    },
  { value: "SHIPPED",          label: "Shipped"       },
  { value: "DELIVERED",        label: "Delivered"     },
  { value: "CANCELLED",        label: "Cancelled"     },
] as const;

export default function OrdersPage() {
  const [page, setPage]     = useState(0);
  const [tab,  setTab]      = useState<string | undefined>(undefined);
  const { data, isLoading } = useMyOrders(page);

  const filtered = data?.filter((o) => !tab || o.status === tab) ?? [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-foreground">My Orders</h1>

      {/* Status tabs */}
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {STATUS_TABS.map(({ value, label }) => (
          <button
            key={String(value)}
            onClick={() => { setTab(value); setPage(0); }}
            className={cn(
              "flex-shrink-0 h-8 px-3 rounded-full text-xs font-semibold transition-all",
              tab === value
                ? "bg-[#1A365D] text-white dark:bg-[#3B82F6]"
                : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <OrderListSkeleton rows={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Package className="w-7 h-7" />}
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={
            <Link href="/" className="px-4 py-2 rounded-lg bg-[#FF9900] text-[#0F172A] font-semibold text-sm">
              Start Shopping
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => {
            const cfg = getOrderStatusConfig(order.status);
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link href={`/account/orders/${order.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-white dark:bg-card hover:border-[#1A365D]/30 hover:shadow-sm transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-neutral-400" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-foreground">Order #{shortId(order.id)}</p>
                      <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", cfg.className)}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""} · {formatDate(order.createdAt, "short")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-foreground tabular-nums">{formatCurrency(order.total)}</p>
                    <ChevronRight className="w-4 h-4 text-neutral-300 mt-1 ml-auto" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
