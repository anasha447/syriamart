"use client";

import React, { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, Trash2, Pencil, Ticket, Calendar, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

import { useMyCoupons, useCreateCoupon, useDeleteCoupon } from "@/hooks/useCoupons";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency, cn } from "@/lib/utils";
import type { CouponResponse } from "@/types/api";

const couponSchema = z.object({
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  discountValue: z.number().min(1, "Value must be positive"),
  minimumOrderValue: z.number().min(0),
  validFrom: z.string().min(1, "Start date required"),
  validTo: z.string().min(1, "End date required"),
  usageLimit: z.number().min(1).optional(),
});
type CouponFormData = z.infer<typeof couponSchema>;

const col = createColumnHelper<CouponResponse>();

export default function SellerCouponsPage() {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: coupons, isLoading } = useMyCoupons(page);
  const deleteCoupon = useDeleteCoupon();
  const createCoupon = useCreateCoupon();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: { discountType: "PERCENTAGE", discountValue: 10, minimumOrderValue: 0 }
  });

  const columns = useMemo(() => [
    col.accessor("code", {
      header: "Coupon Code",
      cell: (info) => <span className="font-mono font-bold text-[#1A365D] dark:text-[#3B82F6] bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-md">{info.getValue()}</span>,
    }),
    col.accessor("discountType", {
      header: "Discount",
      cell: (info) => {
        const val = info.row.original.discountValue;
        return info.getValue() === "PERCENTAGE" ? `${val}% OFF` : formatCurrency(val);
      },
    }),
    col.accessor("minimumOrderValue", {
      header: "Min Spend",
      cell: (info) => info.getValue() > 0 ? formatCurrency(info.getValue()) : "None",
    }),
    col.accessor("validTo", {
      header: "Validity",
      cell: (info) => {
        const from = new Date(info.row.original.validFrom);
        const to = new Date(info.getValue());
        const isActive = to > new Date() && from <= new Date();
        return (
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">{format(from, "MMM d")} - {format(to, "MMM d, yyyy")}</span>
            {isActive ? (
              <span className="text-[10px] uppercase font-bold text-green-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Active</span>
            ) : (
              <span className="text-[10px] uppercase font-bold text-red-500 flex items-center gap-1"><XCircle className="w-3 h-3"/> Expired/Future</span>
            )}
          </div>
        );
      },
    }),
    col.accessor("usedCount", {
      header: "Usage",
      cell: (info) => (
        <span className="text-sm">
          {info.getValue()} {info.row.original.usageLimit ? `/ ${info.row.original.usageLimit}` : "used"}
        </span>
      ),
    }),
    col.display({
      id: "actions",
      cell: (info) => (
        <button
          onClick={() => {
            if (confirm("Delete this coupon?")) deleteCoupon.mutate(info.row.original.id);
          }}
          className="p-1.5 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    }),
  ], [deleteCoupon]);

  const table = useReactTable({
    data: coupons ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20 } },
  });

  const onSubmit = (data: CouponFormData) => {
    // Convert current dates to ISO strings that Spring Boot expects easily
    createCoupon.mutate({
      ...data,
      validFrom: new Date(data.validFrom).toISOString(),
      validTo: new Date(data.validTo).toISOString(),
    }, {
      onSuccess: () => {
        setIsModalOpen(false);
        reset();
      }
    });
  };

  const fieldClass = (error?: boolean) => cn(
    "w-full h-10 px-3 rounded-lg border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
    error ? "border-red-500" : "border-input"
  );

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title="Store Coupons"
        description="Manage discounts and promo codes for your products."
        action={
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1A365D] text-white text-sm font-medium hover:bg-[#1E3A5F] transition-colors">
            <PlusCircle className="w-4 h-4" /> Create Coupon
          </button>
        }
      />

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-muted-foreground" /></div>
        ) : !coupons?.length ? (
          <EmptyState
            icon={<Ticket className="w-8 h-8" />}
            title="No coupons found"
            description="Create your first promo code to boost sales."
            action={
              <button onClick={() => setIsModalOpen(true)} className="btn-cta px-4 py-2 rounded-lg text-sm mt-2">
                Create Coupon
              </button>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b border-border text-xs uppercase text-muted-foreground font-semibold">
                {table.getHeaderGroups().map(hg => (
                  <tr key={hg.id}>
                    {hg.headers.map(h => (
                      <th key={h.id} className="px-5 py-3">{flexRender(h.column.columnDef.header, h.getContext())}</th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className="px-5 py-3 whitespace-nowrap">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground">Create Coupon</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Coupon Code *</label>
                <input {...register("code")} placeholder="e.g. SUMMER2026" className={fieldClass(!!errors.code)} />
                {errors.code && <p className="text-xs text-red-500 mt-1">{errors.code.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Discount Type</label>
                  <select {...register("discountType")} className={fieldClass(!!errors.discountType)}>
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED_AMOUNT">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Value *</label>
                  <input type="number" {...register("discountValue", { valueAsNumber: true })} className={fieldClass(!!errors.discountValue)} />
                  {errors.discountValue && <p className="text-xs text-red-500 mt-1">{errors.discountValue.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Minimum Order Spend (SYP) *</label>
                <input type="number" {...register("minimumOrderValue", { valueAsNumber: true })} className={fieldClass(!!errors.minimumOrderValue)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Valid From *</label>
                  <input type="datetime-local" {...register("validFrom")} className={fieldClass(!!errors.validFrom)} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Valid To *</label>
                  <input type="datetime-local" {...register("validTo")} className={fieldClass(!!errors.validTo)} />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={createCoupon.isPending} className="btn-cta px-6 py-2 rounded-lg text-sm flex items-center gap-2">
                  {createCoupon.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
