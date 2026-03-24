"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { wishlistsApi } from "@/lib/api/wishlists";
import { queryKeys } from "@/lib/queryClient";
import { useAuthStore } from "@/lib/store/auth.store";
import { getErrorMessage } from "@/lib/api/client";

export function useWishlists() {
  const isAuth = useAuthStore((s) => s.isAuthenticated);
  return useQuery({
    queryKey: queryKeys.wishlists.mine(),
    queryFn:  wishlistsApi.getAll,
    enabled:  isAuth,
    staleTime: 2 * 60 * 1000,
  });
}

export function useAddToWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wishlistId, productId }: { wishlistId: string; productId: string }) =>
      wishlistsApi.addItem(wishlistId, productId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlists.mine() });
      toast.success("Added to wishlist");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useRemoveFromWishlist() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ wishlistId, itemId }: { wishlistId: string; itemId: string }) =>
      wishlistsApi.removeItem(wishlistId, itemId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlists.mine() });
      toast.success("Removed from wishlist");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}

export function useMoveToCart() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (wishlistId: string) => wishlistsApi.moveToCart(wishlistId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.wishlists.mine() });
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Moved all items to cart");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });
}
