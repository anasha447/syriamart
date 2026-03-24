/**
 * lib/api/driver.ts
 *
 * All driver API calls use the DRIVER JWT from driver.store,
 * NOT the customer/seller JWT from auth.store.
 * Token is read directly from localStorage to avoid store circular deps.
 */
import { apiClient as api, type RequestOptions } from "@/lib/api/client";
import type {
  DriverProfileResponse,
  DriverDashboardResponse,
  DriverPerformanceResponse,
  ScanConfirmationResponse,
  AssignedOrderResponse,
  ShiftSummaryResponse,
  PayoutResponse,
} from "@/types/api";

// ── Driver token helper ────────────────────────────────────────────────────
function getDriverToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem("syriamart-driver");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { token?: string } };
    return parsed?.state?.token ?? null;
  } catch {
    return null;
  }
}

function driverOpts(extra?: Partial<RequestOptions>): RequestOptions {
  return { ...extra, token: getDriverToken() ?? undefined, skipAuth: false };
}

export interface DriverRegisterRequest {
  fullName:      string;
  email:         string;
  phone:         string;
  password:      string;
  vehicleType:   "MOTORCYCLE" | "CAR" | "VAN" | "TRUCK";
  licensePlate:  string;
  licenseNumber: string;
  city:          string;
}

export interface DriverUpgradeRequest {
  fullName:      string;
  phone:         string;
  vehicleType:   "MOTORCYCLE" | "CAR" | "VAN" | "TRUCK";
  licensePlate:  string;
  licenseNumber: string;
  city:          string;
}

export const driverApi = {
  // ── Auth (public) ─────────────────────────────────────────────────────────

  /** POST /api/driver/auth/login → { token, type } */
  login: (data: { email: string; password: string }) =>
    api.post<{ token: string; type: string }>("/api/driver/auth/login", {
      body: data,
      skipAuth: true,
    }),

  /**
   * POST /api/driver/register
   * Public endpoint: creates a new driver account from scratch.
   */
  register: (data: DriverRegisterRequest) =>
    api.post<{ message: string }>("/api/driver/register", {
      body: data,
      skipAuth: true,
    }),

  /**
   * POST /api/driver/apply
   * Authenticated CUSTOMER upgrades to driver role (no new account).
   */
  applyAsDriver: (data: DriverUpgradeRequest) =>
    api.post<{ message: string }>("/api/driver/apply", { body: data }),

  // ── Profile ──────────────────────────────────────────────────────────────

  /** GET /api/driver/me */
  getMyProfile: () =>
    api.get<DriverProfileResponse>("/api/driver/me", driverOpts()),

  /** PUT /api/driver/me */
  updateProfile: (data: unknown) =>
    api.put<DriverProfileResponse>("/api/driver/me", driverOpts({ body: data })),

  // ── Status & Location ────────────────────────────────────────────────────

  /** PUT /api/driver/status */
  updateStatus: (status: string) =>
    api.put<void>("/api/driver/status", driverOpts({ body: { status } })),

  /** PUT /api/driver/location */
  updateLocation: (latitude: number, longitude: number) =>
    api.put<void>("/api/driver/location", driverOpts({ body: { latitude, longitude } })),

  // ── Scanning ─────────────────────────────────────────────────────────────

  /** POST /api/driver/scan */
  scanPackage: (data: { barcode: string; scanType: string; notes?: string }) =>
    api.post<ScanConfirmationResponse>("/api/driver/scan", driverOpts({ body: data })),

  /** POST /api/driver/orders/{orderId}/deliver */
  submitDeliveryProof: (orderId: string, data: { notes?: string; recipientName?: string }) =>
    api.post<ScanConfirmationResponse>(
      `/api/driver/orders/${orderId}/deliver`,
      driverOpts({ body: data })
    ),

  // ── Orders & Route ────────────────────────────────────────────────────────

  /** GET /api/driver/orders */
  getMyActiveOrders: () =>
    api.get<AssignedOrderResponse[]>("/api/driver/orders", driverOpts()),

  /** POST /api/driver/route/optimize */
  optimizeRoute: (data: { orderIds: string[]; currentLatitude?: number; currentLongitude?: number }) =>
    api.post("/api/driver/route/optimize", driverOpts({ body: data })),

  // ── Shift ────────────────────────────────────────────────────────────────

  /** POST /api/driver/shift/start */
  startShift: () =>
    api.post<ShiftSummaryResponse>("/api/driver/shift/start", driverOpts()),

  /** POST /api/driver/shift/end */
  endShift: () =>
    api.post<ShiftSummaryResponse>("/api/driver/shift/end", driverOpts()),

  /** GET /api/driver/shift/current */
  getCurrentShift: () =>
    api.get<ShiftSummaryResponse>("/api/driver/shift/current", driverOpts()),

  // ── Dashboard & Analytics ─────────────────────────────────────────────────

  /** GET /api/driver/dashboard */
  getDashboard: () =>
    api.get<DriverDashboardResponse>("/api/driver/dashboard", driverOpts()),

  /** GET /api/driver/performance */
  getPerformance: () =>
    api.get<DriverPerformanceResponse>("/api/driver/performance", driverOpts()),

  /** GET /api/driver/payout */
  getPayoutInfo: () =>
    api.get<PayoutResponse>("/api/driver/payout", driverOpts()),
};
