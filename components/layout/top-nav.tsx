"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronDown,
  Menu,
  Moon,
  RefreshCcw,
  Store,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SyncIndicator } from "@/components/shared/sync-indicator";
import { StatusBadge } from "@/components/shared/status-badge";
import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { useTheme } from "@/components/providers/theme-provider";
import { formatRelativeMinutes } from "@/lib/utils";

const stores = ["Northstar Supply Co.", "Harbor & Finch", "Brightline Goods"];
const dateRanges = ["Today", "Last 7 days", "Last 30 days", "This quarter"];

export function TopNav({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const [selectedStore, setSelectedStore] = useState(stores[0]);
  const [selectedDateRange, setSelectedDateRange] = useState(dateRanges[1]);
  const [storeOpen, setStoreOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { data, isFetching, refetch } = useDashboardQuery();
  const { theme, toggleTheme } = useTheme();
  const alertCount = data?.alerts.length ?? 0;

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <Button className="lg:hidden" variant="ghost" size="icon" onClick={onOpenSidebar}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="relative hidden md:block">
            <button
              className="flex h-9 max-w-60 items-center gap-2 rounded-lg border bg-card px-3 text-sm font-medium transition duration-150 ease-out hover:bg-muted active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={storeOpen}
              aria-haspopup="menu"
              onClick={() => {
                setStoreOpen((value) => !value);
                setDateOpen(false);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
            >
              <Store className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="truncate">{selectedStore}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
            </button>
            {storeOpen ? (
              <div className="absolute left-0 top-11 z-50 w-64 animate-popover-in overflow-hidden rounded-xl border bg-card shadow-soft">
                <div className="border-b p-3">
                  <p className="text-sm font-semibold">Select store</p>
                  <p className="text-xs text-muted-foreground">Switch merchant workspace context</p>
                </div>
                <div className="p-2">
                  {stores.map((store) => (
                    <button
                      key={store}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.99]"
                      onClick={() => {
                        setSelectedStore(store);
                        setStoreOpen(false);
                      }}
                    >
                      <span>{store}</span>
                      {selectedStore === store ? <Check className="h-4 w-4 text-primary" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative hidden sm:block">
            <button
              className="flex h-9 items-center gap-2 rounded-lg border bg-card px-3 text-sm text-muted-foreground transition duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-expanded={dateOpen}
              aria-haspopup="menu"
              onClick={() => {
                setDateOpen((value) => !value);
                setStoreOpen(false);
                setNotificationsOpen(false);
                setProfileOpen(false);
              }}
            >
              <CalendarDays className="h-4 w-4" />
              <span>{selectedDateRange}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            {dateOpen ? (
              <div className="absolute left-0 top-11 z-50 w-48 animate-popover-in overflow-hidden rounded-xl border bg-card shadow-soft">
                <div className="border-b p-3">
                  <p className="text-sm font-semibold">Date range</p>
                </div>
                <div className="p-2">
                  {dateRanges.map((range) => (
                    <button
                      key={range}
                      className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm text-muted-foreground transition duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.99]"
                      onClick={() => {
                        setSelectedDateRange(range);
                        setDateOpen(false);
                      }}
                    >
                      <span>{range}</span>
                      {selectedDateRange === range ? <Check className="h-4 w-4 text-primary" /> : null}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-end gap-2">
          <div className="hidden xl:block">
            <SyncIndicator data={data} />
          </div>
          <p className="hidden text-xs text-muted-foreground lg:block">
            Last updated {data ? formatRelativeMinutes(data.sync.lastUpdated) : "..."}
          </p>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => void refetch()}
            title="Refresh dashboard"
            aria-label="Refresh dashboard"
          >
            <RefreshCcw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            onClick={toggleTheme}
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="relative">
            <Button
              variant="secondary"
              size="icon"
              title="Notifications"
              aria-label="Open notifications"
              onClick={() => {
                setNotificationsOpen((value) => !value);
                setStoreOpen(false);
                setDateOpen(false);
                setProfileOpen(false);
              }}
            >
              <Bell className="h-4 w-4" />
              {alertCount > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {alertCount}
                </span>
              ) : null}
            </Button>
            {notificationsOpen ? (
              <div className="absolute right-0 top-11 z-50 w-80 animate-popover-in overflow-hidden rounded-xl border bg-card shadow-soft">
                <div className="border-b p-4">
                  <p className="font-semibold">Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    {alertCount ? `${alertCount} active operational alerts` : "No active alerts"}
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto p-2" data-native-scroll>
                  {data?.alerts.length ? (
                    data.alerts.map((alert) => (
                      <div key={alert.id} className="rounded-lg p-3 hover:bg-muted">
                        <div className="flex items-start justify-between gap-3">
                          <p className="text-sm font-medium">{alert.title}</p>
                          <StatusBadge status={alert.severity === "critical" ? "critical" : alert.severity === "warning" ? "delayed" : "healthy"} />
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-3 text-sm text-muted-foreground">
                      Platform operations are currently within expected thresholds.
                    </p>
                  )}
                </div>
                <div className="border-t p-2">
                  <Link
                    href="/alerts"
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    View all alerts
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
          <div className="relative">
            <button
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white ring-offset-background transition duration-150 ease-out hover:bg-slate-800 active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
              aria-label="Open user menu"
              onClick={() => {
                setProfileOpen((value) => !value);
                setStoreOpen(false);
                setDateOpen(false);
                setNotificationsOpen(false);
              }}
            >
              CP
            </button>
            {profileOpen ? (
              <div className="absolute right-0 top-11 z-50 w-64 animate-popover-in overflow-hidden rounded-xl border bg-card shadow-soft">
                <div className="border-b p-4">
                  <p className="font-semibold">Commerce Pulse</p>
                  <p className="text-sm text-muted-foreground">Northstar Supply Co.</p>
                </div>
                <div className="p-2">
                  {["Account settings", "Store connections", "Sync preferences"].map((item) => (
                    <Link
                      key={item}
                      href="/settings"
                      className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition duration-150 ease-out hover:bg-muted hover:text-foreground active:scale-[0.99]"
                      onClick={() => setProfileOpen(false)}
                    >
                      {item}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
