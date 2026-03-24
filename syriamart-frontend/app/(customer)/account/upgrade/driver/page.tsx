"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, MapPin, DollarSign, Clock3, Loader2,
  CheckCircle2, Clock, ArrowRight, ChevronLeft,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { driverApi, type DriverUpgradeRequest } from "@/lib/api/driver";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth.store";
import { cn } from "@/lib/utils";

// ── Application status ────────────────────────────────────────────────────────
type ApplicationStatus = "NONE" | "PENDING_DRIVER" | "APPROVED_DRIVER" | "REJECTED_DRIVER";

const LS_KEY = "syriamart_driver_application";

function getStoredStatus(): ApplicationStatus {
  if (typeof window === "undefined") return "NONE";
  try { return (localStorage.getItem(LS_KEY) as ApplicationStatus) ?? "NONE"; }
  catch { return "NONE"; }
}

function setStoredStatus(s: ApplicationStatus) {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(LS_KEY, s); } catch { /* noop */ }
}

// ── Validation ────────────────────────────────────────────────────────────────
const schema = z.object({
  fullName:      z.string().min(2, "Full name is required").max(120),
  phone:         z.string().min(9, "Enter a valid phone number").max(20),
  vehicleType:   z.enum(["MOTORCYCLE", "CAR", "VAN", "TRUCK"], {
    errorMap: () => ({ message: "Please select a vehicle type" }),
  }),
  licensePlate:  z.string().min(2, "License plate is required").max(20),
  licenseNumber: z.string().min(4, "License/ID number is required").max(40),
  city:          z.string().min(2, "City is required").max(60),
});
type FormData = z.infer<typeof schema>;

// ── Perks ─────────────────────────────────────────────────────────────────────
const PERKS = [
  { icon: DollarSign, text: "Earn competitive per-delivery rates"    },
  { icon: Clock3,     text: "Flexible hours — work your own schedule" },
  { icon: MapPin,     text: "Optimized routes for faster deliveries"  },
  { icon: Truck,      text: "Support & training provided"             },
];

const VEHICLE_TYPES = [
  { value: "MOTORCYCLE", label: "🏍️ Motorcycle" },
  { value: "CAR",        label: "🚗 Car"         },
  { value: "VAN",        label: "🚐 Van"         },
  { value: "TRUCK",      label: "🚛 Truck"       },
] as const;

