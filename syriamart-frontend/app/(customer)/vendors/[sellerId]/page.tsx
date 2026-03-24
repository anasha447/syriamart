import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Store, MapPin, Calendar, Star } from "lucide-react";
import { sellersApi } from "@/lib/api/sellers";
import { productsApi } from "@/lib/api/products";
import { ProductCard } from "@/components/product/ProductCard";

interface VendorPageProps {
  params: { sellerId: string };
  searchParams: { page?: string };
}

export const revalidate = 120; // ISR cache

export async function generateMetadata({ params }: { params: { sellerId: string } }) {
  try {
    // In a real app we might have a specific endpoint to fetch a single seller by ID.
    // Here we'll just fetch all active and find it, or fallback.
    const sellers = await sellersApi.getActive();
    const seller = sellers.find((s) => s.sellerId === params.sellerId);
    if (!seller) return { title: "Vendor Not Found | Syriamart" };

    return {
      title: `${seller.storeName} | Syriamart`,
      description: seller.storeDescription ?? `Shop from ${seller.storeName} on Syriamart.`,
    };
  } catch {
    return { title: "Vendor | Syriamart" };
  }
}

export default async function VendorStorefrontPage({ params, searchParams }: VendorPageProps) {
  const page = parseInt(searchParams.page ?? "0", 10);
  const size = 24;

  try {
    // Fetch all active sellers to get the seller profile (since there's no single-seller public endpoint)
    const sellers = await sellersApi.getActive();
    const seller = sellers.find((s) => s.sellerId === params.sellerId);

    if (!seller) {
      notFound();
    }

    // Fetch this seller's products
    const productsRes = await productsApi.bySeller(params.sellerId, page, size);
    const { products, totalElements, totalPages } = productsRes;

    return (
      <main className="container mx-auto py-8 space-y-8 page-enter">
        {/* Vendor Header */}
        <div className="bg-white dark:bg-card rounded-2xl shadow-sm border border-border overflow-hidden">
          <div className="h-32 md:h-48 w-full bg-gradient-to-r from-[#1A365D] to-[#3B82F6] opacity-90" />
          <div className="px-6 pb-6 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12 md:-mt-16">
              {/* Profile Image */}
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-xl border-4 border-white dark:border-card bg-white dark:bg-neutral-800 shadow-md flex-shrink-0 overflow-hidden relative">
                {seller.storeImageUrl ? (
                  <Image src={seller.storeImageUrl} alt={seller.storeName} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-[#1A365D] bg-neutral-100 dark:bg-neutral-800">
                    {seller.storeName[0].toUpperCase()}
                  </div>
                )}
              </div>

              {/* Vendor Info */}
              <div className="flex-1 space-y-2 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <Store className="w-6 h-6 text-[#1A365D]" />
                  {seller.storeName}
                </h1>
                <p className="text-muted-foreground max-w-2xl">
                  {seller.storeDescription ?? "Welcome to our store. We sell amazing products."}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    Joined {seller.createdAt ? new Date(seller.createdAt).toLocaleDateString() : 'Recently'}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Package className="w-4 h-4" />
                    {totalElements} products
                  </span>

                  {/* Rating could be here if available in seller list API */}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6">All Products</h2>
          {products.length === 0 ? (
            <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-border">
              <Store className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <h3 className="text-lg font-medium text-foreground">No products found</h3>
              <p className="text-muted-foreground">This vendor hasn&apos;t listed any products yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center pt-8">
            <div className="flex items-center gap-2">
              <Link
                href={`?page=${Math.max(0, page - 1)}`}
                className={`px-4 py-2 rounded-lg border ${page === 0 ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}
              >
                Previous
              </Link>
              <span className="text-sm font-medium px-4">
                Page {page + 1} of {totalPages}
              </span>
              <Link
                href={`?page=${Math.min(totalPages - 1, page + 1)}`}
                className={`px-4 py-2 rounded-lg border ${page >= totalPages - 1 ? "opacity-50 pointer-events-none" : "hover:bg-muted"}`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </main>
    );
  } catch (error) {
    console.error("Failed to load vendor storefront:", error);
    return (
      <div className="container mx-auto py-24 text-center">
        <h1 className="text-2xl font-bold mb-4">Error Loading Storefront</h1>
        <p className="text-muted-foreground">We couldn&apos;t load the vendor&apos;s information at this time.</p>
      </div>
    );
  }
}

function Package(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7.5 4.27 9 5.15" />
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}
