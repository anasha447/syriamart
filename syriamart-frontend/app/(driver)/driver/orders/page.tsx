"use client";

import React from "react";
import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { useDriverOrders } from "@/hooks/useDriverOrders";
import { DeliveryCard }     from "@/components/driver/ShiftTimer";
import { EmptyState }       from "@/components/shared/EmptyState";
import { DriverCardSkeleton } from "@/components/shared/LoadingSkeleton";

export default function DriverOrdersPage() {
  const { data: orders, isLoading, refetch } = useDriverOrders();

  return (
    <div className="px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-lg font-semibold text-white">My Orders</h1>
        <button
          onClick={() => refetch()}
          className="text-xs text-[#FF9900] font-medium"
        >
          Refresh
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => <DriverCardSkeleton key={i} />)}
        </div>
      ) : !orders || orders.length === 0 ? (
        <EmptyState
          icon={<Package className="w-7 h-7" />}
          title="No active orders"
          description="You will see assigned packages here when the warehouse dispatches them."
          className="py-20 text-slate-400"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {orders.map((order, i) => (
            <DeliveryCard key={order.orderId} order={order} index={i} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
