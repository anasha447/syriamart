"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { couponsApi } from "@/lib/api/coupons";
import { getErrorMessage } from "@/lib/api/client";

export const couponKeys = {
  all: ["coupons"] as const,
  mine: (page: number) => [...couponKeys.all, "mine", page] as const,
  platform: (page: number) => [...couponKeys.all, "platform", page] as const,
};

export function useMyCoupons(page = 0) {
  return useQuery({
    queryKey: couponKeys.mine(page),
    queryFn: () => couponsApi.getMyCoupons(page),
    staleTime: 60 * 1000,
  });
}

export function useCreateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => couponsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon created successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useUpdateCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) => couponsApi.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon updated successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useDeleteCoupon() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => couponsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon deleted successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
