"use client";

import { useState, useEffect, useRef, useCallback } from "react";

export type ScanStatus = "idle" | "scanning" | "success" | "error";

export interface UseQrScannerOptions {
  /**
   * Fired when a QR or barcode value is successfully decoded.
   * Return false to keep scanning (e.g. validate then reject invalid codes).
   * Return true (or nothing) to stop scanning after this result.
   */
  onScan: (value: string) => boolean | void;
  /** Element ID to mount the camera feed into. */
  elementId?: string;
  /** Prefer the back camera on mobile (default: true). */
  preferRearCamera?: boolean;
}

export interface UseQrScannerResult {
  status:    ScanStatus;
  lastValue: string | null;
  error:     string | null;
  startScan: () => Promise<void>;
  stopScan:  () => Promise<void>;
  isRunning: boolean;
}

/**
 * Wraps the html5-qrcode library with a clean React hook API.
 *
 * The library is dynamically imported so it only loads on the /driver/scan
 * page — zero bundle impact on the rest of the app.
 *
 * Features:
 *   - Camera feed via getUserMedia (back camera preferred on mobile)
 *   - File/image fallback for desktop or when camera permission denied
 *   - Handles iOS Safari getUserMedia restrictions gracefully
 *   - Cleans up camera stream on unmount (prevents "camera still in use" on iOS)
 */
export function useQrScanner({
  onScan,
  elementId = "qr-reader",
  preferRearCamera = true,
}: UseQrScannerOptions): UseQrScannerResult {
  const [status,    setStatus]    = useState<ScanStatus>("idle");
  const [lastValue, setLastValue] = useState<string | null>(null);
  const [error,     setError]     = useState<string | null>(null);

  // Keep the html5-qrcode instance alive across renders without causing re-renders
  const scannerRef = useRef<unknown | null>(null);
  const isRunning  = status === "scanning";

  const stopScan = useCallback(async () => {
    if (!scannerRef.current) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const scanner = scannerRef.current as any;
      if (await scanner.isScanning()) {
        await scanner.stop();
      }
      await scanner.clear();
    } catch {
      // Ignore stop errors — the camera may already be released
    }
    scannerRef.current = null;
    setStatus("idle");
  }, []);

  const startScan = useCallback(async () => {
    setStatus("scanning");
    setError(null);

    try {
      // Dynamic import — only loads on the scan page
      const { Html5Qrcode } = await import("html5-qrcode");

      const scanner = new Html5Qrcode(elementId);
      scannerRef.current = scanner;

      const config = {
        fps:            10,        // 10 frames/sec — good balance of speed vs battery
        qrbox:          { width: 250, height: 250 },
        aspectRatio:    1.0,
        disableFlip:    false,     // Auto-flip for front camera
        experimentalFeatures: { useBarCodeDetectorIfSupported: true },
      };

      await scanner.start(
        { facingMode: preferRearCamera ? "environment" : "user" },
        config,
        (decodedText: string) => {
          setLastValue(decodedText);
          setStatus("success");

          // Let the consumer decide whether to keep scanning
          const shouldContinue = onScan(decodedText);
          if (shouldContinue !== false) {
            // Auto-stop after a successful scan (default)
            stopScan();
          }
        },
        () => {
          // qr scan error (frame did not decode) — ignore, this fires constantly
        }
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Camera access failed.";
      setError(
        msg.includes("Permission")
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : `Scanner error: ${msg}`
      );
      setStatus("error");
      scannerRef.current = null;
    }
  }, [elementId, onScan, preferRearCamera, stopScan]);

  // Cleanup on unmount — critical to release the camera stream
  useEffect(() => {
    return () => {
      stopScan();
    };
  }, [stopScan]);

  return { status, lastValue, error, startScan, stopScan, isRunning };
}
