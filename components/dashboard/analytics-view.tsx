"use client";

import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { PageHeading } from "@/components/shared/page-heading";
import { PlatformStatusPill } from "@/components/shared/platform-status-pill";
import { SalesAnalytics } from "@/components/charts/sales-analytics";
import { KpiGrid } from "@/components/dashboard/kpi-grid";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function AnalyticsView() {
  const { data, isLoading, isFetching, refetch } = useDashboardQuery();

  return (
    <div className="space-y-6">
      <div className="motion-safe:animate-section-in">
        <PageHeading
        eyebrow="Cross-channel performance"
        title="Analytics"
        description="Compare Shopify and TikTok Shop revenue, orders, conversion behavior, and sync confidence from one view."
        action={
          <div className="grid gap-2 sm:grid-cols-2">
            {data ? (
              <>
                <PlatformStatusPill platform="shopify" health={data.platforms.shopify} />
                <PlatformStatusPill
                  platform="tiktok"
                  health={data.platforms.tiktok}
                  isRetrying={isFetching}
                  onRetry={() => void refetch()}
                />
              </>
            ) : (
              <>
                <LoadingSkeleton className="h-14 w-full sm:w-64" />
                <LoadingSkeleton className="h-14 w-full sm:w-64" />
              </>
            )}
          </div>
        }
        />
      </div>
      <div className="motion-safe:animate-section-in" style={{ animationDelay: "70ms" }}>
        <KpiGrid metrics={data?.metrics} isLoading={isLoading} />
      </div>
      <div className="motion-safe:animate-section-in" style={{ animationDelay: "120ms" }}>
        <SalesAnalytics data={data} isLoading={isLoading} onRetry={() => void refetch()} />
      </div>
    </div>
  );
}
