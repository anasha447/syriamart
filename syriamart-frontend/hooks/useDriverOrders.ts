"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { driverApi } from "@/lib/api/driver";
import { useDriverStore } from "@/lib/store/driver.store";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";
import type { ScanPackageRequest, DeliveryProofRequest } from "@/types/api";

// ═══════════════════════════════════════════════════════════════════════════
// DRIVER ORDERS
// ═══════════════════════════════════════════════════════════════════════════

export function useDriverOrders() {
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.driver.orders(),
    queryFn:  driverApi.getMyActiveOrders,
    enabled:  isAuthenticated,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}

/**
 * POST /api/driver/scan — the core scan action.
 * Saves ScanEvent → appends OrderStatusHistory → fires OrderScannedEvent.
 */
export function useScanPackage() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: ScanPackageRequest) => driverApi.scanPackage(data),

    onSuccess: (result) => {
      // Invalidate the order list so the status badge updates immediately
      qc.invalidateQueries({ queryKey: queryKeys.driver.orders() });
      // Update the tracking cache for this order
      qc.invalidateQueries({ queryKey: queryKeys.tracking.byOrderId(result.orderId) });
      qc.invalidateQueries({ queryKey: queryKeys.driver.dashboard() });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

/**
 * POST /api/driver/orders/{orderId}/deliver — final delivery proof.
 * Fires DeliveryCompletedEvent → commercial-service marks order DELIVERED.
 */
export function useSubmitDeliveryProof() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, data }: { orderId: string; data: DeliveryProofRequest }) =>
      driverApi.submitDeliveryProof(orderId, data),

    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: queryKeys.driver.orders()  });
      qc.invalidateQueries({ queryKey: queryKeys.driver.dashboard() });
      qc.invalidateQueries({ queryKey: queryKeys.tracking.byOrderId(result.orderId) });
      qc.invalidateQueries({ queryKey: queryKeys.driver.shift() });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

// ═══════════════════════════════════════════════════════════════════════════
// DRIVER SHIFT
// ═══════════════════════════════════════════════════════════════════════════

export function useCurrentShift() {
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.driver.shift(),
    queryFn:  driverApi.getCurrentShift,
    enabled:  isAuthenticated,
    staleTime: 30 * 1000,
    // Gracefully handle 409/IllegalState when no shift is active
    retry: false,
  });
}

export function useStartShift() {
  const qc          = useQueryClient();
  const { setShift } = useDriverStore();

  return useMutation({
    mutationFn: driverApi.startShift,

    onSuccess: (shift) => {
      setShift(shift.shiftId);
      qc.invalidateQueries({ queryKey: queryKeys.driver.shift() });
      qc.invalidateQueries({ queryKey: queryKeys.driver.dashboard() });
      toast.success("Shift started. Good luck!");
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useEndShift() {
  const qc          = useQueryClient();
  const { setShift } = useDriverStore();

  return useMutation({
    mutationFn: driverApi.endShift,

    onSuccess: () => {
      setShift(null);
      qc.invalidateQueries({ queryKey: queryKeys.driver.shift() });
      qc.invalidateQueries({ queryKey: queryKeys.driver.dashboard() });
      qc.invalidateQueries({ queryKey: queryKeys.driver.payout() });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useUpdateDriverStatus() {
  const qc              = useQueryClient();
  const { setStatus }   = useDriverStore();

  return useMutation({
    mutationFn: (status: string) => driverApi.updateStatus(status),

    onSuccess: (_, status) => {
      setStatus(status as import("@/lib/store/driver.store").DriverStatus);
      qc.invalidateQueries({ queryKey: queryKeys.driver.profile() });
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useDriverPayout() {
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.driver.payout(),
    queryFn:  driverApi.getPayoutInfo,
    enabled:  isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
