"use client";

import { RefreshCcw } from "lucide-react";
import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { Button } from "@/components/ui/button";
import { ErrorBanner } from "@/components/shared/error-banner";
import { PlatformStatusPill } from "@/components/shared/platform-status-pill";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { SalesAnalytics } from "@/components/charts/sales-analytics";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { AlertsPanel } from "@/components/alerts/alerts-panel";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function DashboardOverview() {
  const { data, isLoading, isError, refetch, isFetching } = useDashboardQuery();

  return (
    <div className="space-y-6">
      <section className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Unified Analytics Command Center for Shopify & TikTok Shop
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-normal text-foreground sm:text-4xl">
            Commerce Pulse
          </h1>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {data ? (
            <>
              <PlatformStatusPill platform="shopify" health={data.platforms.shopify} />
              <PlatformStatusPill platform="tiktok" health={data.platforms.tiktok} />
            </>
          ) : (
            <>
              <LoadingSkeleton className="h-14 w-full sm:w-64" />
              <LoadingSkeleton className="h-14 w-full sm:w-64" />
            </>
          )}
        </div>
      </section>

      {data?.warnings.map((warning) => (
        <ErrorBanner
          key={warning}
          title="Partial data notice"
          description={warning}
          actionLabel="Retry TikTok"
          onRetry={() => void refetch()}
        />
      ))}

      {isError ? (
        <ErrorBanner
          title="Dashboard request failed"
          description="The dashboard shell is available, but the API request did not complete. Retry to reload operational data."
          onRetry={() => void refetch()}
        />
      ) : null}

      <div className="flex justify-end md:hidden">
        <Button variant="secondary" size="sm" onClick={() => void refetch()}>
          <RefreshCcw className={isFetching ? "h-4 w-4 animate-spin" : "h-4 w-4"} />
          Refresh
        </Button>
      </div>

      <KpiGrid metrics={data?.metrics} isLoading={isLoading} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(340px,0.7fr)]">
        <SalesAnalytics data={data} isLoading={isLoading} onRetry={() => void refetch()} />
        <AlertsPanel alerts={data?.alerts} isLoading={isLoading} />
      </div>

      <InventoryTable items={data?.inventory} isLoading={isLoading} />
    </div>
  );
}
