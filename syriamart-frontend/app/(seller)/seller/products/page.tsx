"use client";

import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useReactTable, getCoreRowModel, getSortedRowModel,
  getPaginationRowModel, getFilteredRowModel,
  flexRender, createColumnHelper, type SortingState,
} from "@tanstack/react-table";
import { PlusCircle, Search, Pencil, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Package } from "lucide-react";
import Image from "next/image";
import { useMyProducts, useDeleteProduct } from "@/hooks/useProducts";
import { PageHeader }         from "@/components/shared/PageHeader";
import { EmptyState }          from "@/components/shared/EmptyState";
import type { ProductSummaryResponse, ProductStatus } from "@/types/api";
import { formatCurrency, cn } from "@/lib/utils";

const STATUS_BADGE: Record<ProductStatus, { label: string; className: string }> = {
  PENDING_REVIEW: { label: "Pending",  className: "badge-pending"   },
  ACTIVE:         { label: "Active",   className: "badge-delivered" },
  INACTIVE:       { label: "Inactive", className: "badge-returned"  },
  REJECTED:       { label: "Rejected", className: "badge-cancelled" },
  ARCHIVED:       { label: "Archived", className: "badge-returned"  },
};

const col = createColumnHelper<ProductSummaryResponse>();

export default function SellerProductsPage() {
  const router   = useRouter();
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const { data, isLoading } = useMyProducts(page);
  const deleteProduct        = useDeleteProduct();

  const columns = useMemo(() => [
    col.accessor("name", {
      header: "Product",
      cell: (info) => {
        const row = info.row.original;
        return (
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
              {row.primaryImageUrl
                ? <Image src={row.primaryImageUrl} alt={row.name} fill className="object-cover" sizes="40px" />
                : <div className="w-full h-full" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground truncate max-w-[200px]">{row.name}</p>
              <p className="text-xs text-muted-foreground">{row.totalSold} sold</p>
            </div>
          </div>
        );
      },
    }),
    col.accessor("status", {
      header: "Status",
      cell: (info) => {
        const cfg = STATUS_BADGE[info.getValue()] ?? STATUS_BADGE.INACTIVE;
        return (
          <span className={cn("px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide", cfg.className)}>
            {cfg.label}
          </span>
        );
      },
    }),
    col.accessor("effectivePrice", {
      header: ({ column }) => (
        <button onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground"
        >
          Price <ArrowUpDown className="w-3 h-3" />
        </button>
      ),
      cell: (info) => (
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {formatCurrency(info.getValue())}
        </span>
      ),
    }),
    col.accessor("averageRating", {
      header: "Rating",
      cell: (info) => (
        <span className="text-sm text-muted-foreground tabular-nums">
          {info.getValue().toFixed(1)} ★ ({info.row.original.totalReviews})
        </span>
      ),
    }),
    col.display({
      id: "actions",
      cell: (info) => {
        const id = info.row.original.id;
        return (
          <div className="flex items-center gap-1">
            <Link href={`/seller/products/${id}/edit`}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              title="Edit"
            >
              <Pencil className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => {
                if (confirm("Archive this product? It will no longer be visible to customers.")) {
                  deleteProduct.mutate(id);
                }
              }}
              className="p-1.5 rounded-md text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              title="Archive"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      },
    }),
  ], [deleteProduct]);

  const table = useReactTable({
    data:              data?.products ?? [],
    columns,
    state:             { sorting, globalFilter: search },
    onSortingChange:   setSorting,
    onGlobalFilterChange: setSearch,
    getCoreRowModel:   getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title="My Products"
        description={data ? `${data.totalElements} products in your store` : ""}
        action={
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1A365D] text-white text-sm font-medium hover:bg-[#1E3A5F] transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Add Product
          </Link>
        }
      />

      {/* Search + filter bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-background text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center">
                <div className="skeleton w-10 h-10 rounded-lg" />
                <div className="skeleton h-4 flex-1 rounded" />
                <div className="skeleton h-4 w-20 rounded" />
                <div className="skeleton h-4 w-24 rounded" />
              </div>
            ))}
          </div>
        ) : !data?.products.length ? (
          <EmptyState
            icon={<Package className="w-7 h-7" />}
            title="No products yet"
            description="Add your first product to start selling on SyrianMart."
            action={
              <Link href="/seller/products/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1A365D] text-white text-sm font-medium"
              >
                <PlusCircle className="w-4 h-4" /> Add Product
              </Link>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  {table.getHeaderGroups().map((hg) => (
                    <tr key={hg.id} className="border-b border-border bg-muted/30">
                      {hg.headers.map((h) => (
                        <th key={h.id} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap">
                          {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {table.getRowModel().rows.map((row) => (
                    <tr key={row.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {(data?.totalPages ?? 0) > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Page {page + 1} of {data?.totalPages}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                    className="p-1.5 rounded-md border border-border disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={() => setPage((p) => p + 1)} disabled={page >= (data?.totalPages ?? 1) - 1}
                    className="p-1.5 rounded-md border border-border disabled:opacity-40 hover:bg-muted transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
