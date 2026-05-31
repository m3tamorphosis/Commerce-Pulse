import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { MetricCardData } from "@/types/dashboard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export function MetricCard({ metric }: { metric: MetricCardData }) {
  const positive = metric.trend >= 0;
  const max = Math.max(...metric.series);
  const tiktokHealthy = metric.contributions.tiktok.status === "healthy";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-normal">{metric.value}</p>
          </div>
          <StatusBadge status={metric.status} />
        </div>
        <p className="text-sm leading-5 text-muted-foreground">{metric.helper}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex h-10 items-end gap-1" aria-hidden>
          {metric.series.map((point, index) => (
            <div
              key={`${metric.id}-${index}`}
              className={cn(
                "group relative w-full origin-bottom rounded-t bg-slate-200 transition duration-200 hover:opacity-95 motion-safe:animate-bar-in dark:bg-slate-700",
                metric.status !== "healthy" && index > metric.series.length - 3
                  ? "bg-rose-400/85 dark:bg-rose-400/80"
                  : tiktokHealthy && index > metric.series.length - 3
                    ? "bg-blue-500/85 dark:bg-blue-400/85"
                    : "bg-emerald-500/85 dark:bg-emerald-400/85"
              )}
              style={{
                height: `${Math.max(22, (point / max) * 100)}%`,
                animationDelay: `${index * 35}ms`
              }}
            >
              <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border bg-card px-2 py-1 text-xs font-medium text-foreground shadow-elevated group-hover:block">
                {point}
                <span className="ml-1 text-muted-foreground">
                  {metric.status !== "healthy" && index > metric.series.length - 3
                    ? "delayed"
                    : tiktokHealthy && index > metric.series.length - 3
                      ? "TikTok"
                      : "Shopify"}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border border-border/60 bg-muted/45 p-3 transition duration-150 hover:border-emerald-300/70 hover:bg-muted/65 dark:border-white/10 dark:hover:border-emerald-400/25">
            <p className="text-xs font-medium text-muted-foreground">Shopify</p>
            <p className="mt-1 font-semibold">{metric.contributions.shopify.label}</p>
          </div>
          <div
            className={cn(
              "rounded-lg border bg-muted/45 p-3 transition duration-150 hover:bg-muted/65",
              tiktokHealthy
                ? "border-blue-200/80 hover:border-blue-300 dark:border-blue-400/20 dark:hover:border-blue-400/35"
                : "border-border/60 hover:border-border dark:border-white/10"
            )}
          >
            <p className={cn("text-xs font-medium", tiktokHealthy ? "text-blue-700 dark:text-blue-200" : "text-muted-foreground")}>TikTok Shop</p>
            <p className="mt-1 font-semibold">{metric.contributions.tiktok.label}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          {positive ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-300" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-rose-600 dark:text-rose-200" />
          )}
          <span className={positive ? "font-medium text-emerald-700 dark:text-emerald-200" : "font-medium text-rose-700 dark:text-rose-200"}>
            {Math.abs(metric.trend)}%
          </span>
          <span className="text-muted-foreground">vs previous period</span>
          <Activity className="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
