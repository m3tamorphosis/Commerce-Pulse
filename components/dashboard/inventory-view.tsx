"use client";

import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { PageHeading } from "@/components/shared/page-heading";
import { InventoryTable } from "@/components/inventory/inventory-table";

export function InventoryView() {
  const { data, isLoading } = useDashboardQuery();

  return (
    <div className="space-y-6">
      <div className="motion-safe:animate-section-in">
        <PageHeading
          eyebrow="Inventory operations"
          title="Inventory"
          description="Monitor stock levels, platform mismatches, delayed syncs, and low inventory risk without blocking Shopify operations."
        />
      </div>
      <div className="motion-safe:animate-section-in" style={{ animationDelay: "80ms" }}>
        <InventoryTable items={data?.inventory} isLoading={isLoading} />
      </div>
    </div>
  );
}
