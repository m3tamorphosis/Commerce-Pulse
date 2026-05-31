import { Wifi, WifiOff } from "lucide-react";
import { cn, formatRelativeMinutes, statusLabel } from "@/lib/utils";
import type { DashboardResponse } from "@/types/dashboard";

export function SyncIndicator({ data }: { data?: DashboardResponse }) {
  if (!data) {
    return <div className="h-9 w-52 animate-pulse rounded-lg bg-muted" />;
  }

  const stable = data.sync.globalStatus === "healthy";

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border bg-card/95 px-3 py-2 text-sm shadow-sm ring-1 ring-white/70 dark:bg-card/90 dark:ring-white/5",
        stable
          ? "border-emerald-200/90 text-emerald-950 dark:border-emerald-400/25 dark:text-emerald-50"
          : "border-rose-300/75 bg-rose-50/70 text-rose-950 dark:border-rose-300/40 dark:bg-rose-950/55 dark:text-rose-50"
      )}
    >
      {stable ? (
        <Wifi className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
      ) : (
        <WifiOff className="h-4 w-4 text-rose-600 dark:text-rose-200" />
      )}
      <span className={cn("font-medium", stable ? "text-emerald-700 dark:text-emerald-200" : "text-rose-800 dark:text-rose-100")}>
        {statusLabel(data.sync.globalStatus)}
      </span>
      <span className="hidden text-muted-foreground sm:inline">
        Updated {formatRelativeMinutes(data.sync.lastUpdated)}
      </span>
    </div>
  );
}
