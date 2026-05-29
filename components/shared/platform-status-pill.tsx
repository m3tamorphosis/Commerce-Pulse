import { CircleCheck, Clock3, RefreshCcw, TriangleAlert } from "lucide-react";
import { cn, formatRelativeMinutes, statusLabel } from "@/lib/utils";
import type { Platform, PlatformHealth } from "@/types/dashboard";

interface PlatformStatusPillProps {
  platform: Platform;
  health: PlatformHealth;
}

export function PlatformStatusPill({ platform, health }: PlatformStatusPillProps) {
  const Icon =
    health.status === "healthy" ? CircleCheck : health.status === "failed" ? TriangleAlert : Clock3;

  return (
    <div className="flex min-w-0 items-center gap-2 rounded-lg border bg-card px-3 py-2 text-sm">
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          health.status === "healthy" && "text-emerald-600",
          health.status === "delayed" && "text-amber-600",
          health.status === "stale" && "text-amber-600",
          health.status === "failed" && "text-rose-600"
        )}
      />
      <div className="min-w-0">
        <p className="truncate font-medium capitalize">{platform === "shopify" ? "Shopify" : "TikTok Shop"}</p>
        <p className="truncate text-xs text-muted-foreground">
          {statusLabel(health.status)} · synced {formatRelativeMinutes(health.lastSuccessfulSync)}
        </p>
      </div>
      {health.retry.retryable ? <RefreshCcw className="h-3.5 w-3.5 text-muted-foreground" /> : null}
    </div>
  );
}