// ── Status card ───────────────────────────────────────────────────────────────
function StatusCard({ status, reset }: { status: ApplicationStatus; reset: () => void }) {
  const isPending  = status === "PENDING_DRIVER";
  const isApproved = status === "APPROVED_DRIVER";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-10 gap-5"
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center",
        isPending ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30",
      )}>
        {isPending
          ? <Clock       className="w-8 h-8 text-amber-500" />
          : <CheckCircle2 className="w-8 h-8 text-green-500" />}
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          {isPending ? "Application Under Review" : "Welcome to the Fleet!"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {isPending
            ? "Our logistics team will review your application within 24–48 hours. You'll receive an email with next steps."
            : "Your driver account is active. Head to the Driver Portal to start delivering."}
        </p>
      </div>
      {isApproved ? (
        <Link href="/driver/dashboard"
          className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] transition-colors"
        >
          Go to Driver Portal <ArrowRight className="w-4 h-4" />
        </Link>
      ) : (
        <button onClick={reset}
          className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
        >
          Submit a different application
        </button>
      )}
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BecomeDriverPage() {
  const user = useAuthStore((s) => s.user);
  const [appStatus, setAppStatus] = useState<ApplicationStatus>("NONE");

  useEffect(() => { setAppStatus(getStoredStatus()); }, []);

  const mutation = useMutation({
    mutationFn: (data: FormData) =>
      driverApi.applyAsDriver(data as DriverUpgradeRequest),
    onSuccess: () => {
      setStoredStatus("PENDING_DRIVER");
      setAppStatus("PENDING_DRIVER");
      toast.success("Application submitted! Our logistics team will be in touch within 24–48 hours.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fieldClass = (err: boolean) => cn(
    "w-full h-11 px-3 rounded-xl border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A]",
    "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
    err ? "border-red-400" : "border-input",
  );

  const reset = () => {
    setStoredStatus("NONE");
    setAppStatus("NONE");
  };

  return (
    <div className="max-w-4xl">
      {/* Back link */}
      <Link href="/account/profile"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Account
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="grid grid-cols-1 lg:grid-cols-5 gap-0 rounded-2xl overflow-hidden border border-border shadow-sm"
      >
        {/* ── Left info panel ─────────────────────────────────────────── */}
        <div className="hidden lg:flex lg:col-span-2 bg-[#0F172A] p-8 flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/10 text-white flex items-center justify-center mb-6">
              <Truck className="w-5 h-5" strokeWidth={1.8} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Join Our Driver Network</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Become part of SyrianMart's delivery fleet. Earn competitively with flexible hours and a supportive team.
            </p>
            <div className="space-y-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-white/70" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-xs mt-8">
            Already a driver?{" "}
            <Link href="/driver/login" className="text-white/60 hover:text-white hover:underline font-medium transition-colors">
              Sign in to your portal
            </Link>
          </p>
        </div>

        {/* ── Right: form or status ────────────────────────────────────── */}
        <div className="lg:col-span-3 bg-white dark:bg-card p-8">
          <AnimatePresence mode="wait">
            {appStatus !== "NONE" ? (
              <StatusCard key="status" status={appStatus} reset={reset} />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-xl font-semibold text-foreground mb-1">Driver Application</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill in your details. Our team will review and contact you within 24–48 hours.
                </p>

                {/* Account info banner */}
                <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-border">
                  <div className="w-8 h-8 rounded-full bg-[#0F172A] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {(user?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-foreground truncate">
                      Applying as: {user?.email}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Your current account will be upgraded — no new password needed.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                  {/* Full name + phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input {...register("fullName")} placeholder="Mohammed Al-Ahmad" className={fieldClass(!!errors.fullName)} />
                      {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        Phone <span className="text-red-500">*</span>
                      </label>
                      <input {...register("phone")} type="tel" placeholder="+963 912 345 678" className={fieldClass(!!errors.phone)} />
                      {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                    </div>
                  </div>

                  {/* Vehicle type */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Vehicle Type <span className="text-red-500">*</span>
                    </label>
                    <select {...register("vehicleType")} className={cn(fieldClass(!!errors.vehicleType), "cursor-pointer")}>
                      <option value="">Select vehicle type…</option>
                      {VEHICLE_TYPES.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                    {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType.message}</p>}
                  </div>

                  {/* License plate + license number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        License Plate <span className="text-red-500">*</span>
                      </label>
                      <input {...register("licensePlate")} placeholder="e.g. DM 12345" className={fieldClass(!!errors.licensePlate)} />
                      {errors.licensePlate && <p className="text-xs text-red-500 mt-1">{errors.licensePlate.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">
                        National ID / License No. <span className="text-red-500">*</span>
                      </label>
                      <input {...register("licenseNumber")} placeholder="e.g. SY-1234567" className={fieldClass(!!errors.licenseNumber)} />
                      {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber.message}</p>}
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      City / Zone of Operation <span className="text-red-500">*</span>
                    </label>
                    <input {...register("city")} placeholder="e.g. Damascus, Aleppo, Homs…" className={fieldClass(!!errors.city)} />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-11 rounded-xl bg-[#0F172A] text-white font-semibold text-sm hover:bg-[#1E293B] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {mutation.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                      : "Submit Driver Application"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    By applying you agree to our{" "}
                    <Link href="/driver-terms" className="text-[#0F172A] dark:text-[#3B82F6] hover:underline">
                      Driver Terms & Conditions
                    </Link>
                  </p>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
