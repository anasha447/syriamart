"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CheckCircle, Package, TrendingUp, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { driverApi }          from "@/lib/api/driver";
import { EarningsCounter }    from "@/components/driver/ShiftTimer";
import { queryKeys }           from "@/lib/queryClient";
import { useDriverStore }      from "@/lib/store/driver.store";
import { formatDate, cn }      from "@/lib/utils";

export default function ShiftSummaryPage() {
  const router   = useRouter();
  const driverId = useDriverStore((s) => s.driver?.driverId ?? "");

  // Fetch the most recently completed shift
  const { data: shiftList } = useQuery({
    queryKey: [...queryKeys.driver.shift(), "history"],
    queryFn:  async () => {
      // Fetch profile to get shift data; in future a dedicated endpoint
      const profile = await driverApi.getMyProfile();
      return profile;
    },
    enabled: !!driverId,
  });

  // For now use payout info as summary data
  const { data: payout } = useQuery({
    queryKey: queryKeys.driver.payout(),
    queryFn:  driverApi.getPayoutInfo,
    enabled:  !!driverId,
  });

  return (
    <div className="flex flex-col items-center px-6 py-10 min-h-full">
      {/* Success icon */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
        className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
      >
        <CheckCircle className="w-10 h-10 text-green-400" strokeWidth={1.8} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold text-white">Shift Complete!</h1>
        <p className="text-slate-400 text-sm mt-1">Great work today</p>
      </motion.div>

      {/* Earnings reveal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.35, type: "spring", stiffness: 250, damping: 25 }}
        className="w-full rounded-2xl bg-gradient-to-br from-[#FF9900]/20 to-[#E68A00]/10 border border-[#FF9900]/30 p-6 text-center mb-6"
      >
        <p className="text-xs text-[#FF9900] uppercase tracking-widest font-semibold mb-2">
          Shift earnings
        </p>
        {payout ? (
          <EarningsCounter
            amount={payout.pendingPayout}
            className="text-4xl font-bold text-white"
          />
        ) : (
          <p className="text-4xl font-bold text-white">—</p>
        )}
        <p className="text-xs text-slate-400 mt-2">Added to your pending payout</p>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="w-full grid grid-cols-2 gap-3 mb-8"
      >
        {[
          { icon: Package,   label: "Total deliveries",  value: payout?.completedDeliveries ?? 0 },
          { icon: TrendingUp,label: "Total earnings",    value: payout ? `${new Intl.NumberFormat().format(payout.totalEarnings)} SYP` : "—" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="rounded-xl bg-slate-900 border border-slate-800 p-4">
            <Icon className="w-4 h-4 text-slate-500 mb-2" />
            <p className="text-base font-bold text-white">{value}</p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </motion.div>

      {/* CTA buttons */}
      <div className="w-full space-y-3">
        <button
          onClick={() => router.replace("/driver/dashboard")}
          className="w-full h-12 rounded-2xl bg-[#FF9900] text-[#0F172A] font-semibold text-sm active:scale-[0.98] transition-transform"
        >
          Go to Dashboard
        </button>
        <button
          onClick={() => router.replace("/driver/payout")}
          className="w-full h-11 rounded-2xl border border-slate-700 text-slate-300 font-medium text-sm"
        >
          View Payout Details
        </button>
      </div>
    </div>
  );
}
