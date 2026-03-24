import { useAuthStore } from "@/lib/store/auth.store";
import { useDriverStore } from "@/lib/store/driver.store";
import * as mocks from "./mocks";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Shape of error responses from common-lib ErrorResponse record (6-field). */
export interface ApiErrorBody {
  status: number;
  error: string;
  message: string;
  path: string;
  timestamp: string;
  details: string[] | null;
}

/** Typed error class thrown on non-2xx responses. */
export class ApiError extends Error {
  readonly status: number;
  readonly body: ApiErrorBody;

  constructor(body: ApiErrorBody) {
    super(body.message);
    this.name = "ApiError";
    this.status = body.status;
    this.body = body;
  }

  get isUnauthorized() { return this.status === 401; }
  get isNotFound() { return this.status === 404; }
  get isConflict() { return this.status === 409; }
  get isValidation() { return this.status === 400 && Array.isArray(this.body.details); }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}


// ── Environment ───────────────────────────────────────────────────────────────

const IS_SERVER = typeof window === "undefined";

function getBaseUrl(): string {
  if (IS_SERVER) {
    return process.env.INTERNAL_API_URL ?? "http://localhost:8080";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
}

// ── Token resolution ──────────────────────────────────────────────────────────

function getActiveToken(): string | null {
  if (IS_SERVER) return null;

  const authToken = useAuthStore.getState().token;
  if (authToken) return authToken;

  const driverToken = useDriverStore.getState().token;
  if (driverToken) return driverToken;

  return null;
}

// ── 401 handler ───────────────────────────────────────────────────────────────

function handleUnauthorized(requestPath: string): void {
  if (IS_SERVER) return;

  const isDriverPath = requestPath.startsWith("/api/driver");
  const loginPath = isDriverPath ? "/driver/login" : "/login";

  useAuthStore.getState().logout();
  useDriverStore.getState().logoutDriver();

  if (!window.location.pathname.startsWith(loginPath)) {
    window.location.href = `${loginPath}?session_expired=true`;
  }
}

// ── Request options ───────────────────────────────────────────────────────────

export interface RequestOptions extends Omit<RequestInit, "body"> {
  /** JSON-serializable body — Content-Type is set automatically. */
  body?: unknown;
  /** Explicit token override for SSR calls. */
  token?: string;
  /** Skip automatic token resolution from store (for public endpoints). */
  skipAuth?: boolean;
  /** Next.js ISR/cache configuration. */
  next?: { revalidate?: number | false; tags?: string[] };
}

// ── Core fetch ────────────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  // ── Mock Interceptor ────────────────────────────────────────────────────────
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") {
    if (path === "/api/auth/login") {
      const body = options.body as any;
      return mocks.loginMock(body?.email) as unknown as T;
    }
    if (path === "/api/auth/register/seller") {
      return mocks.addPendingSeller(options.body) as unknown as T;
    }
    if (path === "/api/auth/register/customer") {
      return "Customer registration successful" as unknown as T;
    }
    if (path === "/api/users/profile") {
      const token = getActiveToken();
      return mocks.getProfileMock(token || "") as unknown as T;
    }
    if (path === "/api/sellers/pending") {
      return mocks.getPendingSellers() as unknown as T;
    }
    if (path === "/api/sellers") {
      return mocks.getActiveSellers() as unknown as T;
    }
    if (path.startsWith("/api/sellers/") && path.endsWith("/approve")) {
      const parts = path.split("/");
      const id = parts[3];
      if (id) mocks.approveSeller(id);
      return undefined as unknown as T;
    }
  }

  const {
    body: rawBody,
    token: explicitToken,
    skipAuth,
    headers: extraHeaders,
    next,
    ...restOptions
  } = options;

  const url = `${getBaseUrl()}${path}`;
  const token = explicitToken ?? (skipAuth ? undefined : getActiveToken());

  const headers: Record<string, string> = {
    ...(rawBody !== undefined ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(extraHeaders as Record<string, string> | undefined),
  };

  const serializedBody = rawBody !== undefined ? JSON.stringify(rawBody) : undefined;

  let response: Response;
  try {
    response = await fetch(url, {
      ...restOptions,
      headers,
      body: serializedBody,
      ...(next ? { next } : {}),
    });
  } catch {
    throw new ApiError({
      status: 0,
      error: "Network Error",
      message: "Unable to reach the server. Please check your connection.",
      path,
      timestamp: new Date().toISOString(),
      details: null,
    });
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as unknown as T;
  }

  // Parse body
  let data: unknown;
  const ct = response.headers.get("content-type") ?? "";
  if (ct.includes("application/json")) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  // Error handling
  if (!response.ok) {
    const eb = data as Partial<ApiErrorBody>;
    const err = new ApiError({
      status: response.status,
      error: eb.error ?? response.statusText,
      message: eb.message ?? "An unexpected error occurred.",
      path: eb.path ?? path,
      timestamp: eb.timestamp ?? new Date().toISOString(),
      details: eb.details ?? null,
    });

    if (response.status === 401) {
      handleUnauthorized(path);
    }

    throw err;
  }

  return data as T;
}

// ── HTTP method surface ───────────────────────────────────────────────────────

/**
 * Main API client used by customer, seller, and admin portal code.
 * Token is resolved automatically from useAuthStore.
 */
export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST" }),
  put: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT" }),
  patch: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH" }),
  delete: <T = void>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

/**
 * Driver client — alias for apiClient.
 * Token resolved from useDriverStore automatically.
 * Named alias keeps driver-portal call sites self-documenting.
 */
export const driverClient = apiClient;

/**
 * Public client — omits token injection entirely.
 * Use for fully public endpoints: /api/categories, /api/products/**,
 * /api/tracking/**, /api/pickup-points/**, /api/coupons/validate.
 */
export const publicClient = {
  get: <T>(path: string, options?: Omit<RequestOptions, "token">) =>
    request<T>(path, { ...options, method: "GET", token: "" }),
};

/**
 * Server-side fetch — for React Server Components.
 * Pass the JWT explicitly (read from cookies or headers).
 *
 * @example
 * // In a Server Component:
 * const categories = await serverFetch<CategoryTreeResponse[]>(
 *   "/api/categories",
 *   { next: { revalidate: 600, tags: ["categories"] } }
 * );
 */
export function serverFetch<T>(
  path: string,
  options?: Omit<RequestOptions, "token"> & { token?: string }
): Promise<T> {
  return request<T>(path, { ...options, method: options?.method ?? "GET" });
}
