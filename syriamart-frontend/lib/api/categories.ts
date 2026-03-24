/**
 * lib/api/categories.ts
 * GET endpoints are public (no auth). POST/PUT/DELETE require ROLE_ADMIN.
 */
import { apiClient as api } from "@/lib/api/client";
import type { CategoryTreeResponse, CategoryResponse } from "@/types/api";
import { MOCK_CATEGORIES } from "./mockData";

export const categoriesApi = {
  /**
   * GET /api/categories
   * Returns root categories, each with their subCategories array.
   * Used by: Mega-Menu, Homepage Category Showcase, Product filter sidebar.
   * ISR-cached for 10 minutes.
   */
  getTree: async (token?: string) => {
    try {
      return await api.get<CategoryTreeResponse[]>("/api/categories", {
        skipAuth: true,
        token,
        next: { revalidate: 600, tags: ["categories"] },
      });
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  /** Alias kept for backwards compatibility */
  getAll: async (token?: string) => {
    try {
      return await api.get<CategoryTreeResponse[]>("/api/categories", {
        skipAuth: true,
        token,
        next: { revalidate: 600, tags: ["categories"] },
      });
    } catch {
      return MOCK_CATEGORIES;
    }
  },

  /** GET /api/categories/{id} */
  getById: (id: string) =>
    api.get<CategoryResponse>(`/api/categories/${id}`, {
      skipAuth: true,
      next: { revalidate: 600, tags: [`category-${id}`] },
    }),

  // ── Admin CRUD ────────────────────────────────────────────────────────────

  /** POST /api/categories */
  create: (data: unknown) =>
    api.post<CategoryResponse>("/api/categories", { body: data }),

  /** PUT /api/categories/{id} */
  update: (id: string, data: unknown) =>
    api.put<CategoryResponse>(`/api/categories/${id}`, { body: data }),

  /** DELETE /api/categories/{id} */
  delete: (id: string) =>
    api.delete<void>(`/api/categories/${id}`),

  /** POST /api/categories/{categoryId}/sub-categories */
  createSub: (categoryId: string, data: unknown) =>
    api.post<CategoryResponse>(`/api/categories/${categoryId}/sub-categories`, { body: data }),

  /** PUT /api/categories/sub-categories/{subId} */
  updateSub: (subId: string, data: unknown) =>
    api.put<CategoryResponse>(`/api/categories/sub-categories/${subId}`, { body: data }),

  /** DELETE /api/categories/sub-categories/{subId} */
  deleteSub: (subId: string) =>
    api.delete<void>(`/api/categories/sub-categories/${subId}`),
};
