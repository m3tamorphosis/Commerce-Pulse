import type { MetricCardData } from "@/types/dashboard";
import { MetricCard } from "@/components/dashboard/metric-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function KpiGrid({
  metrics,
  isLoading
}: {
  metrics?: MetricCardData[];
  isLoading: boolean;
}) {
  if (isLoading || !metrics) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-48" />
        ))}
      </div>
    );
  }

  return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric, index) => (
        <div
          key={metric.id}
          className="motion-safe:animate-section-in"
          style={{ animationDelay: `${index * 45}ms` }}
        >
          <MetricCard metric={metric} />
        </div>
      ))}
    </div>
  );
}
