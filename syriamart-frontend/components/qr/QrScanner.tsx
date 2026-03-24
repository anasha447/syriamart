"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flashlight, CameraOff, Loader2 } from "lucide-react";
import { useQrScanner } from "@/hooks/useQrScanner";
import type { ScanEventType } from "@/types/api";
import { cn } from "@/lib/utils";

interface QrScannerProps {
  eventType:  ScanEventType;
  onScanSuccess: (value: string) => void;
  className?:  string;
}

const ELEMENT_ID = "qr-reader-viewport";

/**
 * Full-screen camera QR scanner for the driver portal.
 *
 * Features:
 *   - Animated corner-bracket reticle (pure CSS — no images)
 *   - Amber pulsing border when actively scanning
 *   - Green flash overlay on successful decode
 *   - Camera permission error state with fallback instructions
 *   - Manual order ID input for damaged QR labels
 */
export function QrScanner({ eventType, onScanSuccess, className }: QrScannerProps) {
  const [manualInput, setManualInput] = React.useState("");
  const [showSuccess, setShowSuccess] = React.useState(false);

  const { status, error, startScan, stopScan, isRunning } = useQrScanner({
    elementId: ELEMENT_ID,
    onScan: (value) => {
      // Briefly show the green success flash before calling back
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onScanSuccess(value);
      }, 600);
      return true; // Stop scanning after one hit
    },
  });

  // Start the scanner automatically when mounted
  useEffect(() => {
    startScan();
    return () => { stopScan(); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = manualInput.trim();
    if (!trimmed) return;
    setManualInput("");
    onScanSuccess(trimmed);
  };

  const EVENT_LABELS: Record<ScanEventType, string> = {
    DRIVER_PICKUP:       "Driver pickup",
    IN_TRANSIT:          "In transit",
    DELIVERED:           "Delivery",
    RETURN_INITIATED:    "Return pickup",
    INBOUND_WAREHOUSE:   "Warehouse inbound",
    OUTBOUND_WAREHOUSE:  "Warehouse outbound",
    PICKUP_POINT_DROP:   "Pickup point drop",
    RETURN_RECEIVED:     "Return received",
  };

  return (
    <div className={cn("flex flex-col w-full", className)}>
      {/* Scan type label */}
      <div className="px-4 py-3">
        <p className="text-xs text-slate-400 uppercase tracking-widest">Scan type</p>
        <p className="text-base font-semibold text-white mt-0.5">
          {EVENT_LABELS[eventType] ?? eventType}
        </p>
      </div>

      {/* Camera viewport */}
      <div className="relative flex items-center justify-center">
        {/* The html5-qrcode library mounts its video into this div */}
        <div
          id={ELEMENT_ID}
          className="w-full max-w-sm aspect-square relative overflow-hidden"
        />

        {/* Reticle overlay — only shown when scanning */}
        {isRunning && !error && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {/* Dark overlay edges */}
            <div className="absolute inset-0 bg-[#0F172A]/60" />
            {/* Clear scanning zone */}
            <div
              className={cn(
                "relative w-56 h-56",
                "border-0",
                showSuccess ? "bg-green-500/20" : "bg-transparent"
              )}
            >
              {/* Amber corner brackets */}
              <span className="scan-corner scan-corner-tl" />
              <span className="scan-corner scan-corner-tr" />
              <span className="scan-corner scan-corner-bl" />
              <span className="scan-corner scan-corner-br" />

              {/* Scanning pulse animation */}
              {!showSuccess && (
                <motion.div
                  className="absolute inset-0 border-2 border-[#FF9900]/40 rounded-sm"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                />
              )}

              {/* Success flash */}
              <AnimatePresence>
                {showSuccess && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-green-500/30 rounded-sm flex items-center justify-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Loading state */}
        {status === "idle" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#0F172A]">
            <Loader2 className="w-8 h-8 text-slate-500 animate-spin" />
          </div>
        )}

        {/* Camera permission error */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0F172A] gap-4 p-6 text-center">
            <CameraOff className="w-10 h-10 text-slate-500" />
            <p className="text-sm text-slate-300">{error}</p>
            <button
              onClick={() => startScan()}
              className="px-4 py-2 rounded-full bg-[#FF9900] text-[#0F172A] text-sm font-semibold"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Instruction text */}
      {isRunning && !error && (
        <p className="text-center text-xs text-slate-400 mt-3 px-4">
          Point the camera at the package QR label
        </p>
      )}

      {/* Manual fallback input */}
      <div className="px-4 mt-6">
        <p className="text-xs text-slate-500 mb-2">
          QR label damaged? Enter the order ID manually:
        </p>
        <form onSubmit={handleManualSubmit} className="flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Enter order ID…"
            className={cn(
              "flex-1 h-10 px-3 rounded-lg text-sm",
              "bg-slate-800 border border-slate-700",
              "text-white placeholder:text-slate-500",
              "outline-none focus:border-[#FF9900] transition-colors"
            )}
          />
          <button
            type="submit"
            disabled={!manualInput.trim()}
            className={cn(
              "h-10 px-4 rounded-lg text-sm font-semibold transition-colors",
              "bg-[#FF9900] text-[#0F172A]",
              "disabled:opacity-40 disabled:cursor-not-allowed"
            )}
          >
            Confirm
          </button>
        </form>
      </div>
    </div>
  );
}
