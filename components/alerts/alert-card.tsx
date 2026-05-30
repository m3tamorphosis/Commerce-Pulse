import { AlertCircle, CircleAlert, Info, RefreshCcw } from "lucide-react";
import type { OperationalAlert } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeMinutes } from "@/lib/utils";

export function AlertCard({
  alert,
  isActionLoading,
  onAction
}: {
  alert: OperationalAlert;
  isActionLoading?: boolean;
  onAction?: (alert: OperationalAlert) => void;
}) {
  const Icon = alert.severity === "critical" ? CircleAlert : alert.severity === "warning" ? AlertCircle : Info;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4",
        alert.severity === "warning" &&
          "border-l-4 border-red-200 border-l-red-400 bg-red-100/80 dark:border-red-300/40 dark:border-l-red-400 dark:bg-red-950/45",
        alert.severity === "critical" &&
          "border-l-4 border-rose-200 border-l-rose-500 bg-rose-100/80 dark:border-rose-300/40 dark:border-l-rose-400 dark:bg-rose-950/45"
      )}
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            alert.severity === "info" && "text-blue-600 dark:text-blue-300",
            alert.severity === "warning" && "text-red-600 dark:text-red-300",
            alert.severity === "critical" && "text-rose-600 dark:text-rose-300"
          )}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium">{alert.title}</p>
            <span className="whitespace-nowrap text-xs text-muted-foreground">
              {formatRelativeMinutes(alert.createdAt)}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
          {alert.actionLabel ? (
            <Button
              className="mt-3"
              variant="secondary"
              size="sm"
              onClick={() => onAction?.(alert)}
              disabled={isActionLoading}
            >
              {alert.actionLabel.includes("Retry") ? (
                <RefreshCcw className={cn("h-3.5 w-3.5", isActionLoading && "animate-spin")} />
              ) : null}
              {alert.actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
