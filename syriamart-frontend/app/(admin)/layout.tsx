import type { Metadata } from "next";
import { AdminSidebar }    from "@/components/layout/AdminSidebar";
import { SellerTopHeader } from "@/components/layout/SellerTopHeader";
import { AuthGuard }       from "@/components/shared/AuthGuard";

export const metadata: Metadata = {
  title: {
    template: "%s | Admin — SyrianMart",
    default:  "Admin Dashboard — SyrianMart",
  },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard allowedRoles={["ADMIN"]}>
      <div className="flex h-screen bg-neutral-100 dark:bg-background overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <SellerTopHeader />
          <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6" id="admin-main">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
