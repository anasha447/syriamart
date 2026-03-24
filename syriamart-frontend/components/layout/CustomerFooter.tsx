import React from "react";
import Link from "next/link";

const LINKS = {
  Shop:    [
    { label: "All Products",    href: "/products"            },
    { label: "Categories",      href: "/categories"          },
    { label: "Deals & Offers",  href: "/search?sort=discount"},
    { label: "Top Sellers",     href: "/products/top-selling"},
  ],
  Sellers: [
    { label: "Become a Seller", href: "/register/seller"    },
    { label: "Seller Dashboard",href: "/seller/dashboard"   },
    { label: "Seller Policies", href: "/sellers/policies"   },
  ],
  Support: [
    { label: "Help Center",     href: "/help"               },
    { label: "Track Your Order",href: "/tracking"           },
    { label: "Returns Policy",  href: "/returns"            },
    { label: "Contact Us",      href: "/contact"            },
  ],
  Company: [
    { label: "About SyrianMart",href: "/about"              },
    { label: "Privacy Policy",  href: "/privacy"            },
    { label: "Terms of Service",href: "/terms"              },
  ],
} as const;

export function CustomerFooter() {
  return (
    <footer className="bg-white dark:bg-[#0F172A] border-t border-border mt-auto">
      <div className="container mx-auto py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF9900] text-[#0F172A] font-bold text-sm flex items-center justify-center">S</div>
              <span className="font-semibold text-lg text-[#1A365D] dark:text-white">Syrian<span className="text-[#FF9900]">Mart</span></span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Syria's premier multi-vendor marketplace with secure checkout and fast delivery.
            </p>
            <div className="flex flex-wrap gap-2">
              {["Secure Checkout", "Verified Sellers", "Fast Delivery"].map((b) => (
                <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-[#F0FDF4] text-[#16A34A] dark:bg-green-900/20 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />{b}
                </span>
              ))}
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title} className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide">{title}</h3>
              <ul className="flex flex-col gap-2">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link href={href} className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-[#1A365D] dark:hover:text-white transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-400">© {new Date().getFullYear()} SyrianMart. All rights reserved.</p>
          <div className="flex items-center gap-4">
            {[["Privacy", "/privacy"], ["Terms", "/terms"], ["Sitemap", "/sitemap.xml"]].map(([label, href]) => (
              <Link key={href} href={href} className="text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors">{label}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
