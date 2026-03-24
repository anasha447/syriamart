import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title:       string;
  description?: string;
  action?:     React.ReactNode;
  className?:  string;
}

/**
 * Consistent section header for seller and admin dashboard pages.
 * RSC-safe — no client-side state.
 */
export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between gap-4 flex-wrap", className)}>
      <div>
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
