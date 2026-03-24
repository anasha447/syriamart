"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Package, MapPin, Clock } from "lucide-react";
import type { ScanConfirmationResponse } from "@/types/api";
import { formatDate, getOrderStatusConfig, shortId } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ScanConfirmationProps {
  result:    ScanConfirmationResponse | null;
  error?:    string | null;
  onDismiss: () => void;
  onDeliver: (orderId: string) => void;
}

/**
 * Slides up from the bottom of the screen after a successful or failed scan.
 * Shows:
 *   - Order ID (shortened for readability)
 *   - New order status badge
 *   - Location where the scan occurred
 *   - Time of scan
 *   - "Deliver Now" button for DRIVER_PICKUP → kicks off the delivery flow
 */
export function ScanConfirmation({ result, error, onDismiss, onDeliver }: ScanConfirmationProps) {
  const isVisible = !!result || !!error;
  const isSuccess = !!result && !error;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Tap-outside to dismiss */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-overlay bg-black/50"
            onClick={onDismiss}
          />

          {/* Bottom sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-modal",
              "max-w-md mx-auto",
              "rounded-t-3xl bg-[#1E293B] border-t border-slate-700",
              "px-5 pt-4 pb-8 safe-bottom"
            )}
          >
            {/* Drag handle */}
            <div className="w-10 h-1 rounded-full bg-slate-600 mx-auto mb-5" />

            {isSuccess && result ? (
              <div className="flex flex-col gap-5">
                {/* Status icon */}
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-green-400" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">Package scanned</p>
                    <p className="text-xs text-slate-400">{result.message}</p>
                  </div>
                </div>

                {/* Order info grid */}
                <div className="grid grid-cols-2 gap-3">
                  <InfoTile
                    icon={<Package className="w-4 h-4" />}
                    label="Order"
                    value={`#${shortId(result.orderId)}`}
                  />
                  <InfoTile
                    icon={<div className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", getOrderStatusConfig(result.newOrderStatus).className)}>
                      {getOrderStatusConfig(result.newOrderStatus).label}
                    </div>}
                    label="New status"
                    value=""
                  />
                  <InfoTile
                    icon={<MapPin className="w-4 h-4" />}
                    label="Location"
                    value={result.location}
                  />
                  <InfoTile
                    icon={<Clock className="w-4 h-4" />}
                    label="Time"
                    value={formatDate(result.scannedAt, "long")}
                  />
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-1">
                  {result.eventType === "DRIVER_PICKUP" && (
                    <button
                      onClick={() => onDeliver(result.orderId)}
                      className="w-full h-12 rounded-2xl bg-[#FF9900] text-[#0F172A] font-semibold text-sm"
                    >
                      Start Delivery
                    </button>
                  )}
                  <button
                    onClick={onDismiss}
                    className="w-full h-11 rounded-2xl border border-slate-600 text-slate-300 font-medium text-sm"
                  >
                    Scan next package
                  </button>
                </div>
              </div>
            ) : (
              // Error state
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-14 h-14 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="w-8 h-8 text-red-400" strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-base font-semibold text-white mb-1">Scan failed</p>
                  <p className="text-sm text-slate-400">{error}</p>
                </div>
                <button
                  onClick={onDismiss}
                  className="w-full h-12 rounded-2xl bg-slate-700 text-white font-medium text-sm mt-2"
                >
                  Try again
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-slate-400 mb-1">
        {icon}
        <span className="text-[10px] uppercase tracking-wider">{label}</span>
      </div>
      {value && <p className="text-sm font-medium text-white truncate">{value}</p>}
    </div>
  );
}
