"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Truck, Shield, LogOut, ChevronRight, Bell, Settings } from "lucide-react";
import { useDriverStore } from "@/lib/store/driver.store";
import { useDriverLogout, useDriverProfile } from "@/hooks/useDriverAuth";
import { useUpdateDriverStatus } from "@/hooks/useDriverOrders";
import { cn } from "@/lib/utils";

/**
 * /driver/profile — Driver profile & settings.
 * Forced dark, mobile-first design.
 */
export default function DriverProfilePage() {
  const driver = useDriverStore((s) => s.driver);
  const { data: profile } = useDriverProfile();
  const logout = useDriverLogout();
  const updateStatus = useUpdateDriverStatus();

  const STATUS_OPTIONS = [
    { value: "AVAILABLE",   label: "Available",   color: "bg-green-500" },
    { value: "ON_BREAK",    label: "On Break",    color: "bg-yellow-500" },
    { value: "OFFLINE",     label: "Offline",     color: "bg-slate-500" },
  ] as const;

  const currentStatus = driver?.status ?? "OFFLINE";

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A]">
      {/* Header Profile Section */}
      <div className="px-6 pt-10 pb-8 text-center bg-gradient-to-b from-slate-800/40 to-transparent">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-slate-700 flex items-center justify-center overflow-hidden shadow-xl">
            {driver?.firstName ? (
              <span className="text-3xl font-bold text-[#FF9900]">
                {driver.firstName[0]}
                {driver.lastName?.[0]}
              </span>
            ) : (
              <User className="w-10 h-10 text-slate-500" />
            )}
          </div>
          <div className={cn(
            "absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-[#0F172A]",
            STATUS_OPTIONS.find(s => s.value === currentStatus)?.color ?? "bg-slate-500"
          )} />
        </div>
        <h1 className="text-xl font-bold text-white">
          {driver?.firstName} {driver?.lastName}
        </h1>
        <p className="text-sm text-slate-400 mt-1">ID: {driver?.driverId?.slice(0, 8)}</p>
      </div>

      <div className="px-6 space-y-8 pb-10">
        {/* Status Quick Toggle */}
        <section>
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Your Status</h2>
          <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => updateStatus.mutate(opt.value)}
                disabled={updateStatus.isPending || (opt.value === "AVAILABLE" && driver?.status === "SUSPENDED")}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-semibold transition-all duration-200",
                  currentStatus === opt.value
                    ? "bg-[#FF9900] text-[#0F172A] shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Vehicle & Info */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Vehicle Details</h2>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
            <InfoRow icon={Truck} label="Vehicle" value={profile?.vehicleType ?? "Not assigned"} />
            <InfoRow icon={Shield} label="License Plate" value={profile?.vehiclePlate ?? "N/A"} />
          </div>
        </section>

        {/* Menu Links */}
        <section className="space-y-3">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-widest px-1">Settings</h2>
          <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden divide-y divide-slate-800">
            <MenuButton icon={Bell} label="Notifications" />
            <MenuButton icon={Settings} label="App Settings" />
          </div>
        </section>

        {/* Logout */}
        <button
          onClick={() => logout.mutate()}
          className="w-full h-14 rounded-2xl border border-red-500/30 bg-red-500/5 text-red-500 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/10 transition-colors mt-4"
        >
          <LogOut className="w-4 h-4" />
          Log Out
        </button>

        <p className="text-center text-[10px] text-slate-600">
          Syriamart Fleet v1.2.4 · Build 0319
        </p>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 p-4">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
        <Icon className="w-4 h-4 text-slate-400" />
      </div>
      <div>
        <p className="text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function MenuButton({ icon: Icon, label }: { icon: any; label: string }) {
  return (
    <button className="flex items-center gap-3 p-4 w-full hover:bg-slate-800/50 transition-colors text-left group">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors">
        <Icon className="w-4 h-4 text-slate-400 group-hover:text-white" />
      </div>
      <span className="flex-1 text-sm font-medium text-white">{label}</span>
      <ChevronRight className="w-4 h-4 text-slate-600" />
    </button>
  );
}
