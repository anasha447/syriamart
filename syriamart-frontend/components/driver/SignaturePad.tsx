"use client";

import React, { lazy, Suspense } from "react";
import { RotateCcw } from "lucide-react";
import { useSignaturePad } from "@/hooks/useSignaturePad";
import { cn } from "@/lib/utils";

// Dynamic import — SignatureCanvas adds ~20kb, only load on /deliver page
const SignatureCanvas = lazy(() => import("react-signature-canvas"));

interface SignaturePadProps {
  onCapture: (dataUrl: string) => void;
  className?: string;
}

/**
 * Full-width customer signature capture.
 *
 * The driver hands the device to the customer who signs with their finger.
 * On sign-end, the dataURL is passed to onCapture so the parent form can
 * upload it before submitting the delivery proof.
 */
export function SignaturePad({ onCapture, className }: SignaturePadProps) {
  const { padRef, isEmpty, clear, handleEnd } = useSignaturePad();

  const handleSignEnd = () => {
    handleEnd();
    if (padRef.current && !padRef.current.isEmpty()) {
      onCapture(padRef.current.toDataURL("image/png"));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="relative bg-white rounded-2xl overflow-hidden border-2 border-dashed border-slate-600">
        {/* Placeholder text — visible when pad is empty */}
        {isEmpty && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <p className="text-slate-300 text-sm">Sign here with your finger</p>
          </div>
        )}

        <Suspense
          fallback={
            <div className="w-full h-36 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <SignatureCanvas
            ref={padRef}
            onEnd={handleSignEnd}
            canvasProps={{
              className: "w-full h-36 touch-none",
              style: { touchAction: "none" },
            }}
            backgroundColor="white"
            penColor="#1A365D"
          />
        </Suspense>
      </div>

      {/* Clear button — only visible when something is drawn */}
      {!isEmpty && (
        <button
          type="button"
          onClick={clear}
          className="flex items-center gap-1.5 self-end text-xs text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear signature
        </button>
      )}
    </div>
  );
}
