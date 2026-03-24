"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { useRegisterCustomer } from "@/hooks/useAuth";
import { registerCustomerSchema, type RegisterCustomerFormData } from "@/lib/validation/auth.schema";
import { cn } from "@/lib/utils";

const BENEFITS = [
  "Track orders in real time",
  "Save wishlists & addresses",
  "Exclusive member deals",
  "Fast checkout every time",
];

export default function RegisterCustomerPage() {
  const registerMutation      = useRegisterCustomer();
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCustomerFormData>({
    resolver: zodResolver(registerCustomerSchema),
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
        {/* Left: benefits panel */}
        <div className="bg-[#1A365D] p-8 lg:p-10 flex flex-col justify-between hidden lg:flex">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <div className="w-9 h-9 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold text-sm flex items-center justify-center">S</div>
              <span className="font-semibold text-xl text-white">Syrian<span className="text-[#FF9900]">Mart</span></span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Join SyrianMart</h2>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Create your free account and start shopping from thousands of verified Syrian sellers.
            </p>
            <ul className="space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle className="w-4 h-4 text-[#FF9900] flex-shrink-0" strokeWidth={2} />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-white/30 text-xs mt-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF9900] hover:underline font-medium">Sign in</Link>
          </p>
        </div>

        {/* Right: form */}
        <div className="bg-white dark:bg-card p-8 lg:p-10">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-6 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold text-sm flex items-center justify-center">S</div>
            <span className="font-semibold text-lg text-[#1A365D] dark:text-white">Syrian<span className="text-[#FF9900]">Mart</span></span>
          </div>

          <h1 className="text-xl font-semibold text-foreground mb-1">Create account</h1>
          <p className="text-sm text-muted-foreground mb-6">Free forever · No credit card required</p>

          <form onSubmit={handleSubmit((d) => registerMutation.mutate(d))} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Full Name *</label>
              <input {...register("fullName")} placeholder="Mohammed Al-Ahmad" className={fieldClass(!!errors.fullName)} />
              {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email Address *</label>
              <input {...register("email")} type="email" placeholder="you@example.com" className={fieldClass(!!errors.email)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Phone Number *</label>
              <input {...register("phone")} type="tel" placeholder="+963 912 345 678" className={fieldClass(!!errors.phone)} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password *</label>
              <div className="relative">
                <input {...register("password")} type={showPass ? "text" : "password"} placeholder="Min. 8 characters" className={cn(fieldClass(!!errors.password), "pr-10")} />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Confirm Password *</label>
              <div className="relative">
                <input {...register("confirmPassword")} type={showConf ? "text" : "password"} placeholder="Repeat password" className={cn(fieldClass(!!errors.confirmPassword), "pr-10")} />
                <button type="button" onClick={() => setShowConf((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>
                  {showConf ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            <button type="submit" disabled={registerMutation.isPending}
              className="w-full h-11 rounded-lg bg-[#FF9900] text-[#0F172A] font-semibold text-sm hover:bg-[#E68A00] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {registerMutation.isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Creating account…</> : "Create Free Account"}
            </button>
          </form>

          <p className="text-xs text-muted-foreground text-center mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1A365D] dark:text-[#3B82F6] font-semibold hover:underline">Sign in</Link>
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            Want to sell?{" "}
            <Link href="/register/seller" className="text-[#1A365D] dark:text-[#3B82F6] font-semibold hover:underline">Open a seller account →</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
