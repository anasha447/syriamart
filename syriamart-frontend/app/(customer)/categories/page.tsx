import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Grid3X3, ChevronRight } from "lucide-react";
import { categoriesApi } from "@/lib/api/categories";
import type { Metadata } from "next";

export const revalidate = 600;

export const metadata: Metadata = {
  title:       "All Categories",
  description: "Browse all product categories on SyrianMart.",
};

async function CategoriesGrid() {
  const categories = await categoriesApi.getTree().catch(() => []);

  return (
    <div className="space-y-12">
      {categories.map((cat) => (
        <section key={cat.id}>
          {/* Category header */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
                {cat.imageUrl ? (
                  <Image src={cat.imageUrl} alt={cat.name} width={48} height={48} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Grid3X3 className="w-5 h-5 text-neutral-400" />
                  </div>
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-[#1A365D] dark:text-white">{cat.name}</h2>
                {cat.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>
                )}
              </div>
            </div>
            <Link href={`/category/${cat.id}`}
              className="flex items-center gap-1 text-sm font-semibold text-[#1A365D] dark:text-[#3B82F6] hover:underline flex-shrink-0"
            >
              Shop all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Sub-categories grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {/* "All" tile */}
            <Link href={`/category/${cat.id}`}
              className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-[#1A365D]/40 dark:hover:border-[#3B82F6]/40 hover:bg-[#EFF6FF] dark:hover:bg-[#172554] transition-all duration-150"
            >
              <div className="w-12 h-12 rounded-xl bg-[#1A365D] dark:bg-[#3B82F6] flex items-center justify-center">
                <Grid3X3 className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-[#1A365D] dark:text-[#3B82F6] text-center">
                All {cat.name}
              </span>
            </Link>

            {cat.subCategories.map((sub) => (
              <Link
                key={sub.id}
                href={`/category/${cat.id}?sub=${sub.id}`}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-border hover:border-[#1A365D]/30 dark:hover:border-[#3B82F6]/30 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-150"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden border border-border bg-neutral-100 dark:bg-neutral-800">
                  {sub.imageUrl ? (
                    <Image
                      src={sub.imageUrl}
                      alt={sub.name}
                      width={48}
                      height={48}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-bold text-neutral-400">
                      {sub.name[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-foreground text-center line-clamp-2 leading-tight group-hover:text-[#1A365D] dark:group-hover:text-white transition-colors">
                  {sub.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="border-b border-border mt-8" />
        </section>
      ))}
    </div>
  );
}

export default function CategoriesPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#1A365D] dark:text-white">All Categories</h1>
        <p className="text-muted-foreground mt-1">Browse everything available on SyrianMart</p>
      </div>
      <Suspense fallback={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      }>
        <CategoriesGrid />
      </Suspense>
    </div>
  );
}
