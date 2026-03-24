"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Pencil, Trash2, Loader2, Home, Briefcase, Store, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient as api, getErrorMessage } from "@/lib/api/client";
import { cn } from "@/lib/utils";
import type { AddressResponse } from "@/types/api";

const GOVERNORATES = [
  "Damascus","Aleppo","Homs","Hama","Latakia","Tartus",
  "Deir ez-Zor","Raqqa","Hasakah","Daraa","As-Suwayda",
  "Quneitra","Idlib","Rif Dimashq",
];

const addressSchema = z.object({
  fullName:     z.string().min(2),
  phone:        z.string().min(9),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city:         z.string().min(2),
  governorate:  z.string().min(2),
  type:         z.enum(["HOME","WORK","STORE","OTHER"]),
});
type AddressFormData = z.infer<typeof addressSchema>;

const TYPE_ICONS = { HOME: Home, WORK: Briefcase, STORE: Store, OTHER: MapPin };
const TYPE_LABELS = { HOME: "Home", WORK: "Work", STORE: "Store", OTHER: "Other" };

export default function AddressesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId,   setEditId]   = useState<string | null>(null);

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn:  () => api.get<AddressResponse[]>("/api/addresses"),
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: (d: AddressFormData) => api.post("/api/addresses", { body: d }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["addresses"] }); setShowForm(false); toast.success("Address added."); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/addresses/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["addresses"] }); toast.success("Address removed."); },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: { type: "HOME" },
  });

  const fc = (hasError: boolean) => cn(
    "w-full h-10 px-3 rounded-xl border bg-background text-sm text-foreground outline-none transition-all",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
    hasError ? "border-red-400" : "border-input"
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">My Addresses</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Save addresses for faster checkout</p>
        </div>
        <button
          onClick={() => { setShowForm(true); reset(); }}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-[#1A365D] text-white text-sm font-medium hover:bg-[#1E3A5F] transition-colors"
        >
          <Plus className="w-4 h-4" />Add New
        </button>
      </div>

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="rounded-2xl border border-[#1A365D]/30 dark:border-[#3B82F6]/20 bg-[#EFF6FF] dark:bg-[#172554]/30 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground">New Address</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSubmit((d) => createMutation.mutate(d))} className="grid grid-cols-2 gap-3">
              {/* Type selector */}
              <div className="col-span-2">
                <div className="flex gap-2">
                  {(["HOME","WORK","STORE","OTHER"] as const).map((t) => {
                    const Icon = TYPE_ICONS[t];
                    return (
                      <label key={t} className="flex-1 cursor-pointer">
                        <input type="radio" value={t} {...register("type")} className="sr-only peer" />
                        <div className={cn(
                          "flex items-center justify-center gap-1.5 h-9 rounded-xl border text-xs font-medium transition-all",
                          "peer-checked:bg-[#1A365D] peer-checked:text-white peer-checked:border-[#1A365D]",
                          "dark:peer-checked:bg-[#3B82F6] dark:peer-checked:border-[#3B82F6]",
                          "text-muted-foreground border-border hover:border-[#1A365D]"
                        )}>
                          <Icon className="w-3.5 h-3.5" />{TYPE_LABELS[t]}
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div><input {...register("fullName")} placeholder="Full name *" className={fc(!!errors.fullName)} /></div>
              <div><input {...register("phone")} placeholder="Phone *" className={fc(!!errors.phone)} /></div>
              <div className="col-span-2"><input {...register("addressLine1")} placeholder="Street address *" className={fc(!!errors.addressLine1)} /></div>
              <div className="col-span-2"><input {...register("addressLine2")} placeholder="Apartment / Building (optional)" className={fc(false)} /></div>
              <div><input {...register("city")} placeholder="City *" className={fc(!!errors.city)} /></div>
              <div>
                <div className="relative">
                  <select {...register("governorate")} className={cn(fc(!!errors.governorate), "appearance-none pr-8")}>
                    <option value="">Governorate *</option>
                    {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="col-span-2 flex gap-2 pt-1">
                <button type="submit" disabled={createMutation.isPending}
                  className="h-9 px-5 rounded-xl bg-[#1A365D] text-white text-sm font-semibold disabled:opacity-60 hover:bg-[#1E3A5F] flex items-center gap-2"
                >
                  {createMutation.isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  Save Address
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="h-9 px-4 rounded-xl border border-border text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2].map((i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
        </div>
      ) : !addresses?.length ? (
        <div className="text-center py-12 rounded-2xl border border-dashed border-border">
          <MapPin className="w-8 h-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm font-medium text-foreground">No addresses saved yet</p>
          <p className="text-xs text-muted-foreground mt-1">Add an address to speed up checkout</p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => {
            const Icon = TYPE_ICONS[addr.type] ?? MapPin;
            return (
              <motion.div key={addr.id} layout
                className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-white dark:bg-card"
              >
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] dark:bg-[#172554] flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-[#1A365D] dark:text-[#3B82F6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-[#1A365D] dark:text-[#3B82F6] uppercase tracking-wide">
                      {TYPE_LABELS[addr.type]}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-foreground">{addr.fullName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ""}, {addr.city}, {addr.governorate}
                  </p>
                  <p className="text-xs text-muted-foreground">{addr.phone}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(addr.id)}
                    disabled={deleteMutation.isPending}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
