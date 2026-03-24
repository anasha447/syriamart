"use client";

import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Camera, Upload, CheckCircle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SignaturePad } from "./SignaturePad";
import { useSubmitDeliveryProof } from "@/hooks/useDriverOrders";
import { deliveryProofSchema, type DeliveryProofFormData } from "@/lib/validation/driver.schema";
import { cn } from "@/lib/utils";

interface DeliveryProofFormProps {
  orderId: string;
}

/**
 * Final delivery confirmation form.
 * Three steps:
 *   1. Customer signs on the canvas
 *   2. Driver optionally takes a photo of the delivery location
 *   3. Driver enters recipient name and submits
 *
 * On success: navigates back to /driver/orders and fires DeliveryCompletedEvent.
 */
export function DeliveryProofForm({ orderId }: DeliveryProofFormProps) {
  const router            = useRouter();
  const submitMutation    = useSubmitDeliveryProof();
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DeliveryProofFormData>({
    resolver: zodResolver(deliveryProofSchema),
    defaultValues: { signatureImageUrl: "", recipientName: "", notes: "" },
  });

  const signatureUrl = watch("signatureImageUrl");

  // Called by SignaturePad after each stroke — uploads immediately
  const handleSignatureCapture = useCallback(
    async (dataUrl: string) => {
      try {
        const res = await fetch("/api/upload/proof", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ dataUrl, type: "signature" }),
        });
        if (res.ok) {
          const { url } = await res.json() as { url: string };
          setValue("signatureImageUrl", url, { shouldValidate: true });
        }
      } catch {
        // If upload fails, store the dataUrl directly as fallback
        setValue("signatureImageUrl", dataUrl, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const handlePhotoCapture = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploadingPhoto(true);
      try {
        const reader = new FileReader();
        reader.onload = async () => {
          const dataUrl = reader.result as string;
          const res = await fetch("/api/upload/proof", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ dataUrl, type: "photo" }),
          });
          if (res.ok) {
            const { url } = await res.json() as { url: string };
            setPhotoUrl(url);
          }
          setUploadingPhoto(false);
        };
        reader.readAsDataURL(file);
      } catch {
        setUploadingPhoto(false);
        toast.error("Photo upload failed. You can submit without a photo.");
      }
    },
    []
  );

  const onSubmit = handleSubmit(async (data) => {
    // Get GPS coordinates at submission time
    let latitude: number | undefined;
    let longitude: number | undefined;

    if (navigator.geolocation) {
      try {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
              latitude  = coords.latitude;
              longitude = coords.longitude;
              resolve();
            },
            () => resolve(), // Don't block on geo failure
            { timeout: 3000 }
          );
        });
      } catch { /* ignore */ }
    }

    submitMutation.mutate(
      {
        orderId,
        data: {
          signatureImageUrl: data.signatureImageUrl,
          recipientName:     data.recipientName,
          photoProofUrl:     photoUrl ?? undefined,
          notes:             data.notes || undefined,
          latitude,
          longitude,
        },
      },
      {
        onSuccess: () => {
          toast.success("Delivery confirmed!");
          router.replace("/driver/shift/summary");
        },
      }
    );
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 px-4 py-6">
      {/* Step 1 — Signature */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#FF9900] text-[#0F172A] text-xs font-bold flex items-center justify-center">1</div>
          <p className="text-sm font-semibold text-white">Customer signature</p>
          {signatureUrl && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
        </div>
        <SignaturePad onCapture={handleSignatureCapture} />
        {errors.signatureImageUrl && (
          <p className="text-xs text-red-400 mt-1">{errors.signatureImageUrl.message}</p>
        )}
      </motion.div>

      {/* Step 2 — Recipient Name */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-[#FF9900] text-[#0F172A] text-xs font-bold flex items-center justify-center">2</div>
          <p className="text-sm font-semibold text-white">Recipient name</p>
        </div>
        <input
          {...register("recipientName")}
          placeholder="Name of person who received the package"
          className={cn(
            "w-full h-11 px-3 rounded-xl text-sm",
            "bg-slate-800 border text-white placeholder:text-slate-500",
            "outline-none focus:border-[#FF9900] transition-colors",
            errors.recipientName ? "border-red-500" : "border-slate-700"
          )}
        />
        {errors.recipientName && (
          <p className="text-xs text-red-400 mt-1">{errors.recipientName.message}</p>
        )}
      </motion.div>

      {/* Step 3 — Optional photo */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-slate-700 text-slate-300 text-xs font-bold flex items-center justify-center">3</div>
          <p className="text-sm font-semibold text-white">Delivery photo <span className="text-slate-500 font-normal">(optional)</span></p>
          {photoUrl && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
        </div>
        <label className={cn(
          "flex items-center justify-center gap-2 h-14 rounded-xl border-2 border-dashed cursor-pointer transition-colors",
          photoUrl ? "border-green-600 bg-green-900/20" : "border-slate-700 hover:border-slate-500"
        )}>
          {uploadingPhoto ? (
            <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
          ) : photoUrl ? (
            <><CheckCircle className="w-5 h-5 text-green-400" /><span className="text-sm text-green-400">Photo uploaded</span></>
          ) : (
            <><Camera className="w-5 h-5 text-slate-400" /><span className="text-sm text-slate-400">Take delivery photo</span></>
          )}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />
        </label>
      </motion.div>

      {/* Notes */}
      <textarea
        {...register("notes")}
        placeholder="Additional notes (optional)…"
        rows={2}
        className="w-full px-3 py-2.5 rounded-xl text-sm bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 outline-none focus:border-[#FF9900] resize-none transition-colors"
      />

      {/* Submit */}
      <button
        type="submit"
        disabled={submitMutation.isPending || !signatureUrl}
        className={cn(
          "w-full h-13 py-3.5 rounded-2xl font-semibold text-sm transition-all",
          "bg-[#FF9900] text-[#0F172A]",
          "disabled:opacity-40 disabled:cursor-not-allowed",
          "active:scale-[0.98]"
        )}
      >
        {submitMutation.isPending ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />Confirming delivery…
          </span>
        ) : (
          "Confirm Delivery"
        )}
      </button>
    </form>
  );
}
