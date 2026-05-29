import { Activity, ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { MetricCardData } from "@/types/dashboard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StatusBadge } from "@/components/shared/status-badge";
import { cn } from "@/lib/utils";

export function MetricCard({ metric }: { metric: MetricCardData }) {
  const positive = metric.trend >= 0;
  const max = Math.max(...metric.series);

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
        <p className="text-sm text-muted-foreground">{metric.helper}</p>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex h-10 items-end gap-1" aria-hidden>
          {metric.series.map((point, index) => (
            <div
              key={`${metric.id}-${index}`}
              className={cn(
                "w-full rounded-t bg-slate-200 dark:bg-slate-700",
                metric.status === "delayed" && index > metric.series.length - 3
                  ? "bg-red-300/80 dark:bg-red-400/80"
                  : "bg-blue-500/70 dark:bg-blue-400/80"
              )}
              style={{ height: `${Math.max(22, (point / max) * 100)}%` }}
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">Shopify</p>
            <p className="mt-1 font-semibold">{metric.contributions.shopify.label}</p>
          </div>
          <div className="rounded-lg bg-muted/60 p-3">
            <p className="text-xs text-muted-foreground">TikTok Shop</p>
            <p className="mt-1 font-semibold">{metric.contributions.tiktok.label}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-sm">
          {positive ? (
            <ArrowUpRight className="h-4 w-4 text-emerald-600" />
          ) : (
            <ArrowDownRight className="h-4 w-4 text-amber-600" />
          )}
          <span className={positive ? "font-medium text-emerald-700" : "font-medium text-amber-700"}>
            {Math.abs(metric.trend)}%
          </span>
          <span className="text-muted-foreground">vs previous period</span>
          <Activity className="ml-auto h-4 w-4 text-muted-foreground" />
        </div>
      </CardContent>
    </Card>
  );
}
