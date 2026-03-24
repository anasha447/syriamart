import type { Metadata } from "next";
import { SellerSidebar }    from "@/components/layout/SellerSidebar";
import { SellerTopHeader }  from "@/components/layout/SellerTopHeader";
import { AuthGuard }        from "@/components/shared/AuthGuard";

export const metadata: Metadata = {
  title: {
    template: "%s | Seller Dashboard — SyrianMart",
    default:  "Seller Dashboard — SyrianMart",
  },
  robots: { index: false, follow: false },
};

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["SELLER", "ADMIN"]}>
      <div className="flex h-screen bg-neutral-100 dark:bg-background overflow-hidden">
        <SellerSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <SellerTopHeader />
          <main
            className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6"
            id="seller-main"
          >
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
