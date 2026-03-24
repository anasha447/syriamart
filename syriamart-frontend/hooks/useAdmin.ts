"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";
import type { SellerApprovalRequest } from "@/types/api";

// ── Users ──────────────────────────────────────────────────────────────
export function useAdminUsers() {
  return useQuery({
    queryKey: ["admin", "users"],
    queryFn: adminApi.getUsers,
  });
}

export function useAdminBanUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, reason }: { userId: string; reason: string }) =>
      adminApi.banUser(userId, reason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success("User successfully banned.");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

// ── Sellers ────────────────────────────────────────────────────────────
export function useAdminSellers(status: "all" | "pending") {
  return useQuery({
    queryKey: ["admin", "sellers", status],
    queryFn: status === "pending" ? adminApi.getPendingSellers : adminApi.getAllSellers,
  });
}

export function useAdminApproveSeller() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ sellerId, data }: { sellerId: string; data: SellerApprovalRequest }) =>
      adminApi.approveSeller(sellerId, data),
    onSuccess: (_, { data }) => {
      qc.invalidateQueries({ queryKey: ["admin", "sellers"] });
      toast.success(data.approved ? "Seller approved successfully." : "Seller application rejected.");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

// ── Drivers ────────────────────────────────────────────────────────────
export function useAdminDrivers() {
  return useQuery({
    queryKey: ["admin", "drivers"],
    queryFn: adminApi.getDrivers,
  });
}

export function useAdminRegisterDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => adminApi.registerDriver(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "drivers"] });
      toast.success("Driver registered successfully");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useAdminSetDriverStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => adminApi.setDriverStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "drivers"] });
      toast.success("Driver status updated");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

