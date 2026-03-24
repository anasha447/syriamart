"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star, TrendingUp, Package, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { driverApi } from "@/lib/api/driver";
import { queryKeys } from "@/lib/queryClient";
import { cn } from "@/lib/utils";

export default function DriverPerformancePage() {
  const { data: profile } = useQuery({
    queryKey: queryKeys.driver.profile(),
    queryFn:  driverApi.getMyProfile,
  });

  // Mock performance data for now
  const STATS = [
    { icon: Star, label: "Rating", value: "4.8/5", color: "text-amber-400" },
    { icon: Package, label: "Success", value: "98.2%", color: "text-green-400" },
    { icon: Clock, label: "On Time", value: "94%", color: "text-blue-400" },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A] pb-10">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white">Performance</h1>
        <p className="text-xs text-slate-500 mt-0.5">How you're doing this month</p>
      </div>

      <div className="px-6 space-y-6">
        {/* KPI Grid */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center"
            >
              <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Weekly Chart Mockup */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-white px-1">Weekly Volume</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 h-48 flex items-end justify-around gap-2">
            {[4, 7, 5, 8, 9, 6, 4].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${h * 10}%` }}
                  className={cn(
                    "w-full max-w-[12px] rounded-full",
                    i === 4 ? "bg-[#FF9900]" : "bg-slate-700"
                  )}
                />
                <span className="text-[10px] text-slate-600 font-medium">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Achievements / Status */}
        <section className="space-y-3">
          <h3 className="text-sm font-bold text-white px-1">Fleet Standing</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl divide-y divide-slate-800">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">Elite Driver</p>
                  <p className="text-xs text-slate-500">Top 5% in Damascus area</p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-700" />
            </div>
            
            <div className="p-4">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Next Tier Bonus</span>
                <span className="text-white font-bold">12 / 20 deliveries</span>
              </div>
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "60%" }}
                  className="h-full bg-[#FF9900] rounded-full"
                />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
