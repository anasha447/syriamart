"use client";

import React from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useLogin } from "@/hooks/useAuth";
import { loginSchema, type LoginFormData } from "@/lib/validation/auth.schema";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const loginMutation             = useLogin();
  const [showPassword, setShow]   = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-neutral-50 dark:bg-background">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0  }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 rounded-xl bg-[#FF9900] text-[#0F172A] font-bold text-base flex items-center justify-center">
            S
          </div>
          <span className="font-semibold text-2xl text-[#1A365D] dark:text-white">
            Syrian<span className="text-[#FF9900]">Mart</span>
          </span>
        </div>

        <div className="bg-white dark:bg-card rounded-2xl border border-border p-8 shadow-sm">
          <h1 className="text-xl font-semibold text-foreground mb-1">Welcome back</h1>
          <p className="text-sm text-muted-foreground mb-6">Sign in to your account</p>

          <form onSubmit={handleSubmit((d) => loginMutation.mutate(d))} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className={cn(
                  "w-full h-11 px-3 rounded-lg text-sm border bg-background",
                  "text-foreground placeholder:text-muted-foreground",
                  "outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
                  "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
                  "transition-all duration-150",
                  errors.email ? "border-red-400" : "border-input"
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Link href="/forgot-password" className="text-xs text-[#1A365D] dark:text-[#3B82F6] hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    "w-full h-11 px-3 pr-10 rounded-lg text-sm border bg-background",
                    "text-foreground placeholder:text-muted-foreground",
                    "outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
                    "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
                    "transition-all duration-150",
                    errors.password ? "border-red-400" : "border-input"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShow((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" />
                    : <Eye     className="w-4 h-4" />
                  }
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className={cn(
                "w-full h-11 rounded-lg font-semibold text-sm",
                "bg-[#1A365D] text-white",
                "hover:bg-[#1E3A5F] active:scale-[0.98]",
                "transition-all duration-150",
                "disabled:opacity-60 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {loginMutation.isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Signing in…</>
              ) : "Sign in"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-card px-3 text-xs text-muted-foreground">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/register/customer"
              className="h-9 rounded-lg border border-border text-xs font-medium text-foreground hover:bg-neutral-50 dark:hover:bg-muted transition-colors flex items-center justify-center"
            >
              Shop as customer
            </Link>
            <Link
              href="/register/seller"
              className="h-9 rounded-lg border border-[#1A365D]/30 text-xs font-medium text-[#1A365D] dark:text-[#3B82F6] hover:bg-[#EFF6FF] dark:hover:bg-[#172554] transition-colors flex items-center justify-center"
            >
              Sell on SyrianMart
            </Link>
          </div>
        </div>

        {/* Driver link */}
        <p className="text-center text-xs text-muted-foreground mt-4">
          Are you a delivery driver?{" "}
          <Link href="/driver/login" className="text-[#FF9900] font-medium hover:underline">
            Driver portal →
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
