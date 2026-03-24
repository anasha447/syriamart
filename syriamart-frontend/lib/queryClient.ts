import { QueryClient } from "@tanstack/react-query";

/**
 * Server-side QueryClient factory.
 * Called in RSC pages that prefetch data for <HydrationBoundary>.
 *
 * Each RSC render gets a fresh instance — never reuse across requests
 * (shared instances cause cross-request cache pollution in SSR).
 *
 * Usage in a RSC page:
 *
 *   import { makeServerQueryClient } from "@/lib/queryClient";
 *   import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
 *   import { productsApi } from "@/lib/api/products";
 *
 *   export default async function ProductPage({ params }) {
 *     const qc = makeServerQueryClient();
 *     await qc.prefetchQuery({
 *       queryKey: ["product", params.slug],
 *       queryFn:  () => productsApi.getBySlug(params.slug),
 *     });
 *
 *     return (
 *       <HydrationBoundary state={dehydrate(qc)}>
 *         <ProductDetail slug={params.slug} />
 *       </HydrationBoundary>
 *     );
 *   }
 *
 * The client-side QueryClient lives in components/providers.tsx.
 * When HydrationBoundary renders on the client, it seeds the client cache
 * with the prefetched data — the CSR component shows data instantly,
 * no loading spinner on first paint.
 */
export function makeServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // On the server we never want to retry — fail fast and let
        // the error boundary handle it (or show a loading state on client)
        retry:     false,
        staleTime: 60 * 1000, // 60 seconds
      },
    },
  });
}

/**
 * Standard query key factory — keeps query keys consistent across
 * hooks and prefetch calls so cache hits work correctly.
 */
export const queryKeys = {
  // ── Products ──────────────────────────────────────────────────────────────
  products: {
    all:          () => ["products"]                                          as const,
    bySlug:       (slug: string)      => ["products", "slug", slug]          as const,
    byId:         (id: string)        => ["products", "id", id]              as const,
    search:       (q: string, p = 0)  => ["products", "search", q, p]       as const,
    byCategory:   (id: string, p = 0) => ["products", "category", id, p]    as const,
    bySubCat:     (id: string, p = 0) => ["products", "sub-category", id, p] as const,
    topSelling:   ()                  => ["products", "top-selling"]          as const,
    topRated:     ()                  => ["products", "top-rated"]            as const,
    mine:         (p = 0)             => ["products", "mine", p]              as const,
    modQueue:     ()                  => ["products", "moderation-queue"]     as const,
  },

  // ── Categories ────────────────────────────────────────────────────────────
  categories: {
    tree:   () => ["categories", "tree"]   as const,
    all:    () => ["categories"]           as const,
    byId:   (id: string) => ["categories", id] as const,
  },

  // ── Cart ─────────────────────────────────────────────────────────────────
  cart: {
    get: (userId: string) => ["cart", userId] as const,
  },

  // ── Orders ────────────────────────────────────────────────────────────────
  orders: {
    mine:        (p = 0)     => ["orders", "mine", p]        as const,
    byId:        (id: string) => ["orders", id]               as const,
    seller:      (p = 0)     => ["orders", "seller", p]      as const,
    admin:       (status: string | undefined, p = 0) => ["orders", "admin", status, p] as const,
  },

  // ── Reviews ───────────────────────────────────────────────────────────────
  reviews: {
    summary:  (productId: string)         => ["reviews", "summary",  productId] as const,
    approved: (productId: string, p = 0)  => ["reviews", "approved", productId, p] as const,
    mine:     (p = 0)                     => ["reviews", "mine", p]              as const,
  },

  // ── Wishlists ─────────────────────────────────────────────────────────────
  wishlists: {
    mine:    () => ["wishlists", "mine"]  as const,
    default: () => ["wishlists", "default"] as const,
  },

  // ── Coupons ───────────────────────────────────────────────────────────────
  coupons: {
    seller:   (p = 0) => ["coupons", "seller", p]   as const,
    platform: (p = 0) => ["coupons", "platform", p] as const,
    validate: (code: string) => ["coupons", "validate", code] as const,
    discounts: (productId: string) => ["discounts", productId] as const,
  },

  // ── Dashboards ────────────────────────────────────────────────────────────
  seller: {
    dashboard:  () => ["seller", "dashboard"]                      as const,
    analytics:  () => ["seller", "analytics"]                      as const,
    monthly:    (y: number, m: number) => ["seller", "analytics", y, m] as const,
  },

  admin: {
    dashboard:  () => ["admin", "dashboard"]                       as const,
    revenue:    (months: number) => ["admin", "revenue", months]   as const,
    sellers:    (p = 0) => ["admin", "sellers", p]                 as const,
    users:      (q: string | undefined, p = 0) => ["admin", "users", q, p] as const,
    warehouse:  () => ["admin", "warehouse"]                       as const,
  },

  // ── Driver ────────────────────────────────────────────────────────────────
  driver: {
    profile:      () => ["driver", "profile"]                as const,
    dashboard:    () => ["driver", "dashboard"]              as const,
    orders:       () => ["driver", "orders"]                 as const,
    shift:        () => ["driver", "shift"]                  as const,
    messages:     (adminId: string) => ["driver", "messages", adminId] as const,
    unread:       () => ["driver", "unread"]                 as const,
    payout:       () => ["driver", "payout"]                 as const,
  },

  // ── Tracking ─────────────────────────────────────────────────────────────
  tracking: {
    byOrderId: (id: string) => ["tracking", id] as const,
  },

  // ── Pickup points ─────────────────────────────────────────────────────────
  pickupPoints: {
    all:     () => ["pickup-points"]           as const,
    byCity:  (city: string) => ["pickup-points", city] as const,
  },
} as const;
