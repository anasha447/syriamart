"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSellerOrders, useUpdateOrderItemStatus } from "@/hooks/useOrders";
import { PageHeader }    from "@/components/shared/PageHeader";
import { EmptyState }    from "@/components/shared/EmptyState";
import { OrderListSkeleton } from "@/components/shared/LoadingSkeleton";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import { ShoppingBag, ChevronRight, QrCode, Package, CheckCircle, Truck, X } from "lucide-react";
import type { OrderItemStatus } from "@/types/api";

const STATUS_CONFIG: Record<OrderItemStatus, { label: string; next?: OrderItemStatus; nextLabel?: string; color: string }> = {
  PENDING:          { label: "Pending",          next: "CONFIRMED",  nextLabel: "Confirm",  color: "badge-pending"    },
  CONFIRMED:        { label: "Confirmed",         next: "PROCESSING", nextLabel: "Pack",     color: "badge-confirmed"  },
  PROCESSING:       { label: "Processing",        next: "SHIPPED",    nextLabel: "Mark Shipped", color: "badge-processing" },
  SHIPPED:          { label: "Shipped",                                                       color: "badge-shipped"    },
  DELIVERED:        { label: "Delivered",                                                      color: "badge-delivered"  },
  CANCELLED:        { label: "Cancelled",                                                      color: "badge-cancelled"  },
  RETURN_REQUESTED: { label: "Return Requested",                                               color: "badge-returned"   },
  RETURNED:         { label: "Returned",                                                        color: "badge-returned"   },
};

export default function SellerOrdersPage() {
  const [page, setPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState<OrderItemStatus | "ALL">("ALL");
  const { data, isLoading, refetch } = useSellerOrders(page);
  const updateStatus = useUpdateOrderItemStatus();

  const FILTER_TABS: Array<OrderItemStatus | "ALL"> = ["ALL", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

  const filtered = data?.filter((order) =>
    filterStatus === "ALL" || order.items.some((i) => i.status === filterStatus)
  ) ?? [];

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title="Orders"
        description="Manage your incoming orders"
        action={
          <button onClick={() => refetch()}
            className="h-9 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
          >
            Refresh
          </button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {FILTER_TABS.map((status) => (
          <button key={status}
            onClick={() => setFilterStatus(status)}
            className={cn(
              "flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
              filterStatus === status
                ? "bg-[#1A365D] text-white dark:bg-[#3B82F6]"
                : "border border-border text-muted-foreground hover:text-foreground hover:border-[#1A365D]"
            )}
          >
            {status === "ALL" ? "All Orders" : STATUS_CONFIG[status]?.label ?? status}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {isLoading ? (
        <OrderListSkeleton rows={5} />
      ) : !filtered.length ? (
        <EmptyState
          icon={<ShoppingBag className="w-7 h-7" />}
          title="No orders"
          description={filterStatus === "ALL" ? "You haven't received any orders yet." : `No ${STATUS_CONFIG[filterStatus as OrderItemStatus]?.label ?? ""} orders.`}
          className="py-16"
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((order, i) => (
            <motion.div key={order.orderId}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-card border border-border rounded-2xl overflow-hidden"
            >
              {/* Order header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-mono font-semibold text-foreground">
                    #{order.orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}
                  </p>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(order.orderedAt, "relative")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {formatCurrency(order.sellerSubtotal)}
                  </span>
                  <Link href={`/seller/orders/${order.orderId}`}
                    className="text-xs text-[#1A365D] dark:text-[#3B82F6] hover:underline flex items-center gap-0.5"
                  >
                    Details <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>

              {/* Shipping info */}
              <div className="px-5 py-2.5 border-b border-border text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{order.shippingFullName}</span>
                {" · "}{order.shippingCity}, {order.shippingGovernorate}
                {" · "}{order.shippingPhone}
              </div>

              {/* Items */}
              <div className="divide-y divide-border">
                {order.items.map((item) => {
                  const cfg = STATUS_CONFIG[item.status];
                  return (
                    <div key={item.id} className="flex items-center gap-4 px-5 py-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{item.productName}</p>
                        {item.variationSnapshot && (
                          <p className="text-xs text-muted-foreground mt-0.5">{item.variationSnapshot}</p>
                        )}
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Qty: {item.quantity} · {formatCurrency(item.lineTotal)}
                        </p>
                      </div>

                      {/* Status badge + actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", cfg.color)}>
                          {cfg.label}
                        </span>

                        {/* QR button — shown when CONFIRMED (ready to pack) */}
                        {item.status === "CONFIRMED" && (
                          <Link href={`/seller/orders/${item.id}/qr`}
                            className="flex items-center gap-1 h-7 px-2.5 rounded-lg border border-[#1A365D]/30 text-[#1A365D] dark:text-[#3B82F6] text-[11px] font-semibold hover:bg-[#EFF6FF] dark:hover:bg-[#172554] transition-colors"
                          >
                            <QrCode className="w-3 h-3" />QR
                          </Link>
                        )}

                        {/* Advance status button */}
                        {cfg.next && (
                          <button
                            onClick={() => updateStatus.mutate({ itemId: item.id, status: cfg.next! })}
                            disabled={updateStatus.isPending}
                            className="h-7 px-2.5 rounded-lg bg-[#1A365D] text-white text-[11px] font-semibold hover:bg-[#1E3A5F] disabled:opacity-60 transition-colors flex items-center gap-1"
                          >
                            {item.status === "PENDING"    && <CheckCircle className="w-3 h-3" />}
                            {item.status === "CONFIRMED"  && <Package className="w-3 h-3" />}
                            {item.status === "PROCESSING" && <Truck className="w-3 h-3" />}
                            {cfg.nextLabel}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {(data?.length ?? 0) >= 20 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
            className="h-9 px-4 rounded-lg border border-border text-sm disabled:opacity-40 hover:bg-muted"
          >← Prev</button>
          <button onClick={() => setPage((p) => p + 1)}
            className="h-9 px-4 rounded-lg border border-border text-sm hover:bg-muted"
          >Next →</button>
        </div>
      )}
    </div>
  );
}
