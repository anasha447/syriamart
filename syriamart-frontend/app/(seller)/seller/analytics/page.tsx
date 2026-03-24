"use client";

import React, { useState } from "react";
import { format, subMonths, startOfMonth } from "date-fns";
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from "recharts";
import { TrendingUp, Package, Users, DollarSign, Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { useSellerAnalyticsHistory, useSellerMonthlyAnalytics } from "@/hooks/useSellerAnalytics";
import { PageHeader } from "@/components/shared/PageHeader";
import { formatCurrency, cn } from "@/lib/utils";

export default function SellerAnalyticsPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const { data: history, isLoading: isHistoryLoading } = useSellerAnalyticsHistory();
  const { data: monthlyData, isLoading: isMonthlyLoading } = useSellerMonthlyAnalytics(
    selectedMonth.getFullYear(),
    selectedMonth.getMonth() + 1
  );

  // Format history for charts
  const chartData = React.useMemo(() => {
    if (!history) return [];
    return [...history].reverse().map(item => ({
      name: `${item.month}/${item.year}`,
      Revenue: item.totalRevenue,
      Orders: item.totalOrders,
      Items: item.totalItemsSold,
    }));
  }, [history]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-card border border-border rounded-xl shadow-lg p-4">
          <p className="font-bold text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-semibold text-foreground">
                {entry.name === "Revenue" ? formatCurrency(entry.value) : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 lg:space-y-8 page-enter pb-12">
      <PageHeader
        title="Store Analytics"
        description="Deep dive into your store's performance and sales trends."
        action={
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-card border border-border rounded-lg shadow-sm">
            <CalendarIcon className="w-4 h-4 text-muted-foreground" />
            <input 
              type="month" 
              value={`${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, '0')}`}
              onChange={(e) => {
                if (e.target.value) {
                  const [y, m] = e.target.value.split('-');
                  setSelectedMonth(new Date(parseInt(y), parseInt(m) - 1, 1));
                }
              }}
              className="bg-transparent border-none outline-none text-sm font-medium text-foreground cursor-pointer"
            />
          </div>
        }
      />

      {/* Monthly KPI Row */}
      <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
        Performance for {format(selectedMonth, "MMMM yyyy")}
        {isMonthlyLoading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="Monthly Revenue" 
          value={formatCurrency(monthlyData?.totalRevenue ?? 0)} 
          icon={<DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
          trend="+12% from last month" // placeholder trend
          trendUp={true}
          bgClass="bg-emerald-50 dark:bg-emerald-900/10"
        />
        <KpiCard 
          title="Total Orders" 
          value={(monthlyData?.totalOrders ?? 0).toLocaleString()} 
          icon={<Package className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
          trend="+5% from last month"
          trendUp={true}
          bgClass="bg-blue-50 dark:bg-blue-900/10"
        />
        <KpiCard 
          title="Items Sold" 
          value={(monthlyData?.totalItemsSold ?? 0).toLocaleString()} 
          icon={<ShoppingCart className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
          trend="-2% from last month"
          trendUp={false}
          bgClass="bg-amber-50 dark:bg-amber-900/10"
        />
        <KpiCard 
          title="Avg Order Value" 
          value={formatCurrency(
            monthlyData?.totalOrders ? monthlyData.totalRevenue / monthlyData.totalOrders : 0
          )} 
          icon={<TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />}
          trend="+8% from last month"
          trendUp={true}
          bgClass="bg-purple-50 dark:bg-purple-900/10"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Revenue Area Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-foreground">Revenue Trend (Last 12 Months)</h3>
          </div>
          <div className="h-[300px] w-full">
            {isHistoryLoading ? (
              <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground"/></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1A365D" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#1A365D" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12 }} 
                    className="text-muted-foreground"
                    tickFormatter={(val) => `£${(val/1000)}k`} // Format as thousands assuming large numbers
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="Revenue" stroke="#1A365D" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No historical data available</div>
            )}
          </div>
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-base font-bold text-foreground">Order Volume</h3>
          </div>
          <div className="h-[300px] w-full">
            {isHistoryLoading ? (
              <div className="w-full h-full flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground"/></div>
            ) : chartData.length > 0 ? (
               <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} className="text-muted-foreground" />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                  <Bar dataKey="Orders" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="Items" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
               <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No historical data available</div>
            )}
          </div>
        </div>

      </div>

      {/* Recent History Table */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm pt-6">
        <h3 className="text-base font-bold text-foreground px-6 mb-4">Detailed Monthly Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground border-y border-border">
              <tr>
                <th className="px-6 py-3 font-medium">Month</th>
                <th className="px-6 py-3 font-medium">Revenue (SYP)</th>
                <th className="px-6 py-3 font-medium">Orders</th>
                <th className="px-6 py-3 font-medium">Items Sold</th>
                <th className="px-6 py-3 font-medium text-right">Avg Order Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isHistoryLoading ? (
                <tr><td colSpan={5} className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" /></td></tr>
              ) : history && history.length > 0 ? (
                history.map((row, idx) => (
                  <tr key={idx} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{row.month}/{row.year}</td>
                    <td className="px-6 py-4 text-emerald-600 dark:text-emerald-400 font-medium">{formatCurrency(row.totalRevenue)}</td>
                    <td className="px-6 py-4 font-medium">{row.totalOrders}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.totalItemsSold}</td>
                    <td className="px-6 py-4 text-right tabular-nums text-muted-foreground">
                      {row.totalOrders > 0 ? formatCurrency(row.totalRevenue / row.totalOrders) : formatCurrency(0)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No data available</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ── Shared Subcomponents ──────────────────────────────────────────────────────
function ShoppingCart(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="21" r="1"/>
      <circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}

function KpiCard({ title, value, icon, trend, trendUp, bgClass }: { title: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean, bgClass: string }) {
  return (
    <div className="bg-white dark:bg-card border border-border rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", bgClass)}>
          {icon}
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
        <p className={cn("text-xs font-medium", trendUp ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400")}>
          {trend}
        </p>
      </div>
    </div>
  );
}
