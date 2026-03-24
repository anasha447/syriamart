"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient as api } from "@/lib/api/client";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";
import type { ReviewSummaryResponse, ReviewResponse } from "@/types/api";

export function useProductReviewSummary(productId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.summary(productId),
    queryFn:  () => api.get<ReviewSummaryResponse>(`/api/reviews/product/${productId}/summary`, { skipAuth: true }),
    staleTime: 2 * 60 * 1000,
    enabled:  !!productId,
  });
}

export function useProductReviews(productId: string, page = 0) {
  return useQuery({
    queryKey: queryKeys.reviews.approved(productId, page),
    queryFn:  () => api.get<ReviewResponse[]>(`/api/reviews/product/${productId}?page=${page}&size=10`, { skipAuth: true }),
    staleTime: 2 * 60 * 1000,
    enabled:  !!productId,
    placeholderData: (prev) => prev,
  });
}

export function useSubmitReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { productId: string; orderItemId: string; rating: number; comment?: string }) =>
      api.post<ReviewResponse>("/api/reviews", { body: data }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.summary(vars.productId) });
      qc.invalidateQueries({ queryKey: queryKeys.reviews.approved(vars.productId) });
      toast.success("Review submitted! It will appear after approval.");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
