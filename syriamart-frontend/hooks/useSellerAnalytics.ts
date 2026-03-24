"use client";

import { useQuery } from "@tanstack/react-query";
import { sellerApi } from "@/lib/api/seller";
import { queryKeys } from "@/lib/queryClient";

export function useSellerDashboard() {
  return useQuery({
    queryKey: queryKeys.seller.dashboard(),
    queryFn:  sellerApi.getDashboard,
    staleTime: 5 * 60 * 1000,
    // Refresh every 5 minutes so revenue numbers stay live during work hours
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useSellerAnalyticsHistory() {
  return useQuery({
    queryKey: queryKeys.seller.analytics(),
    queryFn:  sellerApi.getAnalyticsHistory,
    staleTime: 10 * 60 * 1000, // Chart data — 10 min cache is fine
  });
}

export function useSellerMonthlyAnalytics(year: number, month: number) {
  return useQuery({
    queryKey: queryKeys.seller.monthly(year, month),
    queryFn:  () => sellerApi.getMonthlyAnalytics(year, month),
    staleTime: 10 * 60 * 1000,
    enabled:   year > 0 && month > 0,
  });
}
