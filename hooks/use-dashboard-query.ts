"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/services/dashboard-service";
import { useWorkspace } from "@/components/providers/workspace-provider";
import type { PlatformStatus } from "@/types/dashboard";

export function useDashboardQuery(scenario?: PlatformStatus) {
  const { selectedStore, selectedDateRange } = useWorkspace();

  return useQuery({
    queryKey: ["dashboard", selectedStore.id, selectedDateRange.id, scenario ?? "default"],
    queryFn: () =>
      fetchDashboard({
        scenario,
        storeId: selectedStore.id,
        dateRangeId: selectedDateRange.id
      }),
    refetchInterval: 15000,
    retry: 1,
    staleTime: 30000
  });
}
