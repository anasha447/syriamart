"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, QrCode, Package, MapPin, Phone, MessageSquare } from "lucide-react";
import { ordersApi } from "@/lib/api/orders";
import { useUpdateOrderItemStatus } from "@/hooks/useOrders";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency, formatDate, getOrderStatusConfig, shortId, cn } from "@/lib/utils";
import type { OrderItemStatus } from "@/types/api";

const NEXT_STATUS: Partial<Record<OrderItemStatus, { status: OrderItemStatus; label: string }>> = {
  PENDING:    { status: "CONFIRMED",  label: "Confirm Order"  },
  CONFIRMED:  { status: "PROCESSING", label: "Mark as Packing"},
  PROCESSING: { status: "SHIPPED",    label: "Mark as Shipped" },
};

export default function SellerOrderDetailPage() {
  const { itemId } = useParams<{ itemId: string }>();
  const router = useRouter();
  const updateStatus = useUpdateOrderItemStatus();

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", itemId],
    queryFn:  () => ordersApi.getById(itemId),
    staleTime: 30 * 1000,
    enabled:  !!itemId,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="skeleton h-8 w-48 rounded" />
        <div className="skeleton h-48 rounded-xl" />
        <div className="skeleton h-32 rounded-xl" />
      </div>
    );
  }

  if (!order) return (
    <div className="text-center py-16">
      <p className="text-muted-foreground">Order not found.</p>
      <button onClick={() => router.back()} className="text-sm text-[#1A365D] mt-2 hover:underline">Go back</button>
    </div>
  );

  // Find the relevant item (the one matching itemId)
  const sellerItem = order.items[0]; // In seller view, this is the order for their item
  const cfg        = getOrderStatusConfig(order.status);
  const nextAction = sellerItem ? NEXT_STATUS[sellerItem.status as OrderItemStatus] : undefined;

  return (
    <div className="space-y-6 page-enter max-w-3xl">
      <div className="flex items-center gap-3">
        <button onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />Back to Orders
        </button>
      </div>

      <PageHeader
        title={`Order #${shortId(order.id)}`}
        description={`Placed ${formatDate(order.createdAt, "long")}`}
        action={
          <span className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide", cfg.className)}>
            {cfg.label}
          </span>
        }
      />

      {/* Customer shipping */}
      <div className="bg-card border border-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#1A365D] dark:text-[#3B82F6]" />Shipping Address
        </h2>
        <p className="text-sm font-medium text-foreground">{order.shippingFullName}</p>
        <p className="text-sm text-muted-foreground mt-0.5">
          {order.shippingAddressLine1}
          {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ""}
        </p>
        <p className="text-sm text-muted-foreground">{order.shippingCity}, {order.shippingGovernorate}</p>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
          <Phone className="w-3.5 h-3.5" />{order.shippingPhone}
        </div>
        {order.notes && (
          <div className="mt-3 p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">Note:</span> {order.notes}
          </div>
        )}
      </div>

      {/* Order items */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Items ({order.items.length})</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => {
            const itemCfg = getOrderStatusConfig(item.status as any);
            return (
              <div key={item.id} className="flex items-start gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.productName}</p>
                  {item.variationSnapshot && (
                    <p className="text-xs text-muted-foreground mt-0.5">{item.variationSnapshot}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.quantity} × {formatCurrency(item.unitPrice)} = {formatCurrency(item.lineTotal)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase", itemCfg.className)}>
                    {itemCfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="px-5 py-3 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Order Total</span>
            <span className="font-bold text-foreground tabular-nums">{formatCurrency(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* QR label — for CONFIRMED orders ready to pack */}
        {sellerItem?.status === "CONFIRMED" && (
          <Link href={`/seller/orders/${itemId}/qr`}
            className="flex items-center gap-2 h-10 px-4 rounded-xl border-2 border-[#1A365D] text-[#1A365D] dark:text-[#3B82F6] dark:border-[#3B82F6] text-sm font-semibold hover:bg-[#EFF6FF] dark:hover:bg-[#172554] transition-colors"
          >
            <QrCode className="w-4 h-4" />Print QR Label
          </Link>
        )}

        {/* Advance status */}
        {nextAction && sellerItem && (
          <button
            onClick={() => updateStatus.mutate({ itemId: sellerItem.id, status: nextAction.status })}
            disabled={updateStatus.isPending}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1A365D] text-white text-sm font-semibold hover:bg-[#1E3A5F] disabled:opacity-60 transition-colors"
          >
            <Package className="w-4 h-4" />{nextAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
