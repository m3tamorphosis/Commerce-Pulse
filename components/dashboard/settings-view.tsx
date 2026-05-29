"use client";

import { RefreshCcw, ShieldCheck, Store } from "lucide-react";
import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/page-heading";
import { PlatformStatusPill } from "@/components/shared/platform-status-pill";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export function SettingsView() {
  const { data, isLoading } = useDashboardQuery();

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Workspace configuration"
        title="Settings"
        description="Review store connections, sync behavior, and operational defaults for the Commerce Pulse workspace."
      />
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.7fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Connected Platforms</CardTitle>
            <p className="text-sm text-muted-foreground">Connection health is isolated by platform.</p>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {data ? (
              <>
                <PlatformStatusPill platform="shopify" health={data.platforms.shopify} />
                <PlatformStatusPill platform="tiktok" health={data.platforms.tiktok} />
              </>
            ) : (
              <>
                <LoadingSkeleton className="h-14" />
                <LoadingSkeleton className="h-14" />
              </>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sync Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { icon: Store, label: "Shopify inventory", value: "Real-time" },
              { icon: RefreshCcw, label: "TikTok retry window", value: "Every 10 minutes" },
              { icon: ShieldCheck, label: "Fallback mode", value: "Use stale cache safely" }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-right text-sm text-muted-foreground">{item.value}</span>
              </div>
            ))}
            {isLoading ? <LoadingSkeleton className="h-10" /> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
