/**
 * lib/api/messages.ts
 * Driver ↔ Customer/Admin messaging (Logistics Service).
 * Driver calls use driverToken; customer calls use authStore token.
 */
import { apiClient as api, type RequestOptions } from "@/lib/api/client";
import type { MessageResponse } from "@/types/api";

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

export const messagesApi = {
  // ── Driver perspective ────────────────────────────────────────────────────

  /** GET /api/messages/conversation/{partnerId}?page=&size= */
  getConversation: (partnerId: string, page = 0, size = 30) =>
    api.get<MessageResponse[]>(
      `/api/messages/conversation/${partnerId}?page=${page}&size=${size}`,
      driverOpts()
    ),

  /** POST /api/messages */
  send: (data: {
    receiverId: string;
    receiverRole: string;
    content: string;
    orderId?: string;
  }) =>
    api.post<MessageResponse>("/api/messages", driverOpts({ body: data })),

  /** GET /api/messages/unread-count */
  getUnreadCount: () =>
    api.get<{ count: number }>("/api/messages/unread-count", driverOpts()),

  /** POST /api/messages/mark-read */
  markAllRead: () =>
    api.post<void>("/api/messages/mark-read", driverOpts()),

  // ── Customer/Admin perspective (uses regular auth token) ──────────────────

  /** GET /api/messages/conversation/{driverId} — customer or admin */
  getConversationAsUser: (driverId: string, page = 0, size = 30) =>
    api.get<MessageResponse[]>(
      `/api/messages/conversation/${driverId}?page=${page}&size=${size}`
    ),

  /** POST /api/messages — customer replying to driver */
  sendAsUser: (data: {
    receiverId: string;
    receiverRole: string;
    content: string;
    orderId?: string;
  }) =>
    api.post<MessageResponse>("/api/messages", { body: data }),
};
