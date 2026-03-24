"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine } from "lucide-react";
import { QrScanner } from "@/components/qr/QrScanner";
import { ScanConfirmation } from "@/components/qr/ScanConfirmation";
import { useScanPackage } from "@/hooks/useDriverOrders";
import type { ScanConfirmationResponse, ScanEventType } from "@/types/api";
import { cn } from "@/lib/utils";

const EVENT_TYPES: { value: ScanEventType; label: string }[] = [
  { value: "DRIVER_PICKUP",    label: "Pickup"    },
  { value: "IN_TRANSIT",       label: "In transit"},
  { value: "RETURN_INITIATED", label: "Return"    },
];

/**
 * /driver/scan — The core scanner screen.
 *
 * Rendered inside the driver portal dark layout.
 * The camera takes over most of the viewport; controls sit above and below.
 *
 * Flow:
 *   1. Driver selects scan type (DRIVER_PICKUP by default)
 *   2. QrScanner activates the camera and decodes the QR payload
 *   3. The decoded value is sent to POST /api/driver/scan
 *   4. ScanConfirmation slide-up shows the result
 *   5. If DRIVER_PICKUP: "Start Delivery" button navigates to /driver/orders/[orderId]
 */
export default function DriverScanPage() {
  const router = useRouter();
  const [eventType, setEventType]   = useState<ScanEventType>("DRIVER_PICKUP");
  const [scanResult, setScanResult] = useState<ScanConfirmationResponse | null>(null);
  const [scanError,  setScanError]  = useState<string | null>(null);
  const [key, setKey]               = useState(0); // remounts QrScanner to restart

  const scanMutation = useScanPackage();

  const handleScanSuccess = useCallback(async (rawValue: string) => {
    setScanError(null);
    setScanResult(null);

    // Extract orderId from the QR payload (format: SYRIAMART:{orderId}:{sellerId}:{hmac})
    const parts   = rawValue.split(":");
    const orderId = parts.length >= 2 ? parts[1] : rawValue;

    try {
      const result = await scanMutation.mutateAsync({
        orderId,
        scanCode:  rawValue,
        eventType,
        location:  "Driver location",   // Updated by backend with GPS from headers
        latitude:  undefined,
        longitude: undefined,
        notes:     undefined,
      });
      setScanResult(result);
    } catch (error) {
      setScanError(error instanceof Error ? error.message : "Scan failed. Please try again.");
    }
  }, [eventType, scanMutation]);

  const handleDismiss = useCallback(() => {
    setScanResult(null);
    setScanError(null);
    setKey((k) => k + 1); // Restart the scanner
  }, []);

  const handleDeliver = useCallback((orderId: string) => {
    setScanResult(null);
    router.push(`/driver/orders/${orderId}`);
  }, [router]);

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A]">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#FF9900]/20 flex items-center justify-center">
          <ScanLine className="w-4 h-4 text-[#FF9900]" />
        </div>
        <h1 className="text-base font-semibold text-white">Scan Package</h1>
      </div>

      {/* Scan type selector */}
      <div className="px-4 pb-3">
        <div className="flex gap-2 p-1 bg-slate-800/60 rounded-xl">
          {EVENT_TYPES.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setEventType(value)}
              className={cn(
                "flex-1 h-8 rounded-lg text-xs font-semibold transition-all duration-150",
                eventType === value
                  ? "bg-[#FF9900] text-[#0F172A] shadow-sm"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera scanner — key forces remount on dismiss */}
      <div className="flex-1">
        <QrScanner
          key={key}
          eventType={eventType}
          onScanSuccess={handleScanSuccess}
        />
      </div>

      {/* Loading overlay when API call is in flight */}
      <AnimatePresence>
        {scanMutation.isPending && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-modal bg-[#0F172A]/80 flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 border-2 border-[#FF9900] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-slate-300">Recording scan…</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result / error bottom sheet */}
      <ScanConfirmation
        result={scanResult}
        error={scanError}
        onDismiss={handleDismiss}
        onDeliver={handleDeliver}
      />
    </div>
  );
}
