import { cn, getStatusTone, statusLabel } from "@/lib/utils";
import type { PlatformStatus, RiskLevel, SyncStatus } from "@/types/dashboard";

interface StatusBadgeProps {
  status: PlatformStatus | SyncStatus | RiskLevel;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const tone = getStatusTone(status);
  const label = statusLabel(status);

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold shadow-sm",
        tone === "success" &&
          "border-emerald-200/90 bg-emerald-50 text-emerald-800 shadow-emerald-900/5 dark:border-emerald-400/30 dark:bg-emerald-400/15 dark:text-emerald-100",
        tone === "warning" &&
          "border-rose-300/80 bg-rose-50 text-rose-800 shadow-rose-900/5 dark:border-rose-300/40 dark:bg-rose-950/55 dark:text-rose-100",
        tone === "danger" &&
          "border-red-300 bg-red-50 text-red-800 shadow-red-900/5 dark:border-red-300/40 dark:bg-red-500/20 dark:text-red-50",
        className
      )}
    >
      {label}
    </span>
  );
}
