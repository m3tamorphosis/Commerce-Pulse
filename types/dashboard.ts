export type Platform = "shopify" | "tiktok";

export type PlatformStatus = "healthy" | "delayed" | "failed" | "stale";

export type RiskLevel = "normal" | "low" | "critical";

export type SyncStatus = "synced" | "delayed" | "out_of_sync" | "low_stock" | "critical_stock";

export type AlertSeverity = "info" | "warning" | "critical";

export interface RetryMetadata {
  retryable: boolean;
  nextRetryAt?: string;
  attemptCount: number;
}

export interface PlatformHealth {
  status: PlatformStatus;
  lastSuccessfulSync: string;
  lastAttemptedSync: string;
  staleCacheAvailable: boolean;
  warningMessage?: string;
  retry: RetryMetadata;
}

export interface SyncMetadata {
  lastUpdated: string;
  dataWindow: string;
  globalStatus: PlatformStatus;
  shopifyLatencyMs: number;
  tiktokLatencyMs?: number;
}

export interface MetricContribution {
  value: number;
  label: string;
  status: PlatformStatus;
}

export interface MetricCardData {
  id: string;
  label: string;
  value: string;
  helper: string;
  trend: number;
  status: PlatformStatus;
  contributions: {
    shopify: MetricContribution;
    tiktok: MetricContribution;
  };
  series: number[];
}

export interface SalesDataPoint {
  date: string;
  shopifyRevenue: number;
  tiktokRevenue: number | null;
  shopifyOrders: number;
  tiktokOrders: number | null;
  tiktokEstimated: boolean;
}

export interface InventoryItem {
  id: string;
  productName: string;
  sku: string;
  shopifyStock: number;
  tiktokStock: number | null;
  syncStatus: SyncStatus;
  riskLevel: RiskLevel;
  updatedAt: string;
}

export interface OperationalAlert {
  id: string;
  title: string;
  description: string;
  severity: AlertSeverity;
  platform?: Platform;
  actionLabel?: string;
  createdAt: string;
}

export interface DashboardResponse {
  platforms: {
    shopify: PlatformHealth;
    tiktok: PlatformHealth;
  };
  sync: SyncMetadata;
  metrics: MetricCardData[];
  chartData: SalesDataPoint[];
  inventory: InventoryItem[];
  alerts: OperationalAlert[];
  warnings: string[];
}
