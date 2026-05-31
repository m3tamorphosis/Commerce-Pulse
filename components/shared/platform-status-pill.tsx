import { CircleCheck, Clock3, RefreshCcw, TriangleAlert } from "lucide-react";
import { cn, formatRelativeMinutes, statusLabel } from "@/lib/utils";
import type { Platform, PlatformHealth } from "@/types/dashboard";

interface PlatformStatusPillProps {
  platform: Platform;
  health: PlatformHealth;
  isRetrying?: boolean;
  onRetry?: () => void;
}

export function PlatformStatusPill({ platform, health, isRetrying, onRetry }: PlatformStatusPillProps) {
  const Icon =
    health.status === "healthy" ? CircleCheck : health.status === "failed" ? TriangleAlert : Clock3;
  const canRetry = health.retry.retryable && onRetry;
  const syncLabel = health.status === "healthy" ? "synced" : "checked";
  const syncTime = health.status === "healthy" ? health.lastSuccessfulSync : health.lastAttemptedSync;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2 rounded-lg border bg-card/95 px-3 py-2 text-sm shadow-sm ring-1 ring-white/70 dark:bg-card/90 dark:ring-white/5",
        health.status === "healthy" &&
          (platform === "tiktok"
            ? "border-blue-200/90 dark:border-blue-400/30"
            : "border-emerald-200/90 dark:border-emerald-400/25"),
        health.status !== "healthy" &&
          "border-rose-300/75 bg-rose-50/70 dark:border-rose-300/40 dark:bg-rose-950/55"
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          health.status === "healthy" &&
            (platform === "tiktok" ? "text-blue-600 dark:text-blue-300" : "text-emerald-600 dark:text-emerald-300"),
          health.status === "delayed" && "text-rose-600 dark:text-rose-200",
          health.status === "stale" && "text-rose-600 dark:text-rose-200",
          health.status === "failed" && "text-red-600 dark:text-red-200"
        )}
      />
      <div className="min-w-0">
        <p className="truncate font-medium capitalize">{platform === "shopify" ? "Shopify" : "TikTok Shop"}</p>
        <p className="truncate text-xs font-medium text-muted-foreground">
          {statusLabel(health.status)} <span aria-hidden="true">&middot;</span> {syncLabel}{" "}
          {formatRelativeMinutes(syncTime)}
        </p>
      </div>
      {canRetry ? (
        <button
          type="button"
          className="ml-auto rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={`Retry ${platform === "shopify" ? "Shopify" : "TikTok Shop"} sync`}
          title={`Retry ${platform === "shopify" ? "Shopify" : "TikTok Shop"} sync`}
          onClick={(event) => {
            event.stopPropagation();
            onRetry();
          }}
          disabled={isRetrying}
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", isRetrying && "animate-spin")} />
        </button>
      ) : health.retry.retryable ? (
        <RefreshCcw className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      ) : null}
    </div>
  );
}
