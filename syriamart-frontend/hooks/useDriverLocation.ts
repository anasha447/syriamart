"use client";

import { useEffect, useRef, useCallback } from "react";
import { useDriverStore } from "@/lib/store/driver.store";
import { driverApi } from "@/lib/api/driver";

/**
 * Pings the driver's GPS coordinates to the backend every 30 seconds.
 * Only active when the driver is on shift (status !== OFFLINE).
 *
 * The hook starts automatically on mount when the driver is authenticated
 * and stops when:
 *   - The driver logs out (isAuthenticated becomes false)
 *   - The driver status changes to OFFLINE
 *   - The component unmounts (cleanup)
 *
 * Uses a ref-based interval (not state) to avoid re-renders.
 */
export function useDriverLocation() {
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);
  const driverStatus    = useDriverStore((s) => s.driver?.status ?? "OFFLINE");
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null);

  const shouldPing = isAuthenticated && driverStatus !== "OFFLINE" && driverStatus !== "SUSPENDED";

  const ping = useCallback(async () => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          await driverApi.updateLocation(coords.latitude, coords.longitude);
        } catch {
          // Silently fail — location ping is best-effort, not critical
        }
      },
      (error) => {
        if (error.code === GeolocationPositionError.PERMISSION_DENIED) {
          // Don't retry if permission was denied
          stopPinging();
        }
      },
      {
        enableHighAccuracy: true,
        timeout:            5000,
        maximumAge:         10000,
      }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startPinging = useCallback(() => {
    if (intervalRef.current) return; // Already running
    ping(); // Immediate first ping
    intervalRef.current = setInterval(ping, 30_000); // Then every 30s
  }, [ping]);

  const stopPinging = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (shouldPing) {
      startPinging();
    } else {
      stopPinging();
    }
    return stopPinging;
  }, [shouldPing, startPinging, stopPinging]);
}
