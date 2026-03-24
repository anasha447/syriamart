import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title:       string;
  value:       string | number;
  subtitle?:   string;
  /** Positive = green arrow up, negative = red arrow down, 0 = flat */
  trend?:      number;
  trendLabel?: string;
  icon?:       React.ReactNode;
  accent?:     "blue" | "green" | "amber" | "purple" | "red";
  className?:  string;
}

const ACCENT_CLASSES = {
  blue:   "bg-[#EFF6FF] dark:bg-[#172554] text-[#1A365D] dark:text-[#3B82F6]",
  green:  "bg-[#F0FDF4] dark:bg-green-900/20 text-[#16A34A] dark:text-green-400",
  amber:  "bg-[#FFF7E6] dark:bg-amber-900/20 text-[#FF9900] dark:text-amber-400",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400",
  red:    "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400",
} as const;

/**
 * Reusable KPI metric card.
 * Used in seller dashboard, admin dashboard, and driver shift summary.
 * RSC-safe — no client state. Trend indicator is pure JSX.
 */
export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendLabel,
  icon,
  accent = "blue",
  className,
}: KPICardProps) {
  const trendPositive = trend !== undefined && trend > 0;
  const trendNegative = trend !== undefined && trend < 0;
  const trendFlat     = trend === 0;

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-5",
        "flex flex-col gap-4",
        className
      )}
    >
      {/* Top row: icon + title */}
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && (
          <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center", ACCENT_CLASSES[accent])}>
            {icon}
          </div>
        )}
      </div>

      {/* Value */}
      <div>
        <p className="text-2xl font-bold text-foreground tracking-tight tabular-nums">
          {value}
        </p>

        {/* Trend row */}
        {(trend !== undefined || subtitle) && (
          <div className="flex items-center gap-2 mt-1.5">
            {trend !== undefined && (
              <span className={cn(
                "inline-flex items-center gap-0.5 text-xs font-semibold",
                trendPositive && "text-[#16A34A] dark:text-green-400",
                trendNegative && "text-red-600 dark:text-red-400",
                trendFlat     && "text-muted-foreground"
              )}>
                {trendPositive && <TrendingUp  className="w-3.5 h-3.5" />}
                {trendNegative && <TrendingDown className="w-3.5 h-3.5" />}
                {trendFlat     && <Minus        className="w-3.5 h-3.5" />}
                {trendPositive && "+"}
                {Math.abs(trend)}%
              </span>
            )}
            {(trendLabel ?? subtitle) && (
              <p className="text-xs text-muted-foreground truncate">
                {trendLabel ?? subtitle}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
