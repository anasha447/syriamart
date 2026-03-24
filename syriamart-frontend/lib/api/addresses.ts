/**
 * lib/api/addresses.ts
 * Address book for CUSTOMER (required for checkout).
 * Routes through user-service via Gateway.
 */
import { apiClient as api } from "@/lib/api/client";
import type { AddressResponse } from "@/types/api";

export const addressesApi = {
  /** GET /api/users/addresses */
  getAll: () =>
    api.get<AddressResponse[]>("/api/users/addresses"),

  /** GET /api/users/addresses/{id} */
  getById: (id: string) =>
    api.get<AddressResponse>(`/api/users/addresses/${id}`),

  /** POST /api/users/addresses */
  create: (data: {
    label?: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    isDefault?: boolean;
  }) =>
    api.post<AddressResponse>("/api/users/addresses", { body: data }),

  /** PUT /api/users/addresses/{id} */
  update: (id: string, data: unknown) =>
    api.put<AddressResponse>(`/api/users/addresses/${id}`, { body: data }),

  /** DELETE /api/users/addresses/{id} */
  delete: (id: string) =>
    api.delete<void>(`/api/users/addresses/${id}`),

  /** PATCH /api/users/addresses/{id}/default */
  setDefault: (id: string) =>
    api.patch<AddressResponse>(`/api/users/addresses/${id}/default`),
};
