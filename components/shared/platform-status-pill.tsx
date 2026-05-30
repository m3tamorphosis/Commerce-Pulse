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
    <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          health.status === "healthy" && "text-emerald-600",
          health.status === "delayed" && "text-red-600 dark:text-red-300",
          health.status === "stale" && "text-red-600 dark:text-red-300",
          health.status === "failed" && "text-rose-600"
        )}
      />
      <div className="min-w-0">
        <p className="truncate font-medium capitalize">{platform === "shopify" ? "Shopify" : "TikTok Shop"}</p>
        <p className="truncate text-xs font-medium text-muted-foreground">
          {statusLabel(health.status)} · {syncLabel} {formatRelativeMinutes(syncTime)}
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
