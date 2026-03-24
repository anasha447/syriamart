"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";
import type { CheckoutRequest } from "@/types/api";

// ── Customer ────────────────────────────────────────────────────────────────

export function useMyOrders(page = 0) {
  return useQuery({
    queryKey: queryKeys.orders.mine(page),
    queryFn:  () => ordersApi.getMyOrders(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useOrderById(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.byId(orderId),
    queryFn:  () => ordersApi.getById(orderId),
    enabled:  !!orderId,
    staleTime: 30 * 1000,
  });
}

export function useCheckout() {
  const router = useRouter();
  const qc     = useQueryClient();

  return useMutation({
    mutationFn: (data: CheckoutRequest) => ordersApi.checkout(data),

    onSuccess: (result) => {
      // Invalidate cart (now empty) and order list
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: queryKeys.orders.mine() });
      toast.success("Order placed successfully!");
      router.push(`/checkout/success?orderId=${result.orderId}`);
    },

    onError: (error) => {
      toast.error(getErrorMessage(error));
    },
  });
}

export function useCancelOrder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => ordersApi.cancel(orderId),
    onSuccess: (_, orderId) => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.mine() });
      qc.invalidateQueries({ queryKey: queryKeys.orders.byId(orderId) });
      toast.success("Order cancelled successfully.");
    },
    onError: (error) => { toast.error(getErrorMessage(error)); },
  });
}

// ── Seller ──────────────────────────────────────────────────────────────────

export function useSellerOrders(page = 0) {
  return useQuery({
    queryKey: queryKeys.orders.seller(page),
    queryFn:  () => ordersApi.getSellerOrders(page),
    staleTime: 30 * 1000,
    // Auto-refresh the seller order feed every 2 minutes for live feel
    refetchInterval: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useUpdateOrderItemStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      itemId, status, sellerNote,
    }: { itemId: string; status: string; sellerNote?: string }) =>
      ordersApi.updateItemStatus(itemId, status, sellerNote),

    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.orders.seller() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.dashboard() });
      toast.success("Order status updated.");
    },
    onError: (error) => { toast.error(getErrorMessage(error)); },
  });
}

// ── Admin ────────────────────────────────────────────────────────────────────

export function useAllOrders(status?: string, page = 0) {
  return useQuery({
    queryKey: queryKeys.orders.admin(status, page),
    queryFn:  () => ordersApi.getAllOrders(status, page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}
