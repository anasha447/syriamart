"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Store, Save, Building2, MapPin, AtSign, Phone } from "lucide-react";

import { useSellerProfile, useUpdateSellerProfile } from "@/hooks/useSeller";
import { PageHeader } from "@/components/shared/PageHeader";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters").max(60),
  storeDescription: z.string().max(500).optional(),
  storeImageUrl: z.string().url("Must be a valid URL").optional().or(z.literal('')),
  phone: z.string().min(8, "Phone number is too short").max(20).optional().or(z.literal('')),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function SellerProfilePage() {
  const { data: profile, isLoading } = useSellerProfile();
  const updateProfile = useUpdateSellerProfile();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    if (profile) {
      reset({
        storeName: profile.storeName,
        storeDescription: profile.storeDescription ?? "",
        storeImageUrl: profile.storeImageUrl ?? "",
        phone: profile.phone ?? profile.user?.phone ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = (data: ProfileFormData) => {
    updateProfile.mutate({
      storeName: data.storeName,
      storeDescription: data.storeDescription || undefined,
      storeImageUrl: data.storeImageUrl || undefined,
      phone: data.phone || undefined,
    });
  };

  const fieldClass = (error?: boolean) => cn(
    "w-full h-11 px-3 rounded-xl border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D] dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
    error ? "border-red-500" : "border-input"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="space-y-6 max-w-4xl mx-auto page-enter pb-24">
      <PageHeader
        title="Storefront Profile"
        description="Manage how your store appears to customers on Syriamart."
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Basic Info */}
        <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
            <Store className="w-5 h-5 text-[#1A365D] dark:text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-foreground">Public Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Store Name *</label>
              <input {...register("storeName")} className={fieldClass(!!errors.storeName)} />
              {errors.storeName && <p className="text-xs text-red-500 mt-1">{errors.storeName.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Store Logo / Image URL</label>
              <input type="url" placeholder="https://..." {...register("storeImageUrl")} className={fieldClass(!!errors.storeImageUrl)} />
              {errors.storeImageUrl && <p className="text-xs text-red-500 mt-1">{errors.storeImageUrl.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Contact Phone</label>
              <input type="tel" {...register("phone")} className={fieldClass(!!errors.phone)} />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1.5">Store Description</label>
              <textarea 
                {...register("storeDescription")} 
                placeholder="Tell customers about your products and brand..."
                rows={4} 
                className={cn(fieldClass(!!errors.storeDescription), "h-auto py-3 resize-none")} 
              />
              {errors.storeDescription && <p className="text-xs text-red-500 mt-1">{errors.storeDescription.message}</p>}
            </div>
          </div>
        </div>

        {/* Read-only system info */}
        <div className="bg-muted/30 border border-border rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6 border-b border-border pb-4">
            <Building2 className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-bold text-foreground">Business Details (Read-only)</h2>
            <p className="text-xs text-muted-foreground ml-auto">Contact support to change</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1.5"><AtSign className="w-3.5 h-3.5"/> Owner Email</label>
              <div className="text-sm font-medium text-foreground">{profile.user.email}</div>
            </div>
            
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Company / Full Name</label>
              <div className="text-sm font-medium text-foreground">{profile.user.fullName}</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Tax ID</label>
              <div className="text-sm font-medium font-mono text-foreground">{profile.taxId || "Not provided"}</div>
            </div>

            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Business Reg. No.</label>
              <div className="text-sm font-medium font-mono text-foreground">{profile.businessRegistrationNumber || "Not provided"}</div>
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border p-4 z-10 md:pl-64 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Keep your store profile up to date.</p>
            <button 
              type="submit" 
              disabled={!isDirty || updateProfile.isPending}
              className="btn-cta h-11 px-8 rounded-xl font-medium focus:ring-4 focus:ring-[#1A365D]/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
