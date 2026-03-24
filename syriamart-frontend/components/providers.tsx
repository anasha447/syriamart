'use client';

import { useState, useEffect, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/lib/store/auth.store';

// ─── Query Client Factory ────────────────────────────────────────────────────
// Created inside useState to ensure each browser tab gets its own instance.
// The configuration mirrors the architecture strategy document.

function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime:            60 * 1000,       // 60s — data is "fresh"
        gcTime:               5 * 60 * 1000,   // 5min — keep in memory
        retry:                1,               // one retry on network failures
        refetchOnWindowFocus: false,           // prevents flash on tab switch
        refetchOnReconnect:   true,
      },
      mutations: {
        // Global mutation error is handled per-mutation via onError callbacks.
        // Do not redirect or show toasts here — mutations know their context.
        retry: 0,
      },
    },
  });
}

// ─── Providers ────────────────────────────────────────────────────────────────

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(createQueryClient);

  // ── Zustand hydration guard ──────────────────────────────────────────────
  // Next.js App Router renders on the server before localStorage is available.
  // We mark the store as hydrated once the client has mounted so that
  // auth-gated layouts (AuthGuard) don't flash the unauthenticated state.
  useEffect(() => {
    useAuthStore.getState().setHydrated();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      )}
    </QueryClientProvider>
  );
}
