"use client";

import React from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Users, Store, ShoppingBag, TrendingUp,
  AlertCircle, Package, CheckSquare
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { adminApi }           from "@/lib/api/admin";
import { KPICard }            from "@/components/dashboard/KPICard";
import { RecentOrdersTable }  from "@/components/dashboard/RecentOrdersTable";
import { PageHeader }          from "@/components/shared/PageHeader";
import { DashboardSkeleton }   from "@/components/shared/LoadingSkeleton";
import { queryKeys }           from "@/lib/queryClient";
import { formatCurrency, cn }  from "@/lib/utils";

const RevenueLineChart = dynamic(
  () => import("@/components/dashboard/charts/RevenueLineChart").then((m) => m.RevenueLineChart),
  { ssr: false, loading: () => <div className="skeleton h-56 rounded-xl" /> }
);
const OrdersBarChart = dynamic(
  () => import("@/components/dashboard/charts/OrdersBarChart").then((m) => m.OrdersBarChart),
  { ssr: false, loading: () => <div className="skeleton h-56 rounded-xl" /> }
);

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: queryKeys.admin.dashboard(),
    queryFn:  adminApi.getDashboard,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) return <DashboardSkeleton />;

  return (
    <div className="space-y-8 page-enter">
      <PageHeader
        title="Platform Overview"
        description="SyrianMart real-time performance dashboard"
      />

      {/* Moderation alert */}
      {data && data.pendingProductModeration > 0 && (
        <Link href="/admin/moderation">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#FFF7E6] dark:bg-amber-900/20 border border-[#FF9900]/30 hover:border-[#FF9900]/60 transition-colors cursor-pointer">
            <AlertCircle className="w-5 h-5 text-[#FF9900] flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-[#854F0B] dark:text-amber-300">
                {data.pendingProductModeration} products awaiting moderation
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
                Click to review and approve or reject.
              </p>
            </div>
            <span className="text-xs font-bold text-[#FF9900]">Review →</span>
          </div>
        </Link>
      )}

      {/* KPIs */}
      {data && (
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          <KPICard
            title="Revenue this month"
            value={formatCurrency(data.revenueThisMonth)}
            trend={8}
            trendLabel="vs last month"
            icon={<TrendingUp className="w-4 h-4" />}
            accent="green"
          />
          <KPICard
            title="Orders this month"
            value={data.ordersThisMonth}
            trend={5}
            trendLabel="vs last month"
            icon={<ShoppingBag className="w-4 h-4" />}
            accent="blue"
          />
          <KPICard
            title="Active sellers"
            value={data.activeSellers}
            icon={<Store className="w-4 h-4" />}
            accent="purple"
          />
          <KPICard
            title="Total customers"
            value={data.totalCustomers.toLocaleString()}
            icon={<Users className="w-4 h-4" />}
            accent="amber"
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Platform revenue trend</h2>
          {data?.revenueChart?.length ? (
            <RevenueLineChart data={data.revenueChart} color="#1A365D" />
          ) : (
            <div className="h-56 flex items-center justify-center text-sm text-muted-foreground">No data</div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Top sellers — revenue</h2>
          <div className="space-y-3">
            {data?.topSellers?.slice(0, 6).map((seller, rank) => (
              <div key={seller.sellerId} className="flex items-center gap-3">
                <span className="w-5 text-xs font-bold text-muted-foreground text-right flex-shrink-0">
                  {rank + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {seller.storeName ?? `Seller ${seller.sellerId.slice(0, 6)}`}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A365D] dark:bg-[#3B82F6] rounded-full"
                        style={{
                          width: `${Math.min(100, (seller.totalRevenue / (data.topSellers[0]?.totalRevenue || 1)) * 100)}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap tabular-nums">
                      {formatCurrency(seller.totalRevenue)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      {data?.topProducts && data.topProducts.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground">Top products platform-wide</h2>
            <Link href="/admin/products" className="text-xs text-[#1A365D] dark:text-[#3B82F6] hover:underline">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.topProducts.slice(0, 6).map((p, rank) => (
              <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg border border-border">
                <span className={cn(
                  "w-6 h-6 rounded-full text-[10px] font-bold flex items-center justify-center flex-shrink-0",
                  rank === 0 && "bg-[#FF9900] text-[#0F172A]",
                  rank  > 0 && "bg-muted text-muted-foreground"
                )}>
                  {rank + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground">{p.totalSold} sold · {formatCurrency(p.effectivePrice)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
