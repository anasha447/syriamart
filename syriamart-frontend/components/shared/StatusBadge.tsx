import React from "react";
import { getOrderStatusConfig, cn } from "@/lib/utils";
import type { OrderStatus } from "@/types/api";

interface StatusBadgeProps {
  status:     OrderStatus;
  className?: string;
  size?:      "sm" | "md";
}

/**
 * Reusable pill badge for order and order item statuses.
 * Color coding follows the brand semantic system:
 *   Green  → delivered, confirmed
 *   Blue   → processing, shipped
 *   Amber  → pending
 *   Red    → cancelled
 *   Gray   → returned, refunded
 */
export function StatusBadge({ status, className, size = "md" }: StatusBadgeProps) {
  const cfg = getOrderStatusConfig(status);
  return (
    <span className={cn(
      "inline-flex items-center rounded-full font-semibold uppercase tracking-wide",
      size === "sm" ? "text-[9px] px-2 py-0.5" : "text-[10px] px-2.5 py-0.5",
      cfg.className,
      className
    )}>
      {cfg.label}
    </span>
  );
}
