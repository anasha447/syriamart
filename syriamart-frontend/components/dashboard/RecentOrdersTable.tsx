"use client";

import React, { useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown, ExternalLink } from "lucide-react";
import type { OrderListResponse } from "@/types/api";
import { formatCurrency, formatDate, getOrderStatusConfig, shortId, cn } from "@/lib/utils";

interface RecentOrdersTableProps {
  orders:     OrderListResponse[];
  basePath?:  string;  // "/seller/orders" | "/admin/orders"
  loading?:   boolean;
}

const columnHelper = createColumnHelper<OrderListResponse>();

/**
 * Sortable orders table powered by TanStack Table v8.
 * Used on seller dashboard (recent orders panel) and admin dashboard.
 * Columns: Order ID · Status · Items · Total · Date · Actions
 */
export function RecentOrdersTable({
  orders,
  basePath = "/seller/orders",
  loading  = false,
}: RecentOrdersTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);

  const columns = useMemo(
    () => [
      columnHelper.accessor("id", {
        header: "Order",
        cell:   (info) => (
          <span className="font-mono text-xs font-semibold text-foreground">
            #{shortId(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell:   (info) => {
          const cfg = getOrderStatusConfig(info.getValue());
          return (
            <span className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide",
              cfg.className
            )}>
              {cfg.label}
            </span>
          );
        },
      }),
      columnHelper.accessor("itemCount", {
        header: "Items",
        cell:   (info) => (
          <span className="text-sm text-muted-foreground tabular-nums">{info.getValue()}</span>
        ),
      }),
      columnHelper.accessor("total", {
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="flex items-center gap-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide hover:text-foreground transition-colors"
          >
            Total <ArrowUpDown className="w-3 h-3" />
          </button>
        ),
        cell:   (info) => (
          <span className="text-sm font-semibold text-foreground tabular-nums">
            {formatCurrency(info.getValue())}
          </span>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Date",
        cell:   (info) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(info.getValue(), "relative")}
          </span>
        ),
      }),
      columnHelper.display({
        id:   "actions",
        cell: (info) => (
          <Link
            href={`${basePath}/${info.row.original.id}`}
            className="inline-flex items-center gap-1 text-xs text-[#1A365D] dark:text-[#3B82F6] hover:underline"
          >
            View <ExternalLink className="w-3 h-3" />
          </Link>
        ),
      }),
    ],
    [basePath]
  );

  const table = useReactTable({
    data:              orders,
    columns,
    state:             { sorting },
    onSortingChange:   setSorting,
    getCoreRowModel:   getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (loading) {
    return (
      <div className="space-y-2 p-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 items-center h-10">
            {[...Array(5)].map((__, j) => (
              <div key={j} className="skeleton h-4 rounded flex-1" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (!orders.length) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        No orders found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          {table.getHeaderGroups().map((hg) => (
            <tr key={hg.id} className="border-b border-border">
              {hg.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors"
            >
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
  );
}
