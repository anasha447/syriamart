"use client";

import React, { useState, useMemo } from "react";
import { useReactTable, getCoreRowModel, getPaginationRowModel, flexRender, createColumnHelper } from "@tanstack/react-table";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PlusCircle, Loader2, Navigation, CheckCircle2, XCircle, Phone, Truck } from "lucide-react";

import { useAdminDrivers, useAdminRegisterDriver, useAdminSetDriverStatus } from "@/hooks/useAdmin";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

const driverSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(8, "Phone number required"),
  password: z.string().min(6, "Must be at least 6 characters"),
  vehicleType: z.enum(["BIKE", "CAR", "VAN", "TRUCK"]),
  vehiclePlate: z.string().min(3, "Plate number required"),
});
type DriverFormData = z.infer<typeof driverSchema>;

const col = createColumnHelper<any>();

export default function AdminDriversPage() {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: drivers, isLoading } = useAdminDrivers();
  const registerDriver = useAdminRegisterDriver();
  const setStatus = useAdminSetDriverStatus();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DriverFormData>({
    resolver: zodResolver(driverSchema),
    defaultValues: { vehicleType: "VAN" }
  });

  const columns = useMemo(() => [
    col.accessor("fullName", {
      header: "Driver Info",
      cell: (info) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-700 dark:text-slate-300">
            <Truck className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-foreground">{info.getValue()}</span>
            <span className="text-xs text-muted-foreground">{info.row.original.email}</span>
          </div>
        </div>
      ),
    }),
    col.accessor("phone", {
      header: "Contact",
      cell: (info) => (
        <div className="flex items-center gap-1.5 text-sm">
          <Phone className="w-3.5 h-3.5 text-muted-foreground" />
          {info.getValue() || "N/A"}
        </div>
      ),
    }),
    col.accessor("vehicle", {
      header: "Vehicle",
      cell: (info) => (
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{info.row.original.vehicleType}</span>
          <span className="text-sm font-mono bg-muted px-1.5 py-0.5 rounded w-max mt-0.5">{info.row.original.vehiclePlate}</span>
        </div>
      ),
    }),
    col.accessor("status", {
      header: "Status",
      cell: (info) => {
        const st = info.getValue() as string;
        const color = 
          st === "ACTIVE" || st === "ONLINE" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
          st === "ON_DELIVERY" ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
          st === "OFFLINE" ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400" :
          "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400";
        return <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center gap-1.5 w-max", color)}>{st}</span>;
      },
    }),
    col.display({
      id: "actions",
      header: "Quick Action",
      cell: (info) => {
        const isActive = ["ACTIVE", "ONLINE", "ON_DELIVERY", "IDLE"].includes(info.row.original.status);
        return (
          <div className="flex items-center justify-end">
             <button
                onClick={() => setStatus.mutate({ id: info.row.original.id, status: isActive ? "SUSPENDED" : "ACTIVE" })}
                disabled={setStatus.isPending}
                className={cn(
                  "text-xs font-medium px-3 py-1.5 rounded-md transition-colors",
                  isActive ? "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20" : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                )}
             >
                {isActive ? "Suspend" : "Activate"}
             </button>
          </div>
        );
      },
    }),
  ], [setStatus]);

  const table = useReactTable({
    data: (drivers as any[]) ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  const onSubmit = (data: DriverFormData) => {
    registerDriver.mutate(data, {
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
    <div className="space-y-6 page-enter pb-12">
      <PageHeader
        title="Fleet Management"
        description="Manage the logistics fleet, register new delivery drivers, and monitor their status."
        action={
          <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1A365D] text-white text-sm font-medium hover:bg-[#1E3A5F] transition-colors">
            <PlusCircle className="w-4 h-4" /> Add Driver
          </button>
        }
      />

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
        ) : !(drivers as any[])?.length ? (
          <EmptyState
            icon={<Navigation className="w-10 h-10" />}
            title="No drivers registered"
            description="Build your delivery fleet by adding the first driver."
            action={
              <button onClick={() => setIsModalOpen(true)} className="btn-cta px-4 py-2 rounded-lg text-sm mt-3">
                Register Driver
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
                      <th key={h.id} className={cn("px-6 py-4 whitespace-nowrap", h.id === "actions" && "text-right")}>
                        {flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-border">
                {table.getRowModel().rows.map(row => (
                  <tr key={row.id} className="hover:bg-muted/30 transition-colors">
                    {row.getVisibleCells().map(cell => (
                      <td key={cell.id} className={cn("px-6 py-4 whitespace-nowrap", cell.column.id === "actions" && "text-right")}>
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

      {/* Register Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-modal flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Navigation className="w-5 h-5 text-[#1A365D]" /> 
                Register New Driver
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Full Name *</label>
                  <input {...register("fullName")} className={fieldClass(!!errors.fullName)} />
                  {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1.5">Email Address *</label>
                  <input type="email" {...register("email")} className={fieldClass(!!errors.email)} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Phone Number *</label>
                  <input type="tel" {...register("phone")} className={fieldClass(!!errors.phone)} />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Temporary Password *</label>
                  <input type="text" {...register("password")} className={fieldClass(!!errors.password)} placeholder="Will be required for first login" />
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-border">
                <h4 className="text-sm font-bold text-foreground mb-4">Vehicle Details</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">Vehicle Type</label>
                    <select {...register("vehicleType")} className={fieldClass(!!errors.vehicleType)}>
                      <option value="BIKE">Motorbike</option>
                      <option value="CAR">Car</option>
                      <option value="VAN">Van</option>
                      <option value="TRUCK">Truck</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">License Plate *</label>
                    <input {...register("vehiclePlate")} className={fieldClass(!!errors.vehiclePlate)} placeholder="e.g. Damascus 123456" />
                    {errors.vehiclePlate && <p className="text-xs text-red-500 mt-1">{errors.vehiclePlate.message}</p>}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl font-medium text-sm text-foreground bg-muted hover:bg-muted/80 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={registerDriver.isPending} className="btn-cta px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
                  {registerDriver.isPending ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
                  Register Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
