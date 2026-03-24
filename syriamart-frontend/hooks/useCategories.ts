"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import { queryKeys } from "@/lib/queryClient";

/**
 * Fetches the full category tree.
 * Used by: Mega-Menu, Home category showcase, Product filter sidebar.
 * staleTime: 10 min — category tree changes very rarely.
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: queryKeys.categories.tree(),
    queryFn:  () => categoriesApi.getTree(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetches all categories (flat list — no sub-categories).
 */
export function useAllCategories() {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn:  () => categoriesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Single category by ID.
 */
export function useCategoryById(id: string) {
  return useQuery({
    queryKey: queryKeys.categories.byId(id),
    queryFn:  () => categoriesApi.getById(id),
    staleTime: 10 * 60 * 1000,
    enabled:  !!id,
  });
}

// ── Admin Mutations ─────────────────────────────────────────────────────────

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/lib/api/admin";
import { getErrorMessage } from "@/lib/api/client";

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string; imageUrl?: string }) => adminApi.createCategory(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.tree() });
      toast.success("Category created");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useUpdateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string; imageUrl?: string } }) => adminApi.updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.tree() });
      toast.success("Category updated");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useDeleteCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.tree() });
      toast.success("Category deleted");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useCreateSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ categoryId, data }: { categoryId: string; data: { name: string; description?: string } }) => adminApi.createSubCategory(categoryId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.tree() });
      toast.success("Sub-category created");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useUpdateSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { name: string; description?: string } }) => adminApi.updateSubCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.tree() });
      toast.success("Sub-category updated");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useDeleteSubCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteSubCategory(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.categories.tree() });
      toast.success("Sub-category deleted");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
