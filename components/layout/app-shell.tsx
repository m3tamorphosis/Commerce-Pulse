"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { TopNav } from "@/components/layout/top-nav";
import { useWorkspace } from "@/components/providers/workspace-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { selectedStore, selectedDateRange } = useWorkspace();
  const contentKey = `${selectedStore.id}-${selectedDateRange.id}`;

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onCollapse={() => setCollapsed((value) => !value)}
        onMobileClose={() => setMobileOpen(false)}
      />
      <div className={collapsed ? "lg:pl-20" : "lg:pl-72"}>
        <TopNav onOpenSidebar={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-[1600px] animate-slide-up px-4 py-6 sm:px-6 lg:px-8">
          <div key={contentKey} className="motion-safe:animate-content-switch">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
