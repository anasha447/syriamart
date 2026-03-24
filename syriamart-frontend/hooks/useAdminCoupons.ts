"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/api/client";

export function useAdminCoupons(page = 0) {
  return useQuery({
    queryKey: ["admin", "coupons", page],
    queryFn: () => adminApi.getPlatformCoupons(page, 20),
    staleTime: 60 * 1000,
  });
}

export function useCreatePlatformCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => adminApi.createPlatformCoupon(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Platform coupon created successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useDeletePlatformCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCoupon(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "coupons"] });
      toast.success("Coupon deleted successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
