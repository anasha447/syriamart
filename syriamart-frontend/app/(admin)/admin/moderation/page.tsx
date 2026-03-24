"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Eye, Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useModerationQueue, useModerateProduct } from "@/hooks/useProducts";
import { PageHeader }    from "@/components/shared/PageHeader";
import { EmptyState }    from "@/components/shared/EmptyState";
import { productModerationSchema, type ProductModerationFormData } from "@/lib/validation/product.schema";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import type { ProductSummaryResponse } from "@/types/api";

function ModerationCard({ product }: { product: ProductSummaryResponse }) {
  const [expanded,   setExpanded]   = useState(false);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const moderate = useModerateProduct();

  const {
    register, handleSubmit, reset,
    formState: { errors },
  } = useForm<ProductModerationFormData>({
    resolver: zodResolver(productModerationSchema),
    defaultValues: { status: "REJECTED" },
  });

  const handleApprove = () => {
    moderate.mutate({ id: product.id, status: "ACTIVE" });
  };

  const handleReject = handleSubmit((data) => {
    moderate.mutate(
      { id: product.id, status: "REJECTED", reason: data.rejectionReason },
      { onSuccess: () => { setActionType(null); reset(); } }
    );
  });

  const isPending = moderate.isPending;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="bg-card border border-border rounded-xl overflow-hidden"
    >
      {/* Product header */}
      <div className="flex items-start gap-4 p-5">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex-shrink-0">
          {product.primaryImageUrl
            ? <Image src={product.primaryImageUrl} alt={product.name} fill className="object-cover" sizes="64px" />
            : <Package className="w-6 h-6 text-neutral-300 m-auto mt-5" />
          }
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{product.name}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Submitted {formatDate(product.createdAt ?? new Date().toISOString(), "relative")}
              </p>
            </div>
            <p className="text-sm font-bold text-foreground whitespace-nowrap tabular-nums">
              {formatCurrency(product.effectivePrice)}
            </p>
          </div>

          <div className="flex items-center gap-3 mt-3">
            {/* Approve */}
            <button
              onClick={handleApprove}
              disabled={isPending}
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors",
                "bg-[#F0FDF4] text-[#16A34A] border border-green-200 dark:bg-green-900/20 dark:border-green-800",
                "hover:bg-green-100 dark:hover:bg-green-900/40",
                "disabled:opacity-40 disabled:cursor-not-allowed"
              )}
            >
              {isPending && actionType !== "reject"
                ? <Loader2 className="w-3 h-3 animate-spin" />
                : <CheckCircle className="w-3 h-3" />
              }
              Approve
            </button>

            {/* Reject toggle */}
            <button
              onClick={() => setActionType(actionType === "reject" ? null : "reject")}
              className={cn(
                "flex items-center gap-1.5 h-8 px-3 rounded-lg text-xs font-semibold transition-colors",
                "bg-[#FEF2F2] text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800",
                "hover:bg-red-100 dark:hover:bg-red-900/40"
              )}
            >
              <XCircle className="w-3 h-3" />
              Reject
            </button>

            {/* Preview link */}
            <Link
              href={`/products/${product.slug}`}
              target="_blank"
              className="ml-auto flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </Link>
          </div>
        </div>
      </div>

      {/* Rejection reason form */}
      <AnimatePresence>
        {actionType === "reject" && (
          <motion.form
            onSubmit={handleReject}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border"
          >
            <div className="p-5 space-y-3">
              <label className="block text-xs font-medium text-foreground">
                Rejection reason <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("rejectionReason")}
                rows={3}
                placeholder="Explain why this product is being rejected…"
                className={cn(
                  "w-full px-3 py-2.5 rounded-lg text-sm border bg-background",
                  "text-foreground placeholder:text-muted-foreground",
                  "outline-none focus:ring-2 focus:ring-[#1A365D]/20 focus:border-[#1A365D]",
                  "resize-none transition-all",
                  errors.rejectionReason ? "border-red-400" : "border-input"
                )}
              />
              {errors.rejectionReason && (
                <p className="text-xs text-red-500">{errors.rejectionReason.message}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className="h-8 px-4 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 disabled:opacity-40 flex items-center gap-1.5"
                >
                  {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                  Confirm rejection
                </button>
                <button
                  type="button"
                  onClick={() => setActionType(null)}
                  className="h-8 px-3 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ModerationPage() {
  const { data, isLoading } = useModerationQueue();

  return (
    <div className="space-y-6 page-enter">
      <PageHeader
        title="Product Moderation"
        description={
          data
            ? `${data.totalPending} product${data.totalPending !== 1 ? "s" : ""} awaiting review`
            : "Review and approve seller product submissions"
        }
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-32 rounded-xl" />
          ))}
        </div>
      ) : !data?.products.length ? (
        <EmptyState
          icon={<CheckCircle className="w-7 h-7" />}
          title="All caught up!"
          description="There are no products waiting for review right now."
          className="py-20"
        />
      ) : (
        <AnimatePresence mode="popLayout">
          {data.products.map((product) => (
            <ModerationCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
