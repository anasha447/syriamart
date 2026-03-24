import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-neutral-50 dark:bg-background">
      {/* Large 404 */}
      <div className="relative mb-8">
        <span
          className="text-[140px] sm:text-[180px] font-bold leading-none select-none"
          style={{
            background: "linear-gradient(135deg, #1A365D 0%, #3B82F6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
          <Search className="w-32 h-32 text-[#1A365D]" />
        </div>
      </div>

      <h1 className="text-2xl font-bold text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="text-muted-foreground text-sm max-w-sm mb-8 leading-relaxed">
        We couldn't find the page you're looking for. It may have been moved,
        deleted, or never existed.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A365D] text-white font-semibold text-sm hover:bg-[#1E3A5F] transition-colors"
        >
          <Home className="w-4 h-4" />
          Go to Homepage
        </Link>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Search className="w-4 h-4" />
          Browse Products
        </Link>
      </div>

      {/* Popular links */}
      <div className="mt-10">
        <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-3">
          Popular pages
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            { label: "Categories", href: "/categories"         },
            { label: "Top Selling",href: "/search?sort=totalSold" },
            { label: "Best Deals", href: "/search?sort=discount"  },
            { label: "Track Order",href: "/tracking"           },
            { label: "Sell Here",  href: "/register/seller"    },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="px-3 py-1.5 rounded-full border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:border-[#1A365D] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
