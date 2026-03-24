"use client";

import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, type TooltipProps,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

// ═══════════════════════════════════════════════════════════════════════════
// OrdersBarChart — completed vs cancelled orders per month
// ═══════════════════════════════════════════════════════════════════════════

interface OrdersBarData {
  month:           number;
  completedOrders: number;
  cancelledOrders: number;
}

interface OrdersBarChartProps {
  data:    OrdersBarData[];
  height?: number;
}

function BarTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-4 py-3 shadow-lg text-sm space-y-1">
      <p className="text-muted-foreground font-medium mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.fill }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-semibold text-foreground">{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export function OrdersBarChart({ data, height = 220 }: OrdersBarChartProps) {
  const formatted = data.map((d) => ({
    name:      MONTHS[(d.month - 1) % 12] ?? `M${d.month}`,
    completed: d.completedOrders,
    cancelled: d.cancelledOrders,
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={formatted} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border, #E5E7EB)" strokeOpacity={0.5} vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
        <Tooltip content={<BarTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
        <Bar dataKey="completed" fill="#16A34A" radius={[4, 4, 0, 0]} />
        <Bar dataKey="cancelled" fill="#DC2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RatingDistributionChart — star rating breakdown (1–5)
// ═══════════════════════════════════════════════════════════════════════════

interface RatingDistributionChartProps {
  distribution: Record<string, number>;
  height?:      number;
}

const RATING_COLORS = ["#DC2626", "#D97706", "#EAB308", "#22C55E", "#16A34A"];

export function RatingDistributionChart({ distribution, height = 180 }: RatingDistributionChartProps) {
  const data = [5, 4, 3, 2, 1].map((star) => ({
    name:  `${star}★`,
    value: distribution[String(star)] ?? 0,
    color: RATING_COLORS[star - 1] ?? "#6B7280",
  }));

  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={75}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Legend
          iconType="circle"
          iconSize={8}
          formatter={(value: string) => (
            <span style={{ fontSize: 11, color: "#6B7280" }}>{value}</span>
          )}
        />
        <Tooltip
          formatter={(value: number, name: string) => [value, name]}
          contentStyle={{
            background: "var(--color-card, white)",
            border: "1px solid var(--color-border, #E5E7EB)",
            borderRadius: 12,
            fontSize: 12,
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
