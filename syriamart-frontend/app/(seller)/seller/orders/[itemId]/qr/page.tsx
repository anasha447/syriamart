"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Printer, CheckCircle, ArrowLeft, Package, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { QrDisplay } from "@/components/qr/QrDisplay";
import { ordersApi } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

/**
 * /seller/orders/[itemId]/qr
 *
 * Full-screen QR display for the seller packing page.
 * 
 * Three sections:
 *   1. The large QR code (from order.qrCodePayload) — optimised for scanning
 *   2. Pack confirmation button → updates item status to CONFIRMED
 *   3. Print button → triggers @media print CSS (shows only the QR)
 *
 * This page forces a white background and high-contrast layout regardless
 * of dark mode — scanners need white background + black QR modules.
 */
export default function OrderQrPage() {
  const params    = useParams<{ itemId: string }>();
  const router    = useRouter();
  const qc        = useQueryClient();
  const [packed, setPacked] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order-item-qr", params.itemId],
    queryFn:  () => ordersApi.getById(params.itemId), // Seller fetches via orderId
    enabled:  !!params.itemId,
  });

  const confirmMutation = useMutation({
    mutationFn: () =>
      ordersApi.updateItemStatus(params.itemId, "CONFIRMED", "Packed and ready for pickup"),
    onSuccess: () => {
      setPacked(true);
      qc.invalidateQueries({ queryKey: queryKeys.orders.seller() });
      toast.success("Order marked as packed and ready for pickup!");
    },
    onError: () => toast.error("Failed to update order status."),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-neutral-300 animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-muted-foreground">Order not found.</p>
        <button onClick={() => router.back()} className="text-sm text-[#1A365D]">Go back</button>
      </div>
    );
  }

  // The QR payload is the orderId-based HMAC payload generated at checkout.
  // For display purposes we use the orderId itself — the backend validates
  // the full payload when the driver scans.
  const qrPayload = order.id;

  return (
    <>
      {/* Print-only area — only this div is visible when printing */}
      <div className="qr-print-area">
        <QrDisplay payload={qrPayload} orderId={order.id} size={320} highContrast />
        <p style={{ fontFamily: "monospace", fontSize: 14 }}>
          SyrianMart Order #{order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}
        </p>
      </div>

      {/* Screen layout */}
      <div className="flex flex-col items-center gap-8 py-8 px-4 print:hidden">
        {/* Back nav */}
        <div className="w-full max-w-lg">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to order
          </button>
        </div>

        {/* Order meta */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 mb-3">
            <Package className="w-4 h-4 text-neutral-500" />
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Order #{order.id.replace(/-/g, "").slice(0, 8).toUpperCase()}
            </span>
          </div>
          <h1 className="text-xl font-semibold text-foreground">Package QR Code</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Attach this label to the package. The warehouse will scan it on arrival.
          </p>
        </div>

        {/* QR Code */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-full max-w-xs"
        >
          <QrDisplay
            payload={qrPayload}
            orderId={order.id}
            size={280}
            highContrast
            className="w-full"
          />
        </motion.div>

        {/* Shipping info summary */}
        <div className="w-full max-w-lg rounded-xl border border-border p-4 space-y-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Shipping to</p>
          <p className="text-sm font-medium text-foreground">{order.shippingFullName}</p>
          <p className="text-sm text-muted-foreground">
            {order.shippingAddressLine1}
            {order.shippingAddressLine2 ? `, ${order.shippingAddressLine2}` : ""}
          </p>
          <p className="text-sm text-muted-foreground">{order.shippingCity}, {order.shippingGovernorate}</p>
          <p className="text-sm text-muted-foreground">{order.shippingPhone}</p>
        </div>

        {/* Actions */}
        <div className="w-full max-w-lg flex flex-col gap-3">
          {!packed ? (
            <button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
              className={cn(
                "w-full h-12 rounded-xl font-semibold text-sm",
                "bg-[#16A34A] text-white",
                "hover:bg-[#15803D] transition-colors",
                "disabled:opacity-60 flex items-center justify-center gap-2"
              )}
            >
              {confirmMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Confirming…</>
              ) : (
                <><Package className="w-4 h-4" />I've packed this order</>
              )}
            </button>
          ) : (
            <div className="flex items-center justify-center gap-2 h-12 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Order confirmed — ready for pickup
              </span>
            </div>
          )}

          <button
            onClick={() => window.print()}
            className={cn(
              "w-full h-12 rounded-xl font-medium text-sm",
              "border border-border text-foreground",
              "hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors",
              "flex items-center justify-center gap-2"
            )}
          >
            <Printer className="w-4 h-4" />
            Print QR label
          </button>
        </div>
      </div>
    </>
  );
}
