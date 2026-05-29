"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Box,
  ChevronLeft,
  LayoutDashboard,
  PackageSearch,
  Settings,
  ShoppingCart,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Inventory", href: "/inventory", icon: PackageSearch },
  { label: "Orders", href: "/orders", icon: ShoppingCart },
  { label: "Alerts", href: "/alerts", icon: AlertTriangle },
  { label: "Settings", href: "/settings", icon: Settings }
];

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, mobileOpen, onCollapse, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    setPendingHref(null);
  }, [pathname]);

  return (
    <>
      {mobileOpen ? (
        <button
          aria-label="Close sidebar overlay"
          className="fixed inset-0 z-40 bg-slate-950/30 lg:hidden"
          onClick={onMobileClose}
        />
      ) : null}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex border-r bg-card transition-all duration-200",
          collapsed ? "w-20" : "w-72",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex w-full flex-col">
          <div className="flex h-16 items-center justify-between border-b px-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white dark:bg-primary">
                <Box className="h-5 w-5" />
              </div>
              {!collapsed ? (
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">Commerce Pulse</p>
                  <p className="truncate text-xs text-muted-foreground">Merchant operations</p>
                </div>
              ) : null}
            </div>
            <Button className="lg:hidden" variant="ghost" size="icon" onClick={onMobileClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="flex-1 space-y-1 p-3">
            {items.map((item) => {
              const activePath = pendingHref ?? pathname;
              const active = item.href === "/" ? activePath === "/" : activePath.startsWith(item.href);

              return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={() => {
                  setPendingHref(item.href);
                  onMobileClose();
                }}
                className={cn(
                  "flex h-10 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition duration-150 ease-out active:scale-[0.98]",
                  active
                    ? "animate-nav-select bg-slate-950 text-white shadow-sm dark:bg-primary dark:text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  collapsed && "justify-center px-0"
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className={cn("h-4 w-4 shrink-0 transition-transform duration-150", active && "scale-110")} />
                {!collapsed ? <span>{item.label}</span> : null}
              </Link>
              );
            })}
          </nav>
          <div className="border-t p-3">
            <Button
              className={cn("hidden w-full lg:flex", collapsed && "px-0")}
              variant="secondary"
              onClick={onCollapse}
              size={collapsed ? "icon" : "md"}
            >
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
              {!collapsed ? <span>Collapse</span> : null}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}
