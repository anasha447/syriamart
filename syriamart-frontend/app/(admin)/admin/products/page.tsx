"use client";

import React, { useState } from "react";
import { Package, Search, Plus } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState } from "@/components/shared/EmptyState";

export default function AdminProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6 page-enter">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader
          title="Products Management"
          description="View and moderate all products across the platform."
        />
        <button className="btn-cta flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-[#1A365D] text-white hover:bg-[#1E3A5F]">
          <Plus className="w-4 h-4" /> Export Catalog
        </button>
      </div>

      {/* Basic Search Header */}
      <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-xl shadow-sm">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search all products..."
            className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1A365D]/20 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl flex flex-col items-center justify-center p-12 text-center shadow-sm">
        <EmptyState
          icon={<Package className="w-12 h-12 text-muted-foreground" />}
          title="Product moderation coming soon"
          description="The centralized product catalog view is currently being developed. You will be able to search and moderate all entries."
        />
      </div>
    </div>
  );
}
