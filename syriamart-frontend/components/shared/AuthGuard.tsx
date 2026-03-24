"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore, type UserRole } from "@/lib/store/auth.store";

interface AuthGuardProps {
  children:      React.ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?:   string;
}

/**
 * Client-side authentication guard for protected route groups.
 * Used by (customer), (seller), and (admin) layouts.
 */
export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = "/",
}: AuthGuardProps) {
  const router          = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole        = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (!isAuthenticated) {
      const returnTo = encodeURIComponent(
        window.location.pathname + window.location.search
      );
      router.replace(`/login?returnTo=${returnTo}`);
      return;
    }
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      router.replace(redirectTo);
    }
  }, [isAuthenticated, userRole, allowedRoles, redirectTo, router]);

  if (!isAuthenticated) return null;
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) return null;

  return <>{children}</>;
}
