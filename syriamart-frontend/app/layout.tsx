import type { Metadata, Viewport } from 'next';
import { Inter, Roboto_Mono } from 'next/font/google';
import { Providers } from '@/components/providers';
import './globals.css';

// ─── Google Fonts (Replacing Missing Local Fonts) ─────────────

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['400', '500'],
  preload: true,
});

const geist = Inter({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const geistMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

// ─── Metadata ──────────────────────────────────────────────────

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  title: {
    default: 'SyrianMart — Multi-Vendor Marketplace',
    template: '%s | SyrianMart',
  },
  description: 'Shop from hundreds of trusted Syrian vendors. Fast delivery, secure payments, wide selection.',
  keywords: ['SyrianMart', 'marketplace', 'e-commerce', 'Syria', 'shop online', 'vendors'],
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1A365D' },
    { media: '(prefers-color-scheme: dark)', color: '#0F172A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// ─── Root Layout ───────────────────────────────────────────────

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      suppressHydrationWarning
      className={`${inter.variable} ${geist.variable} ${geistMono.variable}`}
    >
      <body suppressHydrationWarning className="min-h-screen bg-background font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}