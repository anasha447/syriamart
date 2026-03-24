"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { sellerApi } from "@/lib/api/seller";
import { getErrorMessage } from "@/lib/api/client";
import type { SellerProfileUpdateRequest } from "@/types/api";

export const sellerKeys = {
  profile: ["seller", "profile"] as const,
  dashboard: ["seller", "dashboard"] as const,
  analytics: ["seller", "analytics"] as const,
};

export function useSellerProfile() {
  return useQuery({
    queryKey: sellerKeys.profile,
    queryFn: sellerApi.getMyProfile,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateSellerProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: SellerProfileUpdateRequest) => sellerApi.updateProfile(data),
    onSuccess: (updatedProfile) => {
      qc.setQueryData(sellerKeys.profile, updatedProfile);
      toast.success("Profile updated successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
