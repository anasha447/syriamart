"use client";

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, type TooltipProps,
} from "recharts";
import type { MonthlyRevenue } from "@/types/api";
import { formatCurrency } from "@/lib/utils";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

interface RevenueLineChartProps {
  data:      MonthlyRevenue[];
  height?:   number;
  color?:    string;
}

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm">
      <p className="text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-foreground">
        {formatCurrency(payload[0]?.value ?? 0)}
      </p>
    </div>
  );
}

/**
 * Monthly revenue area chart using Recharts.
 * Used by both the seller dashboard and admin platform analytics.
 * Dynamically imported with ssr:false on all pages.
 */
export function RevenueLineChart({
  data,
  height = 220,
  color  = "#1A365D",
}: RevenueLineChartProps) {
  const formatted = data.map((d) => ({
    name:    MONTHS[(d.month - 1) % 12] ?? `M${d.month}`,
    revenue: d.revenue,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"   stopColor={color} stopOpacity={0.15} />
            <stop offset="95%"  stopColor={color} stopOpacity={0}    />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #E5E7EB)" strokeOpacity={0.5} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #6B7280)" }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-muted-foreground, #6B7280)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) =>
            v >= 1_000_000
              ? `${(v / 1_000_000).toFixed(1)}M`
              : v >= 1_000
              ? `${(v / 1_000).toFixed(0)}K`
              : String(v)
          }
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={color}
          strokeWidth={2}
          fill="url(#revGradient)"
          dot={false}
          activeDot={{ r: 5, fill: color, stroke: "white", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
