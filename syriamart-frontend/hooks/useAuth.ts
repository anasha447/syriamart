"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth.store";
import { useCartStore } from "@/lib/store/cart.store";
import { getErrorMessage } from "@/lib/api/client";
import type { UserLoginRequest, UserRegistrationRequest } from "@/types/api";

export function useLogin() {
  const router    = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserLoginRequest) => authApi.login(data),
    onSuccess: (response) => {
      login(
        {
          userId:    response.userId,
          email:     response.email,
          role:      response.role,
          firstName: response.firstName,
          lastName:  response.lastName,
        },
        response.token
      );
      toast.success("Welcome back!");
      const searchParams = new URLSearchParams(window.location.search);
      const returnTo     = searchParams.get("returnTo");
      router.replace(returnTo ? decodeURIComponent(returnTo) : "/");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRegisterCustomer() {
  const router    = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserRegistrationRequest) => authApi.registerCustomer(data),
    onSuccess: (response) => {
      login(
        { userId: response.userId, email: response.email, role: response.role },
        response.token
      );
      toast.success("Account created! Welcome to SyrianMart.");
      router.replace("/");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useRegisterSeller() {
  const router    = useRouter();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: UserRegistrationRequest & { storeName: string }) =>
      authApi.registerSeller(data),
    onSuccess: (response) => {
      login(
        { userId: response.userId, email: response.email, role: response.role },
        response.token
      );
      toast.success("Seller account created! Your application is under review.");
      router.replace("/seller/dashboard");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useLogout() {
  const router              = useRouter();
  const { logout, token }   = useAuthStore();
  const { clearCart }       = useCartStore();
  const qc                  = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(token ?? ""),
    onSettled: () => {
      logout();
      clearCart();
      qc.clear();
      router.replace("/login");
      toast.success("You have been signed out.");
    },
  });
}

export function useMyProfile() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const { updateUser }  = useAuthStore();

  return useQuery({
    queryKey: ["user", "profile"],
    queryFn:  () => authApi.getMyProfile(),
    enabled:  isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}
