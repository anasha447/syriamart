/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa")({
  dest:            "public",
  register:        true,
  skipWaiting:     true,
  disable:         process.env.NODE_ENV === "development",
  // Cache only the driver portal's critical resources for offline use
  runtimeCaching: [
    {
      urlPattern: /^https?.*(driver|api\/tracking)/,
      handler:    "NetworkFirst",
      options: {
        cacheName: "driver-cache",
        expiration: { maxEntries: 50, maxAgeSeconds: 300 },
      },
    },
  ],
});

const nextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.syriamart.com",  pathname: "/**" },
      { protocol: "https", hostname: "images.syriamart.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "http",  hostname: "localhost",          port: "9000", pathname: "/**" },
    ],
    formats: ["image/avif", "image/webp"],
  },

  experimental: {
    // Enable server actions for form submissions
    serverActions: { bodySizeLimit: "4mb" },
    // Tree-shake large packages — reduces JS shipped to the browser
    // NOTE: @tanstack/react-query is intentionally excluded — it uses React
    // Context internally and optimizePackageImports can break the
    // QueryClientProvider context chain in Next.js 14.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
    ],
    // Restore scroll position on back/forward navigation
    scrollRestoration: true,
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control",  value: "on"                      },
          { key: "X-Frame-Options",         value: "SAMEORIGIN"              },
          { key: "X-Content-Type-Options",  value: "nosniff"                 },
          { key: "Referrer-Policy",         value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy",      value: "camera=*, geolocation=*" },
        ],
      },
      // Allow SharedArrayBuffer for leaflet workers
      {
        source: "/driver/(.*)",
        headers: [
          { key: "Cross-Origin-Opener-Policy",   value: "same-origin"        },
          { key: "Cross-Origin-Embedder-Policy",  value: "require-corp"       },
        ],
      },
    ];
  },
};

module.exports = withPWA(nextConfig);
