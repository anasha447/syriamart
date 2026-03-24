"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Store, TrendingUp, ShieldCheck, Globe } from "lucide-react";
import { useRegisterSeller } from "@/hooks/useAuth";
import { registerSellerSchema, type RegisterSellerFormData } from "@/lib/validation/auth.schema";
import { cn } from "@/lib/utils";

const PERKS = [
  { icon: Globe,       text: "Reach thousands of Syrian shoppers"    },
  { icon: TrendingUp,  text: "Real-time sales analytics dashboard"   },
  { icon: ShieldCheck, text: "Secure, on-time seller payouts"        },
  { icon: Store,       text: "Free store setup — no monthly fees"    },
];

export default function RegisterSellerPage() {
  const registerMutation        = useRegisterSeller();
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSellerFormData>({
    resolver: zodResolver(registerSellerSchema),
  });

  const fieldClass = (err: boolean) => cn(
    "w-full h-11 px-3 rounded-lg text-sm border bg-background text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
    err ? "border-red-400" : "border-input"
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-lg border border-border"
      >
        {/* Left panel */}
        <div className="bg-[#0F172A] p-8 lg:p-10 flex flex-col justify-between hidden lg:flex">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold text-sm flex items-center justify-center">S</div>
              <span className="font-semibold text-xl text-white">Syrian<span className="text-[#FF9900]">Mart</span></span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Selling Today</h2>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Join thousands of Syrian sellers growing their business on SyrianMart. Your store is live within minutes.
            </p>
            <div className="space-y-4">
              {PERKS.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF9900]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-[#FF9900]" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm text-white/80">{text}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-white/30 text-xs mt-8">
            Already selling?{" "}
            <Link href="/login" className="text-[#FF9900] hover:underline font-medium">Sign in to your store</Link>
          </p>
        </div>

        {/* Right: form */}
        <div className="bg-white dark:bg-card p-8 lg:p-10 overflow-y-auto">
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold text-sm flex items-center justify-center">S</div>
            <span className="font-semibold text-lg text-[#1A365D] dark:text-white">Syrian<span className="text-[#FF9900]">Mart</span></span>
          </div>

          <h1 className="text-xl font-semibold text-foreground mb-1">Create Seller Account</h1>
          <p className="text-sm text-muted-foreground mb-6">Your application will be reviewed within 24 hours</p>

          <form onSubmit={handleSubmit((d) => registerMutation.mutate(d))} className="space-y-4">
            {/* Store details section */}
            <div className="pt-2 pb-1">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3">Store Details</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Name *</label>
                  <input {...register("storeName")} placeholder="Al-Ahmad Electronics" className={fieldClass(!!errors.storeName)} />
                  {errors.storeName && <p className="text-xs text-red-500 mt-1">{errors.storeName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Store Description <span className="text-muted-foreground">(optional)</span></label>
                  <textarea {...register("storeDescription")} rows={2} placeholder="Brief description of what you sell…"
                    className={cn(fieldClass(false), "h-auto resize-none py-2.5")}
                  />
                </div>
              </div>
            </div>

            {/* Personal details */}
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-3 mt-2">Your Details</p>
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
                      <input {...register("password")} type={showPass ? "text" : "password"} placeholder="Min 8 chars" className={cn(fieldClass(!!errors.password), "pr-10")} />
                      <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Confirm *</label>
                    <div className="relative">
                      <input {...register("confirmPassword")} type={showConf ? "text" : "password"} placeholder="Repeat" className={cn(fieldClass(!!errors.confirmPassword), "pr-10")} />
                      <button type="button" onClick={() => setShowConf((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" tabIndex={-1}>
                        {showConf ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" disabled={registerMutation.isPending}
              className="w-full h-11 rounded-lg bg-[#1A365D] text-white font-semibold text-sm hover:bg-[#1E3A5F] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {registerMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting application…</> : "Submit Application"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1A365D] dark:text-[#3B82F6] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
