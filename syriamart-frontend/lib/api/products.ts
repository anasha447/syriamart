import { apiClient as api } from "@/lib/api/client";
import type {
  ProductDetailResponse,
  ProductListResponse,
  ProductCatalogResponse,
  ProductSearchResponse,
  ProductModerationQueueResponse,
  ProductSummaryResponse,
} from "@/types/api";
import { MOCK_TOP_SELLING, MOCK_TOP_RATED } from "./mockData";

/**
 * Products API module.
 * Public GET endpoints use skipAuth + Next.js cache options for ISR/SSG.
 * Seller mutation endpoints require ROLE_SELLER JWT (attached by client.ts).
 */
export const productsApi = {
  // ── Public / Catalog (ISR-safe) ──────────────────────────────────────────

  getBySlug: async (slug: string, token?: string) => {
    try {
      return await api.get<ProductDetailResponse>(`/api/products/slug/${slug}`, {
        skipAuth: !token,
        token,
        next: { revalidate: 60, tags: [`product-${slug}`] },
      });
    } catch (error) {
      const mock = [...MOCK_TOP_SELLING, ...MOCK_TOP_RATED].find((p) => p.slug === slug);
      if (mock) return mock;
      throw error;
    }
  },

  getById: (id: string, token?: string) =>
    api.get<ProductDetailResponse>(`/api/products/${id}`, {
      skipAuth: !token,
      token,
      next: { revalidate: 60, tags: [`product-${id}`] },
    }),

  search: (query: string, page = 0, size = 20) =>
    api.get<ProductSearchResponse>(
      `/api/products/search?q=${encodeURIComponent(query)}&page=${page}&size=${size}`,
      { skipAuth: true, cache: "no-store" }
    ),

  /** GET /api/products/category/{categoryId} */
  byCategory: (categoryId: string, page = 0, size = 24) =>
    api.get<ProductCatalogResponse>(
      `/api/products/category/${categoryId}?page=${page}&size=${size}`,
      { skipAuth: true, next: { revalidate: 120, tags: [`category-${categoryId}`] } }
    ),

  /** GET /api/products/sub-category/{subCategoryId} */
  bySubCategory: (subCategoryId: string, page = 0, size = 24) =>
    api.get<ProductCatalogResponse>(
      `/api/products/sub-category/${subCategoryId}?page=${page}&size=${size}`,
      { skipAuth: true, next: { revalidate: 120 } }
    ),

  /** GET /api/products/seller/{sellerId} — public storefront */
  bySeller: (sellerId: string, page = 0, size = 20) =>
    api.get<ProductListResponse>(
      `/api/products/seller/${sellerId}?page=${page}&size=${size}`,
      { skipAuth: true, next: { revalidate: 120, tags: [`seller-${sellerId}`] } }
    ),

  topSelling: async (limit = 10) => {
    try {
      return await api.get<ProductListResponse>(`/api/products/top-selling?limit=${limit}`, {
        skipAuth: true,
        next: { revalidate: 300, tags: ["top-selling"] },
      });
    } catch {
      return { products: MOCK_TOP_SELLING.slice(0, limit), totalElements: Math.min(MOCK_TOP_SELLING.length, limit), page: 0, size: limit, totalPages: 1 };
    }
  },

  topRated: async (limit = 10) => {
    try {
      return await api.get<ProductListResponse>(`/api/products/top-rated?limit=${limit}`, {
        skipAuth: true,
        next: { revalidate: 300, tags: ["top-rated"] },
      });
    } catch {
      return { products: MOCK_TOP_RATED.slice(0, limit), totalElements: Math.min(MOCK_TOP_RATED.length, limit), page: 0, size: limit, totalPages: 1 };
    }
  },

  // ── Seller ───────────────────────────────────────────────────────────────

  /** GET /api/products/my */
  getMyProducts: (page = 0, size = 20) =>
    api.get<ProductListResponse>(`/api/products/my?page=${page}&size=${size}`),

  create: (data: unknown) =>
    api.post<ProductDetailResponse>("/api/products", { body: data }),

  update: (id: string, data: unknown) =>
    api.put<ProductDetailResponse>(`/api/products/${id}`, { body: data }),

  delete: (id: string) =>
    api.delete<void>(`/api/products/${id}`),

  addImages: (id: string, data: unknown[]) =>
    api.post<ProductDetailResponse>(`/api/products/${id}/images`, { body: data }),

  removeImage: (productId: string, imageId: string) =>
    api.delete<void>(`/api/products/${productId}/images/${imageId}`),

  setVariations: (id: string, data: unknown[]) =>
    api.put<ProductDetailResponse>(`/api/products/${id}/variations`, { body: data }),

  // ── Admin ────────────────────────────────────────────────────────────────

  /** GET /api/products/admin/moderation-queue */
  getModerationQueue: () =>
    api.get<ProductModerationQueueResponse>("/api/products/admin/moderation-queue"),

  /** PATCH /api/products/admin/{id}/moderate */
  moderate: (id: string, data: { status: string; rejectionReason?: string }) =>
    api.patch<ProductDetailResponse>(`/api/products/admin/${id}/moderate`, { body: data }),
};
