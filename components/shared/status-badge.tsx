import { cn, getStatusTone, statusLabel } from "@/lib/utils";
import type { PlatformStatus, RiskLevel, SyncStatus } from "@/types/dashboard";

interface StatusBadgeProps {
  status: PlatformStatus | SyncStatus | RiskLevel;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = getStatusTone(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        tone === "success" &&
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-200",
        tone === "warning" &&
          "border-red-200 bg-red-50 text-red-700 dark:border-red-300/40 dark:bg-red-950/45 dark:text-red-100",
        tone === "danger" &&
          "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-300/35 dark:bg-rose-400/15 dark:text-rose-100",
        className
      )}
    >
      {statusLabel(status)}
    </span>
  );
}
