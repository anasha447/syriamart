"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type UserRole = "CUSTOMER" | "SELLER" | "ADMIN" | "DRIVER";

export interface AuthUser {
  userId:     string;
  email:      string;
  role:       UserRole;
  firstName?: string;
  lastName?:  string;
  storeName?: string;
}

interface AuthState {
  user:            AuthUser | null;
  token:           string | null;
  isAuthenticated: boolean;
  hasHydrated:     boolean;

  // Actions — multiple alias names for compatibility across components
  login:       (user: AuthUser, token: string) => void;
  setAuth:     (user: AuthUser, token: string) => void; // alias
  logout:      () => void;
  clearAuth:   () => void; // alias
  clearUser:   () => void; // alias
  updateUser:  (partial: Partial<AuthUser>) => void;
  setHydrated: () => void;

  // Role helpers
  isCustomer: () => boolean;
  isSeller:   () => boolean;
  isAdmin:    () => boolean;
  hasRole:    (role: UserRole) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      user:            null,
      token:           null,
      isAuthenticated: false,
      hasHydrated:     false,

      login: (user, token) =>
        set((s) => { s.user = user; s.token = token; s.isAuthenticated = true; }),

      setAuth: (user, token) =>
        set((s) => { s.user = user; s.token = token; s.isAuthenticated = true; }),

      logout: () =>
        set((s) => { s.user = null; s.token = null; s.isAuthenticated = false; }),

      clearAuth: () =>
        set((s) => { s.user = null; s.token = null; s.isAuthenticated = false; }),

      clearUser: () =>
        set((s) => { s.user = null; s.token = null; s.isAuthenticated = false; }),

      updateUser: (partial) =>
        set((s) => { if (s.user) Object.assign(s.user, partial); }),

      setHydrated: () => set((s) => { s.hasHydrated = true; }),

      isCustomer: () => get().user?.role === "CUSTOMER",
      isSeller:   () => get().user?.role === "SELLER",
      isAdmin:    () => get().user?.role === "ADMIN",
      hasRole:    (role) => get().user?.role === role,
    })),
    {
      name: "syriamart-auth",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        user:            state.user,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => { state?.setHydrated(); },
    }
  )
);

export const useCurrentUser  = () => useAuthStore((s) => s.user);
export const useAuthToken    = () => useAuthStore((s) => s.token);
export const useIsAuth       = () => useAuthStore((s) => s.isAuthenticated);
export const useUserRole     = () => useAuthStore((s) => s.user?.role ?? null);
