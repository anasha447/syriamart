"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { driverApi }          from "@/lib/api/driver";
import { DeliveryProofForm }   from "@/components/driver/DeliveryProofForm";
import { queryKeys }           from "@/lib/queryClient";
import { shortId, cn }         from "@/lib/utils";

export default function DeliverPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const router      = useRouter();

  const { data: tracking } = useQuery({
    queryKey: queryKeys.tracking.byOrderId(orderId),
    queryFn:  () => driverApi.trackOrder(orderId),
    enabled:  !!orderId,
    staleTime: 30 * 1000,
  });

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-4 border-b border-slate-800">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back</span>
        </button>

        <h1 className="text-lg font-semibold text-white">Confirm Delivery</h1>
        <p className="text-sm text-slate-400 mt-0.5">
          Order #{shortId(orderId)}
        </p>

        {/* Delivery address reminder */}
        {tracking && (
          <div className="flex items-start gap-2 mt-3 p-3 rounded-xl bg-slate-800/60">
            <MapPin className="w-4 h-4 text-[#FF9900] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-slate-300 font-medium">
                {tracking.estimatedDeliveryCity ?? "Delivery address"}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Status: {tracking.currentStatus.replace(/_/g, " ")}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Proof form */}
      <div className="flex-1">
        <DeliveryProofForm orderId={orderId} />
      </div>
    </div>
  );
}
