"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";

export function useAdminPlatformAnalytics(year: number, month: number) {
  return useQuery({
    queryKey: ["admin", "analytics", "platform", year, month],
    queryFn: () => adminApi.getPlatformAnalytics(year, month),
    staleTime: 5 * 60 * 1000,
  });
}

export function useAdminRevenueBreakdown(months = 12) {
  return useQuery({
    queryKey: ["admin", "analytics", "revenue", months],
    queryFn: () => adminApi.getRevenueBreakdown(months),
    staleTime: 5 * 60 * 1000,
  });
}
