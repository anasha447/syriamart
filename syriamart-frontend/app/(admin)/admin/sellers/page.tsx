"use client";

import React, { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Store, ShieldCheck, Mail, Phone, Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { format } from "date-fns";

import { useAdminSellers, useAdminApproveSeller } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";
import type { SellerDetailResponse } from "@/types/api";

const col = createColumnHelper<SellerDetailResponse>();

const approvalSchema = z.object({
  approved: z.boolean(),
  profitPercentage: z.number().min(0).max(100).optional(),
  rejectionReason: z.string().optional(),
}).refine(data => {
  if (data.approved && typeof data.profitPercentage !== 'number') return false;
  if (!data.approved && !data.rejectionReason) return false;
  return true;
}, {
  message: "Profit percentage required for approval, or reason required for rejection",
  path: ["profitPercentage"]
});

type ApprovalFormData = z.infer<typeof approvalSchema>;

export default function AdminSellersPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const { data: sellers, isLoading } = useAdminSellers(activeTab);
  const approveSeller = useAdminApproveSeller();

  const [modalSeller, setModalSeller] = useState<SellerDetailResponse | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ApprovalFormData>({
    resolver: zodResolver(approvalSchema),
    defaultValues: { approved: true, profitPercentage: 15 }
  });
  
  const isApproving = watch("approved");

  const handleOpenModal = (seller: SellerDetailResponse) => {
    reset({ approved: true, profitPercentage: 15, rejectionReason: "" });
    setModalSeller(seller);
  };

  const onSubmit = (data: ApprovalFormData) => {
    if (!modalSeller) return;
    approveSeller.mutate(
      { sellerId: modalSeller.sellerId, data },
      { onSuccess: () => setModalSeller(null) }
    );
  };

  const columns = useMemo(() => [
    col.accessor("storeName", {
      header: "Store Details",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-700 dark:text-indigo-400 flex-shrink-0 border border-indigo-100 dark:border-indigo-800">
            <Store className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{info.getValue()}</span>
            <span className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]">
              {info.row.original.storeDescription || "No description provided"}
            </span>
          </div>
        </div>
      ),
    }),
    col.accessor("email", {
      header: "Contact Info",
      cell: (info) => (
        <div className="flex flex-col text-sm">
          <span className="font-medium text-foreground text-xs">{info.getValue()}</span>
          <span className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="w-3 h-3"/> {info.row.original.phone}</span>
        </div>
      )
    }),
    col.accessor("status", {
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        if (status === "ACTIVE") return <span className="inline-flex py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center gap-1.5 w-max"><CheckCircle2 className="w-3 h-3"/> Active</span>;
        if (status === "PENDING") return <span className="inline-flex py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 flex items-center gap-1.5 w-max"><Clock className="w-3 h-3"/> Pending Review</span>;
        return <span className="inline-flex py-1 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1.5 w-max"><XCircle className="w-3 h-3"/> {status}</span>;
      }
    }),
    col.accessor("createdAt", {
      header: "Applied On",
      cell: (info) => <span className="text-sm font-medium">{format(new Date(info.getValue()), "MMM d, yyyy")}</span>
    }),
    col.display({
      id: "actions",
      cell: (info) => info.row.original.status === "PENDING" && (
        <div className="flex items-center justify-end">
          <button
            onClick={() => handleOpenModal(info.row.original)}
            className="text-xs font-semibold bg-[#1A365D] text-white hover:bg-[#1E3A5F] px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Review Application
          </button>
        </div>
      ),
    }),
  ], []);

  const table = useReactTable({
    data: sellers ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title="Seller Applications"
        description="Review incoming vendor requests and manage all operating storefronts on the platform."
      />

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setActiveTab("pending")}
          className={cn("px-6 py-3 text-sm font-bold border-b-2 transition-colors", 
            activeTab === "pending" ? "border-[#1A365D] dark:border-[#3B82F6] text-[#1A365D] dark:text-[#3B82F6]" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          Pending Review
        </button>
        <button 
          onClick={() => setActiveTab("all")}
          className={cn("px-6 py-3 text-sm font-bold border-b-2 transition-colors", 
            activeTab === "all" ? "border-[#1A365D] dark:border-[#3B82F6] text-[#1A365D] dark:text-[#3B82F6]" : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          All Sellers
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !sellers?.length ? (
          <EmptyState
            icon={<Store className="w-10 h-10" />}
            title={activeTab === "pending" ? "No pending applications" : "No sellers found"}
            description={activeTab === "pending" ? "All seller applications have been reviewed." : "No approved vendors exist on the platform yet."}
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
                      <td key={cell.id} className={cn("px-6 py-4", cell.column.id === "actions" && "text-right")}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/20">
              <span className="text-xs text-muted-foreground">Showing {table.getRowModel().rows.length} records</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border border-border rounded text-xs font-medium bg-background hover:bg-muted disabled:opacity-50" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</button>
                <button className="px-3 py-1 border border-border rounded text-xs font-medium bg-background hover:bg-muted disabled:opacity-50" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {modalSeller && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Store className="w-5 h-5 text-[#1A365D]" /> 
                Review Application
              </h3>
              <button onClick={() => setModalSeller(null)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Applicant Info Summary */}
              <div className="bg-white dark:bg-neutral-900 border border-border rounded-xl p-4 mb-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Store Name</span>
                    <span className="font-semibold text-foreground">{modalSeller.storeName}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Email</span>
                    <span className="font-semibold text-foreground">{modalSeller.email}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Phone</span>
                    <span className="font-semibold text-foreground">{modalSeller.phone}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Business Reg. No.</span>
                    <span className="font-mono">{modalSeller.businessRegistrationNumber || "N/A"}</span>
                  </div>
                  <div>
                    <span className="block text-xs text-muted-foreground mb-1">Tax ID</span>
                    <span className="font-mono">{modalSeller.taxId || "N/A"}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Decision Radio */}
                <div className="grid grid-cols-2 gap-4">
                  <label className={cn(
                    "flex items-center justify-center gap-2 h-12 rounded-xl border-2 cursor-pointer transition-all",
                    isApproving ? "border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20" : "border-border text-muted-foreground hover:border-emerald-200 hover:bg-muted"
                  )}>
                    <input type="radio" className="sr-only" {...register("approved", { setValueAs: v => String(v) === 'true' })} value="true" />
                    <CheckCircle2 className="w-4 h-4" /> Approve
                  </label>
                  
                  <label className={cn(
                    "flex items-center justify-center gap-2 h-12 rounded-xl border-2 cursor-pointer transition-all",
                    !isApproving ? "border-red-500 bg-red-50 text-red-700 dark:bg-red-900/20" : "border-border text-muted-foreground hover:border-red-200 hover:bg-muted"
                  )}>
                    <input type="radio" className="sr-only" {...register("approved", { setValueAs: v => String(v) === 'true' })} value="false" />
                    <Ban className="w-4 h-4" /> Reject
                  </label>
                </div>

                {isApproving ? (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-semibold mb-2">Platform Cut (Profit Percentage) *</label>
                    <p className="text-xs text-muted-foreground mb-3">Set the commission percentage Syriamart will take from every sale made by this vendor.</p>
                    <div className="relative">
                      <input 
                        type="number" 
                        {...register("profitPercentage", { valueAsNumber: true })} 
                        className="w-full h-11 pl-4 pr-10 rounded-xl border border-input focus:border-[#1A365D] focus:ring-2 focus:ring-[#1A365D]/20 outline-none transition-all font-semibold"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">%</span>
                    </div>
                    {errors.profitPercentage && <p className="text-xs text-red-500 mt-1.5">{errors.profitPercentage.message}</p>}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-semibold mb-2">Rejection Reason *</label>
                    <textarea 
                      {...register("rejectionReason")} 
                      rows={3}
                      placeholder="Explain to the vendor why their application was rejected..."
                      className="w-full p-3 rounded-xl border border-input focus:border-red-500 focus:ring-2 focus:ring-red-500/20 outline-none resize-none text-sm"
                    />
                    {errors.rejectionReason && <p className="text-xs text-red-500 mt-1.5">{errors.rejectionReason.message}</p>}
                  </div>
                )}

                <div className="pt-2 flex justify-end gap-3 border-t border-border mt-6">
                  <button type="button" onClick={() => setModalSeller(null)} className="px-5 py-2.5 rounded-xl font-medium text-sm text-foreground bg-muted hover:bg-muted/80 transition-colors">
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={approveSeller.isPending}
                    className={cn(
                      "btn-cta px-6 py-2.5 rounded-xl text-sm flex items-center gap-2",
                      isApproving ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700 text-white"
                    )}
                  >
                    {approveSeller.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                    Confirm Decision
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
