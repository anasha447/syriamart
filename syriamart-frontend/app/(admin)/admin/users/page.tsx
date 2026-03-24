"use client";

import React, { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getFilteredRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { Ban, Search, Shield, User, Loader2, CheckCircle2 } from "lucide-react";

import { useAdminUsers, useAdminBanUser } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { UserProfileResponse } from "@/types/api";

const col = createColumnHelper<UserProfileResponse>();

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers();
  const banUser = useAdminBanUser();
  const [globalFilter, setGlobalFilter] = useState("");
  const [banModalOpen, setBanModalOpen] = useState<{ isOpen: boolean; userId: string; name: string }>({ isOpen: false, userId: "", name: "" });
  const [banReason, setBanReason] = useState("");

  const handleBan = () => {
    if (!banReason.trim()) return;
    banUser.mutate({ userId: banModalOpen.userId, reason: banReason }, {
      onSuccess: () => {
        setBanModalOpen({ isOpen: false, userId: "", name: "" });
        setBanReason("");
      }
    });
  };

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    if (!globalFilter) return users;
    const lower = globalFilter.toLowerCase();
    return users.filter(u => 
      u.fullName.toLowerCase().includes(lower) || 
      u.email.toLowerCase().includes(lower) || 
      (u.phone && u.phone.includes(lower))
    );
  }, [users, globalFilter]);

  const columns = useMemo(() => [
    col.accessor("fullName", {
      header: "User",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-[#1A365D] font-bold text-xs flex-shrink-0">
            {info.getValue().charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">{info.getValue()}</span>
            <span className="text-xs text-muted-foreground">{info.row.original.email}</span>
          </div>
        </div>
      ),
    }),
    col.accessor("phone", {
      header: "Phone",
      cell: (info) => info.getValue() || <span className="text-muted-foreground italic text-xs">Not provided</span>,
    }),
    col.accessor("createdAt", {
      header: "Joined Date",
      cell: (info) => <span className="text-sm">{new Date(info.getValue()).toLocaleDateString()}</span>
    }),
    col.display({
      id: "actions",
      cell: (info) => (
        <div className="flex items-center justify-end">
          <button
            onClick={() => setBanModalOpen({ isOpen: true, userId: info.row.original.id, name: info.row.original.fullName })}
            className="text-xs font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-md transition-colors"
          >
            Suspend User
          </button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title="User Management"
        description="View all registered users, filter by role, and manage suspended accounts."
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search users by name, email, or phone..."
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-input bg-background text-sm text-foreground focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] transition-all"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !filteredUsers.length ? (
          <EmptyState
            icon={<User className="w-10 h-10" />}
            title="No users found"
            description="There are no users matching your criteria."
          />
        ) : (
          <>
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
                        <td key={cell.id} className="px-6 py-4">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">
                Showing {table.getRowModel().rows.length} of {filteredUsers.length} results
              </span>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 border border-border rounded text-xs font-medium bg-background hover:bg-muted disabled:opacity-50"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  Previous
                </button>
                <button
                  className="px-3 py-1 border border-border rounded text-xs font-medium bg-background hover:bg-muted disabled:opacity-50"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Ban Modal */}
      {banModalOpen.isOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-sm rounded-2xl shadow-xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-500 mb-4 mx-auto">
                <Ban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-center text-foreground mb-1">Suspend User</h3>
              <p className="text-sm text-center text-muted-foreground mb-6">
                Are you sure you want to suspend <span className="font-semibold text-foreground">{banModalOpen.name}</span>?
              </p>
              
              <div className="space-y-2 mb-6">
                <label className="block text-xs font-medium text-foreground">Reason for suspension</label>
                <textarea 
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Violation of terms..."
                  className="w-full h-24 p-3 rounded-lg border border-input bg-background text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setBanModalOpen({ isOpen: false, userId: "", name: "" })}
                  className="flex-1 py-2 rounded-lg font-medium text-sm text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleBan}
                  disabled={!banReason.trim() || banUser.isPending}
                  className="flex-1 py-2 rounded-lg font-medium text-sm bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                >
                  {banUser.isPending ? "Suspending..." : "Suspend"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
