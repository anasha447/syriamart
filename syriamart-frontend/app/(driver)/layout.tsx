"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DriverBottomNav } from "@/components/layout/DriverBottomNav";
import { DriverSidebar } from "@/components/layout/DriverSidebar";
import { useDriverStore }   from "@/lib/store/driver.store";
import { cn } from "@/lib/utils";

function DarkModeForcer() {
  useEffect(() => {
    const html = document.documentElement;
    html.classList.add("dark");
    return () => { html.classList.remove("dark"); };
  }, []);
  return null;
}

function DriverAuthGuard({ children }: { children: React.ReactNode }) {
  const router          = useRouter();
  const isAuthenticated = useDriverStore((s) => s.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) router.replace("/driver/login");
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;
  return <>{children}</>;
}

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DarkModeForcer />
      <DriverAuthGuard>
        <div className="flex h-[100dvh] w-full bg-[#0F172A] text-white overflow-hidden">
          <DriverSidebar />
          <div className="flex-1 flex flex-col relative w-full md:max-w-none max-w-md mx-auto md:mx-0 overflow-hidden">
            <main
              id="driver-main"
              className="flex-1 overflow-y-auto overflow-x-hidden pb-[88px] md:pb-0 safe-top scrollbar-hide"
            >
              {children}
            </main>
            <div className="md:hidden">
              <DriverBottomNav />
            </div>
          </div>
        </div>
      </DriverAuthGuard>
    </>
  );
}
