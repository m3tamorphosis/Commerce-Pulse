"use client";

import { useRouter } from "next/navigation";
import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { PageHeading } from "@/components/shared/page-heading";
import { AlertsPanel } from "@/components/alerts/alerts-panel";
import { ErrorBanner } from "@/components/shared/error-banner";

import type { OperationalAlert } from "@/types/dashboard";

export function AlertsView() {
  const { data, isLoading, isFetching, refetch } = useDashboardQuery();
  const router = useRouter();

  const handleAlertAction = (alert: OperationalAlert) => {
    if (alert.actionLabel?.includes("Retry")) {
      void refetch();
      return;
    }

    if (alert.id === "low-stock") {
      router.push("/inventory?risk=low");
      return;
    }

    if (alert.id === "stock-mismatch") {
      router.push("/inventory?filter=out_of_sync");
    }
  };

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
        <AlertsPanel
          alerts={data?.alerts}
          isLoading={isLoading}
          isActionLoading={isFetching}
          onAlertAction={handleAlertAction}
        />
      </div>
    </div>
  );
}
