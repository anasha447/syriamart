"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Truck } from "lucide-react";
import { useDriverLogin } from "@/hooks/useDriverAuth";
import { driverLoginSchema, type DriverLoginFormData } from "@/lib/validation/driver.schema";
import { cn } from "@/lib/utils";

/**
 * Driver login — intentionally separate from the customer login.
 * Forced dark, full-screen, minimal — feels like a professional tool.
 * Calls POST /api/driver/auth/login → stores driver JWT in driver.store.
 */
export default function DriverLoginPage() {
  const loginMutation           = useDriverLogin();
  const [showPass, setShowPass] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DriverLoginFormData>({ resolver: zodResolver(driverLoginSchema) });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-[#0F172A]">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="w-full max-w-sm"
      >
        {/* Amber logo pill */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <div className="w-16 h-16 rounded-2xl bg-[#FF9900] flex items-center justify-center shadow-lg">
            <Truck className="w-8 h-8 text-[#0F172A]" strokeWidth={2} />
          </div>
          <div className="text-center">
            <p className="text-white font-semibold text-xl">Driver Portal</p>
            <p className="text-slate-400 text-sm mt-0.5">SyrianMart Delivery</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit((d) => loginMutation.mutate(d))}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Email address
            </label>
            <input
              {...register("email")}
              type="email"
              autoComplete="email"
              placeholder="driver@syriamart.com"
              className={cn(
                "w-full h-12 px-4 rounded-xl text-sm",
                "bg-slate-800 border text-white placeholder:text-slate-500",
                "outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20",
                "transition-all duration-150",
                errors.email ? "border-red-500" : "border-slate-700"
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1.5">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                {...register("password")}
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  "w-full h-12 px-4 pr-11 rounded-xl text-sm",
                  "bg-slate-800 border text-white placeholder:text-slate-500",
                  "outline-none focus:border-[#FF9900] focus:ring-2 focus:ring-[#FF9900]/20",
                  "transition-all duration-150",
                  errors.password ? "border-red-500" : "border-slate-700"
                )}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                tabIndex={-1}
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-400 mt-1.5">{errors.password.message}</p>
            )}
          </div>

          {/* Submit — amber CTA */}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className={cn(
              "w-full h-12 rounded-xl font-semibold text-sm mt-2",
              "bg-[#FF9900] text-[#0F172A]",
              "hover:bg-[#E68A00] active:scale-[0.98]",
              "transition-all duration-150",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "flex items-center justify-center gap-2"
            )}
          >
            {loginMutation.isPending ? (
              <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
            ) : "Sign in to Driver Portal"}
          </button>
        </form>

        <div className="text-center mt-8 space-y-2">
          <p className="text-xs text-slate-600">
            Not a driver?{" "}
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors">
              Customer login →
            </Link>
          </p>
          <p className="text-xs text-slate-600">
            Want to join the fleet?{" "}
            <Link href="/driver/register" className="text-[#FF9900] hover:text-[#E68A00] font-medium transition-colors">
              Register as a Driver →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
