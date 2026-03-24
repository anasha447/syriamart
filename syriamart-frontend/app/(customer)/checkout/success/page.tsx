"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryClient";
import { formatCurrency, shortId } from "@/lib/utils";

export default function OrderSuccessPage() {
  const params  = useSearchParams();
  const orderId = params.get("orderId") ?? "";

  const { data: order } = useQuery({
    queryKey: queryKeys.orders.byId(orderId),
    queryFn:  () => ordersApi.getById(orderId),
    enabled:  !!orderId,
    staleTime: 10 * 60 * 1000,
  });

  return (
    <div className="container mx-auto py-16 max-w-lg text-center">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-24 h-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-12 h-12 text-[#16A34A]" strokeWidth={1.5} />
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed!</h1>
        <p className="text-muted-foreground">
          Thank you for your order. We'll send you updates as it progresses.
        </p>

        {orderId && (
          <div className="mt-6 p-4 rounded-xl border border-border bg-neutral-50 dark:bg-neutral-800/60">
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Order number</p>
            <p className="font-mono font-bold text-xl text-foreground">#{shortId(orderId)}</p>
          </div>
        )}

        {order && (
          <div className="mt-4 p-4 rounded-xl border border-border text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total paid</span>
              <span className="font-semibold text-foreground">{formatCurrency(order.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Items</span>
              <span className="font-semibold text-foreground">{order.items.length}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping to</span>
              <span className="font-semibold text-foreground text-right max-w-[180px] truncate">
                {order.shippingCity}, {order.shippingGovernorate}
              </span>
            </div>
          </div>
        )}

        {/* What's next steps */}
        <div className="mt-8 grid grid-cols-2 gap-3">
          {[
            { icon: Package, label: "Seller packing",  desc: "Your order is being prepared"  },
            { icon: Truck,   label: "Out for delivery", desc: "Real-time QR scan tracking"    },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="p-3 rounded-xl border border-border text-left">
              <Icon className="w-5 h-5 text-[#1A365D] dark:text-[#3B82F6] mb-2" strokeWidth={1.5} />
              <p className="text-xs font-semibold text-foreground">{label}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {orderId && (
            <Link href={`/account/orders/${orderId}`}
              className="w-full h-11 rounded-xl bg-[#1A365D] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#1E3A5F] transition-colors"
            >
              View Order Details <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {orderId && (
            <Link href={`/tracking?orderId=${orderId}`}
              className="w-full h-11 rounded-xl border border-border text-sm font-medium text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors"
            >
              <Truck className="w-4 h-4" /> Track Package
            </Link>
          )}
          <Link href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Continue Shopping →
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
