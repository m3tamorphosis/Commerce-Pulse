import { AlertCircle, CircleAlert, Info, RefreshCcw } from "lucide-react";
import type { OperationalAlert } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { cn, formatRelativeMinutes } from "@/lib/utils";

export function AlertCard({ alert }: { alert: OperationalAlert }) {
  const Icon = alert.severity === "critical" ? CircleAlert : alert.severity === "warning" ? AlertCircle : Info;

  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-4",
        alert.severity === "warning" &&
          "border-red-200 bg-red-50/70 dark:border-red-300/40 dark:bg-red-950/45",
        alert.severity === "critical" &&
          "border-rose-200 bg-rose-50/45 dark:border-rose-300/40 dark:bg-rose-950/45"
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
            <Button className="mt-3" variant="secondary" size="sm">
              {alert.actionLabel.includes("Retry") ? <RefreshCcw className="h-3.5 w-3.5" /> : null}
              {alert.actionLabel}
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
