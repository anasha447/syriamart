import type { Metadata } from "next";
import { CustomerNavbar }       from "@/components/layout/CustomerNavbar";
import { CustomerFooter }       from "@/components/layout/CustomerFooter";
import { CartDrawerWrapper }    from "@/components/cart/CartDrawerWrapper";

export const metadata: Metadata = {
  title: {
    template: "%s | SyrianMart",
    default:  "SyrianMart — Shop Syria's Best",
  },
};

/**
 * Customer portal layout.
 * CustomerNavbar: 'use client' — mega-menu + cart + user menu
 * CustomerFooter: RSC — static, zero JS
 * CartDrawerWrapper: 'use client' — Framer Motion slide-in
 */
export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-50 dark:bg-background">
      <CustomerNavbar />
      <main className="flex-1 w-full">{children}</main>
      <CustomerFooter />
      <CartDrawerWrapper />
    </div>
  );
}
