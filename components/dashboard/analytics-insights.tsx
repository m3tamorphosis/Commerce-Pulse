"use client";

import { Activity, Boxes, Clock3, PackageCheck, ShieldCheck, Trophy } from "lucide-react";
import type { DashboardResponse, InventoryItem, PlatformStatus } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { StatusBadge } from "@/components/shared/status-badge";
import { formatCurrency, formatNumber, formatRelativeMinutes, statusLabel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AnalyticsInsightsProps {
  data?: DashboardResponse;
  isLoading: boolean;
}

function percent(value: number, total: number) {
  if (!total) {
    return 0;
  }

  return Math.round((value / total) * 100);
}

function getInventoryCounts(items: InventoryItem[] = []) {
  return {
    synced: items.filter((item) => item.syncStatus === "synced").length,
    delayed: items.filter((item) => item.syncStatus === "delayed").length,
    outOfSync: items.filter((item) => item.syncStatus === "out_of_sync").length,
    lowOrCritical: items.filter(
      (item) => item.riskLevel === "low" || item.riskLevel === "critical"
    ).length
  };
}

function getTopProducts(data: DashboardResponse) {
  const totalRevenue = data.chartData.reduce(
    (sum, point) => sum + point.shopifyRevenue + (point.tiktokRevenue ?? 0),
    0
  );
  const weights = [0.18, 0.14, 0.11, 0.09, 0.075];

  return data.inventory.slice(0, 5).map((item, index) => {
    const platform = index % 2 === 0 ? "Shopify" : "TikTok Shop";
    const orders = Math.max(18, Math.round((item.shopifyStock + (item.tiktokStock ?? 0)) * 0.42));
    const revenue = Math.round(totalRevenue * weights[index]);

    return {
      id: item.id,
      name: item.productName,
      platform,
      orders,
      revenue,
      trend: index === 3 ? -2.1 : 4.2 + index * 1.3
    };
  });
}

export function AnalyticsInsights({ data, isLoading }: AnalyticsInsightsProps) {
  if (isLoading || !data) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <LoadingSkeleton className="h-80" />
        <LoadingSkeleton className="h-80" />
        <LoadingSkeleton className="h-80" />
        <LoadingSkeleton className="h-80" />
      </div>
    );
  }

  const revenueMetric = data.metrics.find((metric) => metric.id === "revenue");
  const ordersMetric = data.metrics.find((metric) => metric.id === "orders");
  const conversionMetric = data.metrics.find((metric) => metric.id === "conversion");
  const inventoryMetric = data.metrics.find((metric) => metric.id === "inventory");

  const shopifyRevenue = revenueMetric?.contributions.shopify.value ?? 0;
  const tiktokRevenue = revenueMetric?.contributions.tiktok.value ?? 0;
  const totalRevenue = shopifyRevenue + tiktokRevenue;
  const shopifyOrders = ordersMetric?.contributions.shopify.value ?? 0;
  const tiktokOrders = ordersMetric?.contributions.tiktok.value ?? 0;
  const totalOrders = shopifyOrders + tiktokOrders;
  const inventoryCounts = getInventoryCounts(data.inventory);
  const topProducts = getTopProducts(data);
  const tiktokDegraded = data.platforms.tiktok.status !== "healthy";

  const platformRows = [
    {
      label: "Revenue share",
      shopify: percent(shopifyRevenue, totalRevenue),
      tiktok: percent(tiktokRevenue, totalRevenue)
    },
    {
      label: "Order share",
      shopify: percent(shopifyOrders, totalOrders),
      tiktok: percent(tiktokOrders, totalOrders)
    },
    {
      label: "Conversion",
      shopify: conversionMetric?.contributions.shopify.label ?? "0%",
      tiktok: conversionMetric?.contributions.tiktok.label ?? "0%"
    },
    {
      label: "Inventory health",
      shopify: inventoryMetric?.contributions.shopify.label ?? "0%",
      tiktok: inventoryMetric?.contributions.tiktok.label ?? "0%"
    }
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
              <CardTitle>Platform Performance Breakdown</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={data.platforms.shopify.status} />
              <StatusBadge status={data.platforms.tiktok.status} />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Shopify and TikTok Shop contribution across core operating metrics.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {platformRows.map((row) => (
            <div key={row.label} className="rounded-xl border bg-muted/35 p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-muted-foreground">Shopify / TikTok</p>
              </div>
              {typeof row.shopify === "number" ? (
                <div className="space-y-2">
                  <div className="flex h-2 overflow-hidden rounded-full bg-muted">
                    <div className="bg-emerald-500" style={{ width: `${row.shopify}%` }} />
                    <div
                      className={tiktokDegraded ? "bg-red-400" : "bg-emerald-300"}
                      style={{ width: `${row.tiktok}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{row.shopify}% Shopify</span>
                    <span className={tiktokDegraded ? "text-red-700 dark:text-red-200" : "text-emerald-700 dark:text-emerald-200"}>
                      {row.tiktok}% TikTok Shop
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-emerald-200/70 bg-card p-3 dark:border-emerald-400/20">
                    <p className="text-xs text-muted-foreground">Shopify</p>
                    <p className="mt-1 font-semibold">{row.shopify}</p>
                  </div>
                  <div
                    className={cn(
                      "rounded-lg border bg-card p-3",
                      tiktokDegraded
                        ? "border-red-200/80 dark:border-red-400/25"
                        : "border-emerald-200/70 dark:border-emerald-400/20"
                    )}
                  >
                    <p
                      className={cn(
                        "text-xs font-medium",
                        tiktokDegraded ? "text-red-700 dark:text-red-200" : "text-emerald-700 dark:text-emerald-200"
                      )}
                    >
                      TikTok Shop
                    </p>
                    <p className="mt-1 font-semibold">{row.tiktok}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            <CardTitle>Top Products by Revenue</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Estimated product leaders based on current mock sales mix.
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topProducts.map((product, index) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-4 rounded-xl border bg-muted/35 p-3 transition hover:bg-muted/60"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-card text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{product.name}</p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span
                        className={cn(
                          "h-2 w-2 rounded-full",
                          product.platform === "Shopify"
                            ? "bg-emerald-500"
                            : tiktokDegraded
                              ? "bg-red-400"
                              : "bg-emerald-400"
                        )}
                      />
                      <span
                        className={cn(
                          product.platform === "TikTok Shop" &&
                            (tiktokDegraded
                              ? "text-red-700 dark:text-red-200"
                              : "text-emerald-700 dark:text-emerald-200")
                        )}
                      >
                        {product.platform}
                      </span>
                      <span>· {formatNumber(product.orders)} orders</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatCurrency(product.revenue)}</p>
                  <p
                    className={cn(
                      "text-sm font-medium",
                      product.trend >= 0 ? "text-emerald-600" : "text-red-600 dark:text-red-300"
                    )}
                  >
                    {product.trend >= 0 ? "+" : ""}
                    {product.trend.toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Boxes className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            <CardTitle>Inventory Risk Summary</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Quick count of stock and sync conditions across listed products.
          </p>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "Synced products", value: inventoryCounts.synced, icon: PackageCheck, tone: "green" },
            { label: "Delayed products", value: inventoryCounts.delayed, icon: Clock3, tone: "red" },
            { label: "Out of sync", value: inventoryCounts.outOfSync, icon: Activity, tone: "red" },
            { label: "Low/Critical stock", value: inventoryCounts.lowOrCritical, icon: Boxes, tone: "red" }
          ].map((item) => (
            <div key={item.label} className="rounded-xl border bg-muted/35 p-4">
              <div className="flex items-center justify-between gap-3">
                <item.icon
                  className={cn(
                    "h-5 w-5",
                    item.tone === "green" ? "text-emerald-600" : "text-red-600 dark:text-red-300"
                  )}
                />
                <span className="text-2xl font-semibold">{item.value}</span>
              </div>
              <p className="mt-3 text-sm font-medium">{item.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">Across {data.inventory.length} products</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-300" />
            <CardTitle>Sync Reliability Panel</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">
            Integration health and retry metadata behind the dashboard.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {([
            {
              label: "Shopify status",
              value: statusLabel(data.platforms.shopify.status),
              status: data.platforms.shopify.status,
              meta: `${data.sync.shopifyLatencyMs}ms latency`
            },
            {
              label: "TikTok Shop status",
              value: statusLabel(data.platforms.tiktok.status),
              status: data.platforms.tiktok.status,
              meta: data.sync.tiktokLatencyMs ? `${data.sync.tiktokLatencyMs}ms latency` : "Latency unavailable"
            },
            {
              label: "TikTok last successful sync",
              value: formatRelativeMinutes(data.platforms.tiktok.lastSuccessfulSync),
              status: data.platforms.tiktok.status,
              meta: data.platforms.tiktok.staleCacheAvailable ? "Fallback cache available" : "Fresh data available"
            },
            {
              label: "Retry attempts",
              value: `${data.platforms.tiktok.retry.attemptCount}`,
              status: data.platforms.tiktok.retry.retryable ? "delayed" : "healthy",
              meta: data.platforms.tiktok.retry.retryable ? "Retry available" : "No retry needed"
            }
          ] satisfies Array<{
            label: string;
            value: string;
            status: PlatformStatus;
            meta: string;
          }>).map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4 rounded-xl border bg-muted/35 p-4">
              <div>
                <p className="text-sm font-medium">{row.label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{row.meta}</p>
              </div>
              <div className="text-right">
                <p className="mb-1 font-semibold">{row.value}</p>
                <StatusBadge status={row.status} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
