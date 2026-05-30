import type { DashboardResponse, PlatformStatus } from "@/types/dashboard";

interface FetchDashboardOptions {
  scenario?: PlatformStatus;
  storeId: string;
  dateRangeId: string;
}

export async function fetchDashboard({
  scenario,
  storeId = "manila",
  dateRangeId
}: FetchDashboardOptions): Promise<DashboardResponse> {
  const params = new URLSearchParams({
    store: storeId,
    range: dateRangeId
  });

  if (scenario) {
    params.set("scenario", scenario);
  }

  const response = await fetch(`/api/dashboard?${params.toString()}`, {
    headers: {
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error("Dashboard API request failed");
  }

  return response.json() as Promise<DashboardResponse>;
}
