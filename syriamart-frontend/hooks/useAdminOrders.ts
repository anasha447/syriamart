"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";

export function useAdminAllOrders(status?: string, page = 0) {
  return useQuery({
    queryKey: ["admin", "orders", status, page],
    queryFn: () => ordersApi.getAllOrders(status === "ALL" ? undefined : status, page, 20),
    staleTime: 60 * 1000,
  });
}

export function useAdminUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      ordersApi.adminUpdateStatus(orderId, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "orders"] });
      toast.success("Order status updated");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
