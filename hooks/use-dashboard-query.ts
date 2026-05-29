"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchDashboard } from "@/services/dashboard-service";
import type { PlatformStatus } from "@/types/dashboard";

export function useDashboardQuery(scenario?: PlatformStatus) {
  return useQuery({
    queryKey: ["dashboard", scenario ?? "default"],
    queryFn: () => fetchDashboard(scenario),
    refetchInterval: 60000,
    retry: 1,
    staleTime: 30000
  });
}
