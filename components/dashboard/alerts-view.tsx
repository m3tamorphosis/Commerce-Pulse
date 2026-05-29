"use client";

import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { PageHeading } from "@/components/shared/page-heading";
import { AlertsPanel } from "@/components/alerts/alerts-panel";
import { ErrorBanner } from "@/components/shared/error-banner";

export function AlertsView() {
  const { data, isLoading, refetch } = useDashboardQuery();

  return (
    <div className="space-y-6">
      <div className="motion-safe:animate-section-in">
        <PageHeading
          eyebrow="Operational confidence"
          title="Alerts"
          description="Review calm, actionable platform and inventory notices scoped to the affected service."
        />
      </div>
      {data?.warnings.map((warning) => (
        <ErrorBanner
          key={warning}
          title="Partial data notice"
          description={warning}
          actionLabel="Retry TikTok"
          onRetry={() => void refetch()}
        />
      ))}
      <div className="motion-safe:animate-section-in max-w-3xl" style={{ animationDelay: "90ms" }}>
        <AlertsPanel alerts={data?.alerts} isLoading={isLoading} />
      </div>
    </div>
  );
}
