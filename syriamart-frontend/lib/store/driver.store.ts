import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type DriverStatus = "OFFLINE" | "AVAILABLE" | "ON_DELIVERY" | "ON_BREAK" | "SUSPENDED";

export interface DriverSession {
  driverId:    string;
  email:       string;
  firstName:   string;
  lastName:    string;
  phone:       string;
  status:      DriverStatus;
  currentShiftId?: string;
}

interface DriverState {
  driver:          DriverSession | null;
  token:           string | null;
  isAuthenticated: boolean;
  hasHydrated:     boolean;
  activeOrderIds:  string[];

  // Actions
  loginDriver:       (driver: DriverSession, token: string) => void;
  logoutDriver:      () => void;
  updateStatus:      (status: DriverStatus) => void;
  setShiftId:        (shiftId: string | undefined) => void;
  setShift:          (shiftId: string | null) => void; // alias
  setActiveOrders:   (orderIds: string[]) => void;
  setHydrated:       () => void;
}

/**
 * Separate Zustand slice for driver authentication.
 * Completely isolated from useAuthStore so customer/seller sessions
 * are never mixed with driver sessions in localStorage.
 */
export const useDriverStore = create<DriverState>()(
  persist(
    (set) => ({
      driver:          null,
      token:           null,
      isAuthenticated: false,
      hasHydrated:     false,
      activeOrderIds:  [],

      loginDriver: (driver, token) =>
        set({ driver, token, isAuthenticated: true }),

      logoutDriver: () =>
        set({
          driver: null, token: null,
          isAuthenticated: false, activeOrderIds: [],
        }),

      updateStatus: (status) =>
        set((s) => ({
          driver: s.driver ? { ...s.driver, status } : null,
        })),

      setShift: (shiftId) =>
        set((s) => { if (s.driver) s.driver.currentShiftId = shiftId ?? undefined; }),

      setShiftId: (currentShiftId) =>
        set((s) => ({
          driver: s.driver ? { ...s.driver, currentShiftId } : null,
        })),

      setActiveOrders: (activeOrderIds) => set({ activeOrderIds }),

      setHydrated: () => set({ hasHydrated: true }),
    }),
    {
      name:    "syriamart-driver",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        driver:          state.driver,
        token:           state.token,
        isAuthenticated: state.isAuthenticated,
        activeOrderIds:  state.activeOrderIds,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);

// ── Selector hooks ─────────────────────────────────────────────────────────────
export const useDriverToken  = () => useDriverStore((s) => s.token);
export const useDriverStatus = () => useDriverStore((s) => s.driver?.status ?? "OFFLINE");
export const useIsOnShift    = () => useDriverStore((s) => s.currentShiftId !== null);

// ── Compatibility aliases (used in hooks/useDriverAuth.ts) ──────────────────
// These wrap the store actions so external code can use either naming convention.
export function useSetDriverAuth() {
  return useDriverStore((s) => ({
    setDriverAuth:   (driver: DriverSession, token: string) => s.loginDriver(driver, token),
    clearDriverAuth: () => s.logoutDriver(),
  }));
}
