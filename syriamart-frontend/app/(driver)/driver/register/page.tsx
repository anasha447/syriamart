"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, MapPin, DollarSign, Clock3, Eye, EyeOff, Loader2,
  CheckCircle2, ArrowRight,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { driverApi, type DriverRegisterRequest } from "@/lib/api/driver";
import { getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";

// ── Validation ────────────────────────────────────────────────────────────────
const schema = z.object({
  fullName:        z.string().min(2, "Full name is required").max(120),
  email:           z.string().email("Enter a valid email"),
  phone:           z.string().min(9, "Enter a valid phone number").max(20),
  password:        z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  vehicleType:     z.enum(["MOTORCYCLE", "CAR", "VAN", "TRUCK"], {
    errorMap: () => ({ message: "Please select a vehicle type" }),
  }),
  licensePlate:    z.string().min(2, "License plate is required").max(20),
  licenseNumber:   z.string().min(4, "License/ID number is required").max(40),
  city:            z.string().min(2, "City is required").max(60),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords do not match",
  path:    ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

const PERKS = [
  { icon: DollarSign, text: "Earn competitive per-delivery income"   },
  { icon: Clock3,     text: "Flexible hours — work when you want"    },
  { icon: MapPin,     text: "Smart routes for maximum efficiency"    },
  { icon: Truck,      text: "On-boarding support from day one"       },
];

const VEHICLE_TYPES = [
  { value: "MOTORCYCLE", label: "🏍️ Motorcycle" },
  { value: "CAR",        label: "🚗 Car"         },
  { value: "VAN",        label: "🚐 Van"         },
  { value: "TRUCK",      label: "🚛 Truck"       },
] as const;

// ── Success state ─────────────────────────────────────────────────────────────
function SuccessState() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-12 gap-5"
    >
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-green-500" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Application Submitted!</h2>
        <p className="text-sm text-muted-foreground max-w-xs mx-auto leading-relaxed">
          Our logistics team will review your application and contact you within 24–48 hours. Check your email for next steps.
        </p>
      </div>
      <Link href="/driver/login"
        className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[#0F172A] text-white text-sm font-semibold hover:bg-[#1E293B] transition-colors"
      >
        Sign in when approved <ArrowRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DriverRegisterPage() {
  const [showPass, setShowPass]    = useState(false);
  const [showConf, setShowConf]    = useState(false);
  const [submitted, setSubmitted]  = useState(false);

  const mutation = useMutation({
    mutationFn: (data: FormData) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...payload } = data;
      return driverApi.register(payload as DriverRegisterRequest);
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted successfully!");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const fieldClass = (err: boolean) => cn(
    "w-full h-11 px-3 rounded-lg border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#0F172A]/20 focus:border-[#0F172A]",
    "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
    err ? "border-red-400" : "border-input",
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-neutral-50 dark:bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg border border-border"
      >
        {/* ── Left info panel ───────────────────────────────────────── */}
        <div className="bg-[#0F172A] p-8 lg:p-10 flex-col justify-between hidden lg:flex">
          <div>
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center">
                <Truck className="w-5 h-5" strokeWidth={1.8} />
              </div>
              <span className="font-semibold text-xl text-white">
                Syrian<span className="text-[#FF9900]">Mart</span> Driver
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Drive With Us</h2>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Join our growing fleet and earn money delivering across Syria on your own schedule.
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
            Already registered?{" "}
            <Link href="/driver/login" className="text-white/70 hover:text-white hover:underline font-medium transition-colors">
              Sign in to the Driver Portal
            </Link>
          </p>
        </div>

        {/* ── Right: form ──────────────────────────────────────────── */}
        <div className="bg-white dark:bg-card p-8 lg:p-10 overflow-y-auto">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-white flex items-center justify-center">
              <Truck className="w-4 h-4" strokeWidth={1.8} />
            </div>
            <span className="font-semibold text-lg text-foreground">
              Syrian<span className="text-[#FF9900]">Mart</span> Driver
            </span>
          </div>

          <AnimatePresence mode="wait">
            {submitted ? (
              <SuccessState key="success" />
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="text-xl font-semibold text-foreground mb-1">Create Driver Account</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Your application will be reviewed by our logistics team within 24 hours.
                </p>

                <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">

                  {/* Section: Personal info */}
                  <div>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Personal Information
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
                        <input {...register("fullName")} placeholder="Mohammed Al-Ahmad" className={fieldClass(!!errors.fullName)} />
                        {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Email *</label>
                          <input {...register("email")} type="email" placeholder="you@example.com" className={fieldClass(!!errors.email)} />
                          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Phone *</label>
                          <input {...register("phone")} type="tel" placeholder="+963 912…" className={fieldClass(!!errors.phone)} />
                          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Password *</label>
                          <div className="relative">
                            <input
                              {...register("password")}
                              type={showPass ? "text" : "password"}
                              placeholder="Min 8 characters"
                              className={cn(fieldClass(!!errors.password), "pr-10")}
                            />
                            <button type="button" onClick={() => setShowPass((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}
                            >
                              {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">Confirm *</label>
                          <div className="relative">
                            <input
                              {...register("confirmPassword")}
                              type={showConf ? "text" : "password"}
                              placeholder="Repeat password"
                              className={cn(fieldClass(!!errors.confirmPassword), "pr-10")}
                            />
                            <button type="button" onClick={() => setShowConf((s) => !s)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}
                            >
                              {showConf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                          {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Section: Vehicle info */}
                  <div className="pt-2 border-t border-border">
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-2">
                      Vehicle Information
                    </p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Vehicle Type *</label>
                        <select {...register("vehicleType")} className={cn(fieldClass(!!errors.vehicleType), "cursor-pointer")}>
                          <option value="">Select vehicle type…</option>
                          {VEHICLE_TYPES.map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        {errors.vehicleType && <p className="text-xs text-red-500 mt-1">{errors.vehicleType.message}</p>}
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">License Plate *</label>
                          <input {...register("licensePlate")} placeholder="DM 12345" className={fieldClass(!!errors.licensePlate)} />
                          {errors.licensePlate && <p className="text-xs text-red-500 mt-1">{errors.licensePlate.message}</p>}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-1.5">National ID / License No. *</label>
                          <input {...register("licenseNumber")} placeholder="SY-1234567" className={fieldClass(!!errors.licenseNumber)} />
                          {errors.licenseNumber && <p className="text-xs text-red-500 mt-1">{errors.licenseNumber.message}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">City / Zone *</label>
                        <input {...register("city")} placeholder="Damascus, Aleppo, Homs…" className={fieldClass(!!errors.city)} />
                        {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city.message}</p>}
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-11 rounded-xl bg-[#0F172A] text-white font-semibold text-sm hover:bg-[#1E293B] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {mutation.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting application…</>
                      : "Submit Driver Application"}
                  </button>
                </form>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Already have an account?{" "}
                  <Link href="/driver/login" className="text-[#0F172A] dark:text-[#3B82F6] font-semibold hover:underline">
                    Sign in to Driver Portal
                  </Link>
                  {" | "}
                  <Link href="/login" className="text-[#1A365D] dark:text-[#3B82F6] hover:underline">
                    Customer login
                  </Link>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
