"use client";

import React from "react";
import { motion } from "framer-motion";
import { Wallet, TrendingUp, Calendar, ArrowRight, Download, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { driverApi } from "@/lib/api/driver";
import { queryKeys } from "@/lib/queryClient";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export default function DriverPayoutPage() {
  const { data: payout, isLoading } = useQuery({
    queryKey: queryKeys.driver.payout(),
    queryFn:  driverApi.getPayoutInfo,
  });

  // Mock history for now since we only have "pendingPayout" and "totalEarnings" in DTO
  const MOCK_HISTORY = [
    { id: "p1", date: "2024-03-15", amount: 45000, status: "PAID" },
    { id: "p2", date: "2024-03-01", amount: 38500, status: "PAID" },
    { id: "p3", date: "2024-02-15", amount: 42000, status: "PAID" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A]">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white">Earnings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Track your payouts and revenue history</p>
      </div>

      <div className="px-6 space-y-6 pb-10">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-3xl bg-gradient-to-br from-[#1A365D] to-[#0F172A] border border-[#3B82F6]/30 p-6 shadow-xl relative overflow-hidden"
        >
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#3B82F6]/10 rounded-full blur-3xl" />
          
          <p className="text-xs font-semibold text-[#3B82F6] uppercase tracking-widest mb-2">Pending Payout</p>
          <h2 className="text-4xl font-bold text-white mb-6">
            {isLoading ? "..." : formatCurrency(payout?.pendingPayout ?? 0)}
          </h2>

          <div className="flex items-center gap-6 pt-4 border-t border-white/10 text-slate-400">
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1">Total Earned</p>
              <p className="text-sm font-bold text-white">{formatCurrency(payout?.totalEarnings ?? 0)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider mb-1">Deliveries</p>
              <p className="text-sm font-bold text-white">{payout?.completedDeliveries ?? 0}</p>
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <button className="w-full h-14 rounded-2xl bg-[#FF9900] text-[#0F172A] font-bold text-sm shadow-lg shadow-[#FF9900]/20 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Download className="w-4 h-4" />
          Request Early Payout
        </button>

        {/* History Section */}
        <section className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Payout History</h3>
            <button className="text-xs text-[#3B82F6] font-semibold">View all</button>
          </div>

          <div className="space-y-3">
            {MOCK_HISTORY.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{formatCurrency(item.amount)}</p>
                  <p className="text-[10px] text-slate-500">{formatDate(item.date, "long")}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-500 mb-1">
                    {item.status}
                  </span>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    Details <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
