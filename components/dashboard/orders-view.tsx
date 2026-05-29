"use client";

import { useMemo } from "react";
import { ShoppingCart } from "lucide-react";
import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/page-heading";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { formatNumber } from "@/lib/utils";

export function OrdersView() {
  const { data, isLoading } = useDashboardQuery();
  const rows = useMemo(() => data?.chartData ?? [], [data]);

  const totals = rows.reduce(
    (acc, point) => ({
      shopify: acc.shopify + point.shopifyOrders,
      tiktok: acc.tiktok + (point.tiktokOrders ?? 0)
    }),
    { shopify: 0, tiktok: 0 }
  );

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Order activity"
        title="Orders"
        description="Track order volume by platform while preserving visibility when TikTok order data is delayed or cached."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatNumber(totals.shopify + totals.tiktok)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Shopify Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatNumber(totals.shopify)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Real-time channel</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>TikTok Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{formatNumber(totals.tiktok)}</p>
            <p className="mt-1 text-sm text-muted-foreground">Cached when delayed</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Daily Order Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">Shopify remains live even when TikTok data is stale.</p>
        </CardHeader>
        <CardContent>
          {isLoading ? <LoadingSkeleton className="h-72" /> : null}
          {!isLoading && !rows.length ? (
            <EmptyState title="No orders available" description="Order activity will appear once platform data is available." />
          ) : null}
          {!isLoading && rows.length ? (
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-[640px] w-full border-collapse text-left text-sm">
                <thead className="bg-muted/70 text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Day</th>
                    <th className="px-4 py-3 font-semibold">Shopify</th>
                    <th className="px-4 py-3 font-semibold">TikTok Shop</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y bg-card">
                  {rows.map((row) => (
                    <tr key={row.date}>
                      <td className="px-4 py-4 font-medium">{row.date}</td>
                      <td className="px-4 py-4">{formatNumber(row.shopifyOrders)}</td>
                      <td className="px-4 py-4">
                        {row.tiktokOrders === null ? "Cached unavailable" : formatNumber(row.tiktokOrders)}
                      </td>
                      <td className="px-4 py-4">
                        <span className="inline-flex items-center gap-2 text-muted-foreground">
                          <ShoppingCart className="h-4 w-4" />
                          {row.tiktokEstimated ? "TikTok delayed" : "Synced"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
