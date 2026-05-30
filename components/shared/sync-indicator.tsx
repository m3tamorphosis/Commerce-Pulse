import { Wifi, WifiOff } from "lucide-react";
import { cn, formatRelativeMinutes, statusLabel } from "@/lib/utils";
import type { DashboardResponse } from "@/types/dashboard";

export function SyncIndicator({ data }: { data?: DashboardResponse }) {
  if (!data) {
    return <div className="h-9 w-52 animate-pulse rounded-lg bg-muted" />;
  }

  const stable = data.sync.globalStatus === "healthy";

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
      {stable ? (
        <Wifi className="h-4 w-4 text-emerald-600" />
      ) : (
        <WifiOff className="h-4 w-4 text-red-600 dark:text-red-300" />
      )}
      <span className={cn("font-medium", stable ? "text-emerald-700" : "text-red-800 dark:text-red-100")}>
        {statusLabel(data.sync.globalStatus)}
      </span>
      <span className="hidden text-muted-foreground sm:inline">
        Updated {formatRelativeMinutes(data.sync.lastUpdated)}
      </span>
    </div>
  );
}
