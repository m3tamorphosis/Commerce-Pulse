"use client";

import { useDashboardQuery } from "@/hooks/use-dashboard-query";
import { PageHeading } from "@/components/shared/page-heading";
import { InventoryTable } from "@/components/inventory/inventory-table";

export function InventoryView() {
  const { data, isLoading } = useDashboardQuery();

  return (
    <div className="space-y-6">
      <PageHeading
        eyebrow="Inventory operations"
        title="Inventory"
        description="Monitor stock levels, platform mismatches, delayed syncs, and low inventory risk without blocking Shopify operations."
      />
      <InventoryTable items={data?.inventory} isLoading={isLoading} />
    </div>
  );
}
