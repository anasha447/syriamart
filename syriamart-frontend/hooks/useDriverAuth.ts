"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { driverApi } from "@/lib/api/driver";
import { useDriverStore } from "@/lib/store/driver.store";
import { queryKeys } from "@/lib/queryClient";
import { getErrorMessage } from "@/lib/api/client";
import type { DriverLoginRequest } from "@/types/api";

export function useDriverLogin() {
  const router      = useRouter();
  const loginDriver = useDriverStore((s) => s.loginDriver);

  return useMutation({
    mutationFn: (data: DriverLoginRequest) => driverApi.login(data),
    onSuccess: (response) => {
      loginDriver(
        {
          driverId:  response.driverId,
          firstName: response.firstName,
          lastName:  response.lastName,
          email:     response.email,
          phone:     response.phone,
          status:    response.status,
        },
        response.token
      );
      toast.success(`Welcome back, ${response.firstName}!`);
      router.replace("/driver/dashboard");
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDriverLogout() {
  const router       = useRouter();
  const logoutDriver = useDriverStore((s) => s.logoutDriver);
  const qc           = useQueryClient();

  return useMutation({
    mutationFn: async () => Promise.resolve(),
    onSettled: () => {
      logoutDriver();
      qc.removeQueries({ queryKey: ["driver"] });
      router.replace("/driver/login");
    },
  });
}

export function useDriverProfile() {
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.driver.profile(),
    queryFn:  driverApi.getMyProfile,
    enabled:  isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useDriverDashboard() {
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: queryKeys.driver.dashboard(),
    queryFn:  driverApi.getDashboard,
    enabled:  isAuthenticated,
    staleTime: 60 * 1000,
    refetchInterval: 60 * 1000,
  });
}
