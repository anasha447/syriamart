"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface QrDisplayProps {
  /** The raw payload string to encode into a QR code. */
  payload:      string;
  /** Size in pixels — the QR fills this square. Default: 256 */
  size?:        number;
  /** Show order ID below the QR. */
  orderId?:     string;
  /** Additional class names on the outer container. */
  className?:   string;
  /** If true: white background forced (for scanning / printing). Default: true */
  highContrast?: boolean;
}

/**
 * Renders a QR code from a payload string using the `qrcode` npm package.
 * Dynamically imported — zero bundle cost on pages that don't use it.
 *
 * Used by:
 *   - Seller: /seller/orders/[itemId]/qr — full-screen QR for the packer
 *   - Seller: Order detail panel — compact QR for reference
 */
export function QrDisplay({
  payload,
  size         = 256,
  orderId,
  className,
  highContrast = true,
}: QrDisplayProps) {
  const canvasRef           = useRef<HTMLCanvasElement>(null);
  const [error, setError]   = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!payload || !canvasRef.current) return;

    let cancelled = false;

    async function render() {
      try {
        const QRCode = await import("qrcode");
        if (cancelled || !canvasRef.current) return;

        await QRCode.toCanvas(canvasRef.current, payload, {
          width:           size,
          margin:          2,
          color: {
            dark:  "#000000",
            light: "#FFFFFF",
          },
          errorCorrectionLevel: "H", // Highest — tolerates 30% damage (label scratches)
        });
        if (!cancelled) setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to generate QR code.");
          setLoading(false);
        }
      }
    }

    setLoading(true);
    render();
    return () => { cancelled = true; };
  }, [payload, size]);

  if (error) {
    return (
      <div className={cn("flex items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 text-sm p-4", className)}>
        Failed to generate QR code
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3",
        className
      )}
    >
      <div className={cn(
        "relative rounded-2xl overflow-hidden",
        highContrast ? "bg-white p-3 shadow-md" : "bg-transparent"
      )}>
        {loading && (
          <div
            style={{ width: size, height: size }}
            className="skeleton rounded-lg"
          />
        )}
        <canvas
          ref={canvasRef}
          style={{ display: loading ? "none" : "block" }}
          className="rounded-lg"
          aria-label={`QR code for order ${orderId ?? payload.slice(0, 8)}`}
        />
      </div>

      {orderId && (
        <div className="text-center">
          <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
            Order ID
          </p>
          <p className="text-sm font-mono font-semibold text-foreground mt-0.5">
            {orderId.replace(/-/g, "").slice(0, 8).toUpperCase()}
          </p>
        </div>
      )}
    </div>
  );
}
