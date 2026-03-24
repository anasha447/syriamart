"use client";

import { useRef, useCallback, useState } from "react";
import type SignatureCanvas from "react-signature-canvas";

/**
 * Manages a react-signature-canvas instance.
 *
 * Returns:
 *   padRef      — attach to <SignatureCanvas ref={padRef} />
 *   isEmpty     — true when the canvas has no strokes
 *   toDataURL   — returns the signature as a PNG base64 data URL
 *   clear       — wipes the canvas
 *   handleEnd   — call this on onEnd to track isEmpty state
 *
 * Usage:
 *   const { padRef, isEmpty, toDataURL, clear, handleEnd } = useSignaturePad();
 *
 *   <SignatureCanvas
 *     ref={padRef}
 *     onEnd={handleEnd}
 *     canvasProps={{ className: "w-full h-40 border rounded-lg bg-white" }}
 *   />
 *   {!isEmpty && (
 *     <button onClick={clear}>Clear</button>
 *   )}
 */
export function useSignaturePad() {
  const padRef  = useRef<SignatureCanvas | null>(null);
  const [isEmpty, setIsEmpty] = useState(true);

  const handleEnd = useCallback(() => {
    setIsEmpty(padRef.current?.isEmpty() ?? true);
  }, []);

  const clear = useCallback(() => {
    padRef.current?.clear();
    setIsEmpty(true);
  }, []);

  const toDataURL = useCallback(
    (mimeType: string = "image/png"): string | null => {
      if (!padRef.current || padRef.current.isEmpty()) return null;
      return padRef.current.toDataURL(mimeType);
    },
    []
  );

  /**
   * Uploads the signature to the CDN via the Next.js Route Handler
   * at /api/upload/proof and returns a public URL.
   */
  const uploadSignature = useCallback(async (): Promise<string | null> => {
    const dataUrl = toDataURL();
    if (!dataUrl) return null;

    try {
      const res = await fetch("/api/upload/proof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataUrl, type: "signature" }),
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json() as { url: string };
      return url;
    } catch {
      return null;
    }
  }, [toDataURL]);

  return { padRef, isEmpty, toDataURL, clear, handleEnd, uploadSignature };
}
