"use client";

import React, { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { PackageSearch, Filter, Loader2, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import * as z from "zod";

import { useAdminAllOrders, useAdminUpdateOrderStatus } from "@/hooks/useAdminOrders";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency, cn } from "@/lib/utils";
import type { OrderListResponse } from "@/types/api";

const ORDER_STATUSES = [
  "ALL", "PENDING", "CONFIRMED", "PROCESSING", 
  "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED"
];

const col = createColumnHelper<OrderListResponse>();

export default function AdminOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [page, setPage] = useState(0);

  const { data: orders, isLoading } = useAdminAllOrders(statusFilter, page);
  const updateStatus = useAdminUpdateOrderStatus();

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateStatus.mutate({ orderId, status: newStatus });
  };

  const columns = useMemo(() => [
    col.accessor("id", {
      header: "Order ID",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-mono text-sm font-bold text-[#1A365D] dark:text-[#3B82F6]">
            #{info.getValue().substring(0, 8).toUpperCase()}
          </span>
          <span className="text-xs text-muted-foreground">{format(new Date(info.row.original.createdAt), "MMM d, HH:mm")}</span>
        </div>
      )
    }),
    col.accessor("total", {
      header: "Total",
      cell: (info) => <div className="font-semibold text-sm tabular-nums text-foreground">{formatCurrency(info.getValue())}</div>
    }),
    col.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        const colorClass = 
          status === "DELIVERED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
          status === "CANCELLED" || status === "RETURNED" ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
          status === "SHIPPED" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400";
        
        return (
          <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide", colorClass)}>
            {status}
          </span>
        );
      }
    }),
    col.accessor("itemCount", {
      header: "Items",
      cell: (info) => <span className="text-sm text-muted-foreground">{info.getValue()} item(s)</span>
    }),
    col.display({
      id: "actions",
      header: "Update Status",
      cell: (info) => (
        <div className="flex items-center justify-end">
          <select
            value={info.row.original.status}
            onChange={(e) => handleStatusChange(info.row.original.id, e.target.value)}
            disabled={updateStatus.isPending || ["CANCELLED", "DELIVERED"].includes(info.row.original.status)}
            className="h-8 px-2 text-xs rounded-md border border-input bg-background/50 hover:bg-background focus:ring-1 focus:ring-[#1A365D] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors outline-none"
          >
            {ORDER_STATUSES.filter(s => s !== "ALL").map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      )
    }),
  ], [updateStatus.isPending]);

  const table = useReactTable({
    data: orders ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-6 page-enter pb-12">
      <PageHeader
        title="Order Overseer"
        description="Monitor all platform orders across all vendors and statuses."
      />

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-3 flex items-center justify-between shadow-sm overflow-x-auto">
        <div className="flex items-center gap-1.5 min-w-max">
          <Filter className="w-4 h-4 text-muted-foreground ml-2 mr-1" />
          {ORDER_STATUSES.map(st => (
            <button
              key={st}
              onClick={() => { setStatusFilter(st); setPage(0); }}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap",
                statusFilter === st 
                  ? "bg-[#1A365D] text-white shadow-sm"
                  : "bg-transparent text-muted-foreground hover:bg-muted"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !orders?.length ? (
          <EmptyState
            icon={<PackageSearch className="w-10 h-10" />}
            title="No orders found"
            description={statusFilter === "ALL" ? "There are no orders on the platform yet." : `No orders found with status ${statusFilter}.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(h => (
                      <th key={h.id} className={cn("px-6 py-4 whitespace-nowrap", h.id === "actions" && "text-right")}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-muted/20 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls - Server Side */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">Showing max 20 records per page</span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-border rounded text-xs font-medium bg-background hover:bg-muted disabled:opacity-50"
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 border border-border rounded text-xs font-medium bg-background hover:bg-muted disabled:opacity-50"
                  onClick={() => setPage(p => p + 1)}
                  disabled={orders.length < 20}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
