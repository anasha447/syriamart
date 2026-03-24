"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import {
  ShoppingBag, Package, Star, TrendingUp,
  AlertCircle, PlusCircle
} from "lucide-react";
import Link from "next/link";
import { useSellerDashboard, useSellerAnalyticsHistory } from "@/hooks/useSellerAnalytics";
import { KPICard }            from "@/components/dashboard/KPICard";
import { RecentOrdersTable }  from "@/components/dashboard/RecentOrdersTable";
import { PageHeader }          from "@/components/shared/PageHeader";
import { DashboardSkeleton }   from "@/components/shared/LoadingSkeleton";
import { formatCurrency, cn }  from "@/lib/utils";

// Charts: dynamically imported with ssr:false — they use browser APIs (ResizeObserver).
// The Skeleton renders server-side; the chart hydrates client-side without blocking
// the initial page paint.
const RevenueLineChart = dynamic(
  () => import("@/components/dashboard/charts/RevenueLineChart").then((m) => m.RevenueLineChart),
  { ssr: false, loading: () => <div className="skeleton h-56 rounded-xl" /> }
);
const OrdersBarChart = dynamic(
  () => import("@/components/dashboard/charts/OrdersBarChart").then((m) => m.OrdersBarChart),
  { ssr: false, loading: () => <div className="skeleton h-56 rounded-xl" /> }
);

export default function SellerDashboardPage() {
  const { data: dash,      isLoading: dashLoading }      = useSellerDashboard();
  const { data: analytics, isLoading: analyticsLoading } = useSellerAnalyticsHistory();

  if (dashLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 page-enter">
      {/* Header */}
      <PageHeader
        title="Seller Dashboard"
        description="Overview of your store performance"
        action={
          <Link
            href="/seller/products/new"
            className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#1A365D] text-white text-sm font-medium hover:bg-[#1E3A5F] transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Add Product
          </Link>
        }
      />

      {/* Pending product approval alert */}
      {dash && dash.pendingProducts > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFF7E6] dark:bg-amber-900/20 border border-[#FF9900]/30">
          <AlertCircle className="w-5 h-5 text-[#FF9900] flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#854F0B] dark:text-amber-300">
              {dash.pendingProducts} product{dash.pendingProducts > 1 ? "s" : ""} awaiting review
            </p>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Your submissions are being reviewed by our team.
            </p>
          </div>
          <Link href="/seller/products" className="text-xs font-semibold text-[#FF9900] whitespace-nowrap hover:underline">
            View →
          </Link>
        </div>
      )}

      {/* KPI Row */}
      {dash && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard
            title="Revenue this month"
            value={formatCurrency(dash.revenueThisMonth)}
            trend={12}
            trendLabel="vs last month"
            icon={<TrendingUp className="w-4 h-4" />}
            accent="green"
          />
          <KPICard
            title="Orders this month"
            value={dash.ordersThisMonth}
            trend={4}
            trendLabel="vs last month"
            icon={<ShoppingBag className="w-4 h-4" />}
            accent="blue"
          />
          <KPICard
            title="Active products"
            value={dash.activeProducts}
            subtitle={`${dash.pendingProducts} pending review`}
            icon={<Package className="w-4 h-4" />}
            accent="purple"
          />
          <KPICard
            title="Average rating"
            value={`${dash.averageRating.toFixed(1)} ★`}
            subtitle="From customer reviews"
            icon={<Star className="w-4 h-4" />}
            accent="amber"
          />
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue trend */}
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Revenue — last 12 months</h2>
            {dash && (
              <span className="text-xs text-muted-foreground">
                Total: {formatCurrency(analytics?.reduce((s, a) => s + a.totalRevenue, 0) ?? 0)}
              </span>
            )}
          </div>
          {analyticsLoading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : analytics && analytics.length > 0 ? (
            <RevenueLineChart
              data={analytics.map((a) => ({ year: a.year, month: a.month, revenue: a.totalRevenue }))}
              color="#1A365D"
            />
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
              No revenue data yet
            </div>
          )}
        </div>

        {/* Orders bar chart */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Orders — completed vs cancelled</h2>
          {analyticsLoading ? (
            <div className="skeleton h-56 rounded-xl" />
          ) : analytics && analytics.length > 0 ? (
            <OrdersBarChart data={analytics} />
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">
              No order data yet
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      {dash && dash.topProducts.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Top products</h2>
            <Link href="/seller/products" className="text-xs text-[#1A365D] dark:text-[#3B82F6] hover:underline">
              Manage all
            </Link>
          </div>
          <div className="space-y-3">
            {dash.topProducts.map((product, rank) => (
              <div key={product.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <span className={cn(
                  "w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0",
                  rank === 0 && "bg-[#FF9900] text-[#0F172A]",
                  rank === 1 && "bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300",
                  rank === 2 && "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
                  rank  > 2 && "bg-neutral-100 dark:bg-neutral-800 text-muted-foreground"
                )}>
                  {rank + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">{product.totalSold} sold</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-semibold text-foreground tabular-nums">
                    {formatCurrency(product.effectivePrice)}
                  </p>
                  <p className="text-xs text-muted-foreground">{product.averageRating.toFixed(1)} ★</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      {dash && dash.recentOrders.length > 0 && (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Recent orders</h2>
            <Link href="/seller/orders" className="text-xs text-[#1A365D] dark:text-[#3B82F6] hover:underline">
              View all
            </Link>
          </div>
          <RecentOrdersTable orders={dash.recentOrders} basePath="/seller/orders" />
        </div>
      )}
    </div>
  );
}
