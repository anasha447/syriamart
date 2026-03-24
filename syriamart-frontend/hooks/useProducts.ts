"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "@/lib/api/products";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";

// ── Public catalog ──────────────────────────────────────────────────────────

export function useProductBySlug(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.bySlug(slug),
    queryFn:  () => productsApi.getBySlug(slug),
    staleTime: 60 * 1000,
    enabled:   !!slug,
  });
}

export function useProductSearch(query: string, page = 0) {
  return useQuery({
    queryKey: queryKeys.products.search(query, page),
    queryFn:  () => productsApi.search(query, page),
    enabled:  query.trim().length > 1,  // Don't search single characters
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,    // Keep old results while new ones load
  });
}

export function useProductsByCategory(categoryId: string, page = 0) {
  return useQuery({
    queryKey: queryKeys.products.byCategory(categoryId, page),
    queryFn:  () => productsApi.byCategory(categoryId, page),
    enabled:  !!categoryId,
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useTopSelling(limit = 10) {
  return useQuery({
    queryKey: queryKeys.products.topSelling(),
    queryFn:  () => productsApi.topSelling(limit),
    staleTime: 5 * 60 * 1000,
  });
}

export function useTopRated(limit = 10) {
  return useQuery({
    queryKey: queryKeys.products.topRated(),
    queryFn:  () => productsApi.topRated(limit),
    staleTime: 5 * 60 * 1000,
  });
}

// ── Seller product management ───────────────────────────────────────────────

export function useMyProducts(page = 0) {
  return useQuery({
    queryKey: queryKeys.products.mine(page),
    queryFn:  () => productsApi.getMyProducts(page),
    staleTime: 30 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: unknown) => productsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.mine() });
      qc.invalidateQueries({ queryKey: queryKeys.seller.dashboard() });
      toast.success("Product created! It will be reviewed shortly.");
    },
    onError: (error) => { toast.error(getErrorMessage(error)); },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: unknown }) =>
      productsApi.update(id, data),
    onSuccess: (updated) => {
      qc.invalidateQueries({ queryKey: queryKeys.products.mine() });
      qc.setQueryData(queryKeys.products.byId(updated.id), updated);
      toast.success("Product updated. Re-submission for review has been triggered.");
    },
    onError: (error) => { toast.error(getErrorMessage(error)); },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.mine() });
      toast.success("Product archived successfully.");
    },
    onError: (error) => { toast.error(getErrorMessage(error)); },
  });
}

// ── Admin moderation ────────────────────────────────────────────────────────

export function useModerationQueue() {
  return useQuery({
    queryKey: queryKeys.products.modQueue(),
    queryFn:  productsApi.getModerationQueue,
    // Refetch every 60s so the admin sees new submissions without a page refresh
    refetchInterval: 60 * 1000,
  });
}

export function useModerateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status, reason }: { id: string; status: string; reason?: string }) =>
      productsApi.moderate(id, { status, rejectionReason: reason }),
    onSuccess: (_, { status }) => {
      qc.invalidateQueries({ queryKey: queryKeys.products.modQueue() });
      qc.invalidateQueries({ queryKey: queryKeys.admin.dashboard() });
      toast.success(status === "ACTIVE" ? "Product approved!" : "Product rejected.");
    },
    onError: (error) => { toast.error(getErrorMessage(error)); },
  });
}
