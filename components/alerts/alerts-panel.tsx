import type { OperationalAlert } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCard } from "@/components/alerts/alert-card";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";

export function AlertsPanel({
  alerts,
  isLoading
}: {
  alerts?: OperationalAlert[];
  isLoading: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Operational Alerts</CardTitle>
        <p className="text-sm text-muted-foreground">
          Calm, actionable issues that need merchant attention.
        </p>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <LoadingSkeleton className="h-28" />
            <LoadingSkeleton className="h-28" />
            <LoadingSkeleton className="h-28" />
          </div>
        ) : null}
        {!isLoading && !alerts?.length ? (
          <EmptyState title="No active alerts" description="Platform operations are currently within expected thresholds." />
        ) : null}
        {!isLoading && alerts?.length ? (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
