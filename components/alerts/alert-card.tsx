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
        "rounded-xl border border-border/80 bg-card/95 p-4 shadow-sm transition duration-150 hover:border-primary/25 dark:border-white/10 dark:bg-card/90",
        alert.severity === "warning" &&
          "border-l-4 border-rose-300/80 border-l-rose-500 bg-rose-50/85 dark:border-rose-300/40 dark:border-l-rose-400 dark:bg-rose-950/55",
        alert.severity === "critical" &&
          "border-l-4 border-red-300 border-l-red-500 bg-red-50 dark:border-red-300/40 dark:border-l-red-400 dark:bg-red-500/16"
      )}
    >
      <div className="flex gap-3">
        <Icon
          className={cn(
            "mt-0.5 h-5 w-5 shrink-0",
            alert.severity === "info" && "text-blue-600 dark:text-blue-300",
            alert.severity === "warning" && "text-rose-600 dark:text-rose-200",
            alert.severity === "critical" && "text-red-600 dark:text-red-200"
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
