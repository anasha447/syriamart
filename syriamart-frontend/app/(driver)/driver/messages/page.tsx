"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, Bell, Clock, ChevronRight, Info, AlertTriangle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn, formatDate } from "@/lib/utils";

// Mock messages for now — in real app fetch via driverApi.getMessages()
const MOCK_MESSAGES = [
  {
    id: "m1",
    type: "SYSTEM",
    title: "Shift Started",
    body: "Your shift has been recorded. Stay safe on the road!",
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    unread: false,
  },
  {
    id: "m2",
    type: "ORDERS",
    title: "New Order Assigned",
    body: "Order #SM-482 has been assigned to you. Head to the warehouse for pickup.",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
    unread: true,
  },
  {
    id: "m3",
    type: "URGENT",
    title: "Road Closure Alert",
    body: "Heavy traffic near Damascus center. Please use the ring road for faster delivery.",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    unread: true,
  },
];

export default function DriverMessagesPage() {
  // Use a query hook for messages (even if it returns mock data initially)
  const { data: messages, isLoading } = useQuery({
    queryKey: queryKeys.driver.messages(),
    queryFn: async () => MOCK_MESSAGES,
  });

  return (
    <div className="flex flex-col min-h-full bg-[#0F172A]">
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-xl font-bold text-white">Inbox</h1>
        <p className="text-xs text-slate-500 mt-0.5">Notifications from Syriamart Dispatch</p>
      </div>

      <div className="flex-1 px-4 pb-10">
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 w-full bg-slate-900 animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : !messages || messages.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-10 h-10" />}
            title="No messages"
            description="Your inbox is clear. Important delivery alerts will appear here."
            className="py-20"
          />
        ) : (
          <div className="space-y-3 py-4">
            {messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "relative p-4 rounded-2xl border transition-all active:scale-[0.98]",
                  msg.unread 
                    ? "bg-[#1A365D]/20 border-[#1A365D] shadow-sm" 
                    : "bg-slate-900 border-slate-800"
                )}
              >
                {msg.unread && (
                  <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[#FF9900]" />
                )}
                
                <div className="flex gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                    msg.type === "URGENT" ? "bg-red-500/10 text-red-500" :
                    msg.type === "ORDERS" ? "bg-[#FF9900]/10 text-[#FF9900]" :
                    "bg-blue-500/10 text-blue-500"
                  )}>
                    {msg.type === "URGENT" ? <AlertTriangle className="w-5 h-5" /> : 
                     msg.type === "ORDERS" ? <MessageSquare className="w-5 h-5" /> : 
                     <Info className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={cn("text-sm font-bold truncate", msg.unread ? "text-white" : "text-slate-300")}>
                        {msg.title}
                      </p>
                      <span className="text-[10px] text-slate-500 flex items-center gap-1 font-medium whitespace-nowrap ml-2">
                        <Clock className="w-3 h-3" />
                        {formatDate(msg.createdAt, "short")}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {msg.body}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
