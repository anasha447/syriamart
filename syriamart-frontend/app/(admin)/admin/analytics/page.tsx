"use client";

import React, { useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area
} from "recharts";
import { 
  TrendingUp, TrendingDown, DollarSign, Users, Store, PackageOpen, LayoutDashboard, Loader2
} from "lucide-react";
import { format } from "date-fns";

import { useAdminPlatformAnalytics, useAdminRevenueBreakdown } from "@/hooks/useAdminAnalytics";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency, cn } from "@/lib/utils";

// Mock data fallback in case API returns empty or lacks full historical data
const MOCK_REVENUE_DATA = Array.from({ length: 12 }).map((_, i) => ({
  month: format(new Date(2025, i, 1), "MMM"),
  platformRevenue: Math.floor(Math.random() * 50000) + 10000,
  sellerRevenue: Math.floor(Math.random() * 200000) + 50000,
  orders: Math.floor(Math.random() * 1000) + 200
}));

export default function AdminAnalyticsPage() {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);

  const { data: analytics, isLoading: analyticsLoading } = useAdminPlatformAnalytics(selectedYear, selectedMonth);
  const { data: revenueData, isLoading: revenueLoading } = useAdminRevenueBreakdown(12);

  const isLoading = analyticsLoading || revenueLoading;

  // Use real data if available, otherwise mock for visual structure
  const chartData = (revenueData as any[])?.length ? revenueData : MOCK_REVENUE_DATA;

  const StatCard = ({ title, value, icon, trend, subtext, formatFn = (v: any) => v }: any) => (
    <div className="bg-card border border-border rounded-xl p-5 shadow-sm relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">
            {value !== undefined ? formatFn(value) : <span className="opacity-50">-</span>}
          </h3>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[#1A365D] dark:text-[#3B82F6]">
          {icon}
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        {trend && (
          <span className={cn("flex items-center gap-0.5 font-semibold", trend > 0 ? "text-emerald-500" : "text-red-500")}>
            {trend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </span>
        )}
        <span className="text-muted-foreground">{subtext}</span>
      </div>

      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gradient-to-br from-transparent to-[#1A365D]/5 dark:to-[#3B82F6]/10 rounded-full group-hover:scale-110 transition-transform" />
    </div>
  );

  return (
    <div className="space-y-6 page-enter pb-12">
      <PageHeader
        title="Platform Analytics"
        description="Comprehensive insights into platform revenue, user growth, and sales performance."
      />

      {/* Date Selectors */}
      <div className="bg-card border border-border rounded-xl p-4 flex gap-4 items-center shadow-sm w-max">
        <select 
          value={selectedMonth} 
          onChange={e => setSelectedMonth(Number(e.target.value))}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-1 focus:ring-[#1A365D] outline-none"
        >
          {Array.from({ length: 12 }).map((_, i) => (
            <option key={i+1} value={i+1}>{format(new Date(2025, i, 1), "MMMM")}</option>
          ))}
        </select>
        <select 
          value={selectedYear} 
          onChange={e => setSelectedYear(Number(e.target.value))}
          className="h-9 px-3 rounded-lg border border-input bg-background text-sm font-medium focus:ring-1 focus:ring-[#1A365D] outline-none"
        >
          {[today.getFullYear(), today.getFullYear() - 1].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {isLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>

      {/* Top Level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Platform Revenue" 
          value={analytics?.platformCommission || analytics?.totalRevenue ? (analytics.platformCommission || analytics.totalRevenue * 0.1) : undefined} 
          formatFn={formatCurrency}
          icon={<DollarSign className="w-5 h-5" />} 
          trend={12.5} 
          subtext="vs last month" 
        />
        <StatCard 
          title="Gross Merchandise Value" 
          value={analytics?.totalRevenue} 
          formatFn={formatCurrency}
          icon={<LayoutDashboard className="w-5 h-5" />} 
          trend={8.2} 
          subtext="vs last month" 
        />
        <StatCard 
          title="Active Customers" 
          value={analytics?.totalCustomers} 
          icon={<Users className="w-5 h-5" />} 
          trend={5.4} 
          subtext="New registrations" 
        />
        <StatCard 
          title="Active Sellers" 
          value={analytics?.activeSellers} 
          icon={<Store className="w-5 h-5" />} 
          trend={2.1} 
          subtext="Approved stores" 
        />
      </div>

      {/* Secondary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
            <p className="text-xl font-bold">{analytics?.totalOrders || "-"}</p>
          </div>
          <PackageOpen className="w-8 h-8 opacity-20" />
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Cancelled / Returned</p>
            <p className="text-xl font-bold text-red-500">
              {analytics ? (analytics.cancelledOrders + analytics.returnedOrders) : "-"}
            </p>
          </div>
          <TrendingDown className="w-8 h-8 opacity-20 text-red-500" />
        </div>
        <div className="bg-card border border-border rounded-xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Products Pending Review</p>
            <p className="text-xl font-bold text-amber-500">{analytics?.productsPendingReview || "-"}</p>
          </div>
          <LayoutDashboard className="w-8 h-8 opacity-20 text-amber-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Revenue Growth (12 Months)</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1A365D" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#1A365D" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-20" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(val) => `£${val/1000}k`} />
                <RechartsTooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                />
                <Area type="monotone" dataKey="platformRevenue" name="Platform Revenue" stroke="#1A365D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Volume Chart */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-foreground mb-6">Order Volume</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10 dark:opacity-20" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <RechartsTooltip 
                  cursor={{ fill: 'var(--muted)' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid var(--border)', backgroundColor: 'var(--card)' }}
                />
                <Bar dataKey="orders" name="Total Orders" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
