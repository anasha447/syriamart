"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Save, Loader2, User, Mail, Phone, Camera } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { apiClient as api, getErrorMessage } from "@/lib/api/client";
import { useAuthStore } from "@/lib/store/auth.store";
import { cn } from "@/lib/utils";

const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters").max(120),
  phone:    z.string().min(9, "Enter a valid phone number").max(20),
});
type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const qc                = useQueryClient();
  const { user, updateUser } = useAuthStore();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user", "profile", "detail"],
    queryFn:  () => api.get<{ id: string; fullName: string; email: string; phone: string }>("/api/users/me"),
    staleTime: 5 * 60 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProfileFormData) => api.put("/api/users/me", { body: data }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["user", "profile"] });
      const parts = vars.fullName.trim().split(" ");
      updateUser({ firstName: parts[0], lastName: parts.slice(1).join(" ") || undefined });
      toast.success("Profile updated successfully.");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({ resolver: zodResolver(profileSchema) });

  useEffect(() => {
    if (profile) {
      reset({ fullName: profile.fullName, phone: profile.phone });
    }
  }, [profile, reset]);

  const fieldClass = (hasError: boolean) => cn(
    "w-full h-11 px-3 rounded-xl border bg-background text-sm text-foreground",
    "placeholder:text-muted-foreground outline-none transition-all duration-150",
    "focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
    "dark:focus:ring-[#3B82F6]/20 dark:focus:border-[#3B82F6]",
    hasError ? "border-red-400" : "border-input"
  );

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">My Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your personal information</p>
      </div>

      {/* Avatar section */}
      <div className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-white dark:bg-card">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-[#1A365D] text-white text-xl font-bold flex items-center justify-center">
            {(user?.firstName?.[0] ?? user?.email?.[0] ?? "U").toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#FF9900] text-[#0F172A] flex items-center justify-center shadow-sm hover:bg-[#E68A00] transition-colors">
            <Camera className="w-3 h-3" />
          </button>
        </div>
        <div>
          <p className="font-semibold text-foreground">
            {user?.firstName ? `${user.firstName} ${user.lastName ?? ""}`.trim() : user?.email}
          </p>
          <p className="text-xs text-muted-foreground capitalize">{user?.role?.toLowerCase()} account</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))}
        className="p-5 rounded-2xl border border-border bg-white dark:bg-card space-y-5"
      >
        <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <User className="w-4 h-4 text-[#1A365D] dark:text-[#3B82F6]" />
          Personal Information
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full name */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5">Full Name</label>
            <input {...register("fullName")} placeholder="Your full name" className={fieldClass(!!errors.fullName)} />
            {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>}
          </div>

          {/* Email (read-only) */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-muted-foreground" />
              Email Address
            </label>
            <input
              value={user?.email ?? ""}
              disabled
              className="w-full h-11 px-3 rounded-xl border border-input bg-muted text-sm text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>

          {/* Phone */}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1.5 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-muted-foreground" />
              Phone Number
            </label>
            <input {...register("phone")} type="tel" placeholder="+963 912 345 678" className={fieldClass(!!errors.phone)} />
            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
          </div>
        </div>

        {isDirty && (
          <motion.button
            type="submit"
            disabled={updateMutation.isPending}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 h-10 px-5 rounded-xl bg-[#1A365D] text-white text-sm font-semibold hover:bg-[#1E3A5F] transition-colors disabled:opacity-60"
          >
            {updateMutation.isPending
              ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Saving…</>
              : <><Save className="w-3.5 h-3.5" />Save Changes</>
            }
          </motion.button>
        )}
      </form>
    </div>
  );
}
