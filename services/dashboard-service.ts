import type { DashboardResponse, PlatformStatus } from "@/types/dashboard";

export async function fetchDashboard(scenario?: PlatformStatus): Promise<DashboardResponse> {
  const params = scenario ? `?scenario=${scenario}` : "";
  const response = await fetch(`/api/dashboard${params}`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Dashboard API request failed");
  }

  return response.json() as Promise<DashboardResponse>;
}
