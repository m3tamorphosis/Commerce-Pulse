"use client";

import { useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { Clock3 } from "lucide-react";
import type { DashboardResponse } from "@/types/dashboard";
import { Button } from "@/components/ui/button";
import { ChartContainer } from "@/components/charts/chart-container";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { formatCurrency, formatNumber, formatRelativeMinutes } from "@/lib/utils";

type MetricMode = "revenue" | "orders";
type ChartMode = "line" | "area";

export function SalesAnalytics({
  data,
  isLoading,
  onRetry
}: {
  data?: DashboardResponse;
  isLoading: boolean;
  onRetry: () => void;
}) {
  const [metric, setMetric] = useState<MetricMode>("revenue");
  const [chartMode, setChartMode] = useState<ChartMode>("area");

  const chartData = useMemo(() => {
    return data?.chartData.map((point) => ({
      date: point.date,
      Shopify: metric === "revenue" ? point.shopifyRevenue : point.shopifyOrders,
      "TikTok Shop": metric === "revenue" ? point.tiktokRevenue : point.tiktokOrders,
      tiktokEstimated: point.tiktokEstimated
    }));
  }, [data, metric]);

  const tiktokStatus = data?.platforms.tiktok.status;
  const tiktokDegraded = tiktokStatus && tiktokStatus !== "healthy";
  const formatter = metric === "revenue" ? formatCurrency : formatNumber;

  return (
    <ChartContainer
      title="Sales Analytics"
      description="Revenue and order activity by platform with cached TikTok fallback support."
      action={
        <div className="flex flex-wrap gap-2">
          <div className="flex rounded-lg border bg-muted p-1">
            {(["revenue", "orders"] as MetricMode[]).map((option) => (
              <button
                key={option}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition duration-150 ease-out active:scale-[0.98] ${
                  metric === option ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                onClick={() => setMetric(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <div className="flex rounded-lg border bg-muted p-1">
            {(["area", "line"] as ChartMode[]).map((option) => (
              <button
                key={option}
                className={`rounded-md px-3 py-1.5 text-sm font-medium capitalize transition duration-150 ease-out active:scale-[0.98] ${
                  chartMode === option ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
                }`}
                onClick={() => setChartMode(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      }
    >
      {isLoading ? <LoadingSkeleton className="h-[360px]" /> : null}
      {!isLoading && !chartData?.length ? (
        <EmptyState title="No chart data" description="Sales analytics will appear once platform data is available." />
      ) : null}
      {!isLoading && chartData?.length ? (
        <div className="space-y-4">
          {tiktokDegraded ? (
            <div className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-950 dark:border-red-300/40 dark:bg-red-950/55 dark:text-red-50 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-red-600 dark:text-red-300" />
                <span>
                  TikTok data delayed. Last synced{" "}
                  {formatRelativeMinutes(data.platforms.tiktok.lastSuccessfulSync)}.
                </span>
              </div>
              {data.platforms.tiktok.retry.retryable ? (
                <Button variant="warning" size="sm" onClick={onRetry}>
                  Retry TikTok
                </Button>
              ) : null}
            </div>
          ) : null}
          <div className="h-[360px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              {chartMode === "area" ? (
                <AreaChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="shopifyFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.22} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="tiktokFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="currentColor" className="text-border" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => formatter(Number(value))} width={70} />
                  <Tooltip formatter={(value) => formatter(Number(value))} />
                  <Legend />
                  <Area type="monotone" dataKey="Shopify" stroke="#2563eb" fill="url(#shopifyFill)" strokeWidth={2} />
                  <Area
                    type="monotone"
                    dataKey="TikTok Shop"
                    stroke="#14b8a6"
                    fill="url(#tiktokFill)"
                    strokeWidth={2}
                    strokeDasharray={tiktokDegraded ? "5 5" : undefined}
                    connectNulls
                  />
                </AreaChart>
              ) : (
                <LineChart data={chartData} margin={{ top: 12, right: 18, left: 0, bottom: 0 }}>
                  <CartesianGrid stroke="currentColor" className="text-border" strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => formatter(Number(value))} width={70} />
                  <Tooltip formatter={(value) => formatter(Number(value))} />
                  <Legend />
                  <Line type="monotone" dataKey="Shopify" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line
                    type="monotone"
                    dataKey="TikTok Shop"
                    stroke="#14b8a6"
                    strokeWidth={2}
                    strokeDasharray={tiktokDegraded ? "5 5" : undefined}
                    dot={false}
                    connectNulls
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}
    </ChartContainer>
  );
}
