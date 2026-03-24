import { apiClient as api } from "@/lib/api/client";
import type {
  AuthenticationResponse,
  UserLoginRequest,
  UserRegistrationRequest,
  UserProfileResponse,
  UserProfileUpdateRequest,
} from "@/types/api";

/**
 * Authentication API module.
 * All calls route through the Spring Cloud Gateway → user-service.
 * No token is needed for login/register (public endpoints).
 */
export const authApi = {
  login: (data: UserLoginRequest) =>
    api.post<AuthenticationResponse>("/api/auth/login", {
      body:     data,
      skipAuth: true,
    }),

  registerCustomer: (data: UserRegistrationRequest) =>
    api.post<string>("/api/auth/register/customer", {
      body:     data,
      skipAuth: true,
    }),

  registerSeller: (data: UserRegistrationRequest & { storeName: string; storeDescription?: string }) =>
    api.post<string>("/api/auth/register/seller", {
      body:     data,
      skipAuth: true,
    }),

  /** POST /api/auth/logout — sends token in Authorization header */
  logout: (token: string) =>
    api.post<string>("/api/auth/logout", {
      headers: { Authorization: `Bearer ${token}` },
    }),

  /** GET /api/users/profile — ROLE_CUSTOMER */
  getMyProfile: () =>
    api.get<UserProfileResponse>("/api/users/profile"),

  /** PUT /api/users/profile — ROLE_CUSTOMER or ROLE_DRIVER */
  updateMyProfile: (data: UserProfileUpdateRequest) =>
    api.put<UserProfileResponse>("/api/users/profile", { body: data }),
};
