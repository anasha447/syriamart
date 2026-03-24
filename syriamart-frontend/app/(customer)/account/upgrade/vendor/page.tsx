"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store, TrendingUp, ShieldCheck, Globe, Loader2,
  CheckCircle2, Clock, ArrowRight, ChevronLeft,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { sellerApi } from "@/lib/api/seller";
import { getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth.store";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────
type ApplicationStatus = "NONE" | "PENDING_SELLER" | "APPROVED_SELLER" | "REJECTED_SELLER";

const LS_KEY = "syriamart_vendor_application";

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
  storeName:        z.string().min(2, "Store name is required — at least 2 characters").max(80),
  storeDescription: z.string().max(400).optional(),
  phone:            z.string().min(9, "Enter a valid phone number").max(20),
});
type FormData = z.infer<typeof schema>;

// ── Perks panel ───────────────────────────────────────────────────────────────
const PERKS = [
  { icon: Globe,       text: "Reach thousands of Syrian shoppers"  },
  { icon: TrendingUp,  text: "Real-time sales analytics dashboard" },
  { icon: ShieldCheck, text: "Secure, on-time seller payouts"      },
  { icon: Store,       text: "Free store setup — no monthly fees"  },
];

// ── Status card ───────────────────────────────────────────────────────────────
function StatusCard({ status, reset }: { status: ApplicationStatus; reset: () => void }) {
  const isPending  = status === "PENDING_SELLER";
  const isApproved = status === "APPROVED_SELLER";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center text-center py-10 gap-5"
    >
      <div className={cn(
        "w-16 h-16 rounded-full flex items-center justify-center",
        isPending  ? "bg-amber-100 dark:bg-amber-900/30" : "bg-green-100 dark:bg-green-900/30",
      )}>
        {isPending
          ? <Clock      className="w-8 h-8 text-amber-500" />
          : <CheckCircle2 className="w-8 h-8 text-green-500" />}
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">
          {isPending ? "Application Under Review" : "Congratulations! You're a Vendor"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {isPending
            ? "Our team will review your application within 24–48 hours. You'll receive an email once approved."
            : "Your seller account is active. Head to your Seller Dashboard to set up your store."}
        </p>
      </div>
      {isApproved ? (
        <Link href="/seller/dashboard"
          className="inline-flex items-center gap-2 h-10 px-6 rounded-xl bg-[#1A365D] text-white text-sm font-semibold hover:bg-[#1E3A5F] transition-colors"
        >
          Go to Seller Dashboard <ArrowRight className="w-4 h-4" />
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

// ── Main page ────────────────────────────────────────────────────────────────
export default function BecomeVendorPage() {
  const user = useAuthStore((s) => s.user);
  const [appStatus, setAppStatus] = useState<ApplicationStatus>("NONE");

  useEffect(() => { setAppStatus(getStoredStatus()); }, []);

  const mutation = useMutation({
    mutationFn: (data: FormData) => sellerApi.applyAsVendor(data),
    onSuccess: () => {
      setStoredStatus("PENDING_SELLER");
      setAppStatus("PENDING_SELLER");
      toast.success("Application submitted! We'll review it within 24–48 hours.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: user?.firstName ? "" : "" },
  });

  const fieldClass = (err: boolean) => cn(
    "w-full h-11 px-3 rounded-xl border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
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
            <div className="w-10 h-10 rounded-xl bg-[#FF9900] text-[#0F172A] font-bold text-lg flex items-center justify-center mb-6">
              S
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Start Selling Today</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Join thousands of Syrian sellers growing their business on SyrianMart. Your store goes live within minutes of approval.
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
            Already a seller?{" "}
            <Link href="/seller/dashboard" className="text-[#FF9900] hover:underline font-medium">
              Go to your dashboard
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
                <h1 className="text-xl font-semibold text-foreground mb-1">Vendor Application</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Tell us about your store. Your application will be reviewed within 24 hours.
                </p>

                {/* Account info banner */}
                <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-[#EFF6FF] dark:bg-[#172554] border border-[#1A365D]/10">
                  <div className="w-8 h-8 rounded-full bg-[#1A365D] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {(user?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#1A365D] dark:text-[#3B82F6] truncate">
                      Applying as: {user?.email}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Your current account will be upgraded — no new password needed.</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit((d) => mutation.mutate(d))} className="space-y-4">
                  {/* Store name */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Store Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("storeName")}
                      placeholder="e.g. Al-Ahmad Electronics"
                      className={fieldClass(!!errors.storeName)}
                    />
                    {errors.storeName && <p className="text-xs text-red-500 mt-1">{errors.storeName.message}</p>}
                  </div>

                  {/* Store description */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Store Description <span className="text-muted-foreground text-xs">(optional)</span>
                    </label>
                    <textarea
                      {...register("storeDescription")}
                      rows={3}
                      placeholder="Brief description of what you sell…"
                      className={cn(fieldClass(false), "h-auto resize-none py-2.5")}
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">
                      Business Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("phone")}
                      type="tel"
                      placeholder="+963 912 345 678"
                      className={fieldClass(!!errors.phone)}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full h-11 rounded-xl bg-[#1A365D] text-white font-semibold text-sm hover:bg-[#1E3A5F] active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
                  >
                    {mutation.isPending
                      ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</>
                      : "Submit Vendor Application"}
                  </button>

                  <p className="text-xs text-muted-foreground text-center">
                    By applying you agree to our{" "}
                    <Link href="/seller-terms" className="text-[#1A365D] dark:text-[#3B82F6] hover:underline">
                      Seller Terms & Conditions
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
