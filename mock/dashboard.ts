import type { DashboardResponse, PlatformStatus } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";

interface MockOptions {
  tiktokStatus: PlatformStatus;
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

export function getDashboardMock({ tiktokStatus }: MockOptions): DashboardResponse {
  const tiktokFailed = tiktokStatus === "failed";
  const tiktokDelayed = tiktokStatus === "delayed" || tiktokStatus === "stale" || tiktokFailed;
  const tiktokLastSuccessfulSync = tiktokFailed ? minutesAgo(74) : minutesAgo(18);

  const chartData = [
    ["Mon", 18400, 7400, 214, 88],
    ["Tue", 21350, 8200, 247, 94],
    ["Wed", 19800, 7900, 236, 91],
    ["Thu", 24750, 9400, 278, 102],
    ["Fri", 26500, 10100, 296, 115],
    ["Sat", 31800, 12200, 344, 138],
    ["Sun", 29200, 11100, 319, 126]
  ].map(([date, shopifyRevenue, tiktokRevenue, shopifyOrders, tiktokOrders]) => ({
    date: String(date),
    shopifyRevenue: Number(shopifyRevenue),
    tiktokRevenue: tiktokFailed && date === "Sun" ? null : Number(tiktokRevenue),
    shopifyOrders: Number(shopifyOrders),
    tiktokOrders: tiktokFailed && date === "Sun" ? null : Number(tiktokOrders),
    tiktokEstimated: tiktokDelayed
  }));

  const shopifyRevenue = chartData.reduce((sum, point) => sum + point.shopifyRevenue, 0);
  const tiktokRevenue = chartData.reduce((sum, point) => sum + (point.tiktokRevenue ?? 0), 0);
  const shopifyOrders = chartData.reduce((sum, point) => sum + point.shopifyOrders, 0);
  const tiktokOrders = chartData.reduce((sum, point) => sum + (point.tiktokOrders ?? 0), 0);

  return {
    platforms: {
      shopify: {
        status: "healthy",
        lastSuccessfulSync: minutesAgo(1),
        lastAttemptedSync: minutesAgo(1),
        staleCacheAvailable: false,
        retry: {
          retryable: false,
          attemptCount: 0
        }
      },
      tiktok: {
        status: tiktokStatus,
        lastSuccessfulSync: tiktokLastSuccessfulSync,
        lastAttemptedSync: minutesAgo(tiktokFailed ? 5 : 18),
        staleCacheAvailable: tiktokDelayed,
        warningMessage: tiktokFailed
          ? "TikTok Shop API timed out. Historical data remains visible from cache."
          : "TikTok Shop data is delayed and may update on the next sync cycle.",
        retry: {
          retryable: tiktokStatus !== "healthy",
          nextRetryAt: minutesAgo(-7),
          attemptCount: tiktokFailed ? 3 : 1
        }
      }
    },
    sync: {
      lastUpdated: new Date().toISOString(),
      dataWindow: "Last 7 days",
      globalStatus: tiktokStatus === "healthy" ? "healthy" : "delayed",
      shopifyLatencyMs: 142,
      tiktokLatencyMs: tiktokFailed ? undefined : 1280
    },
    metrics: [
      {
        id: "revenue",
        label: "Total Revenue",
        value: formatCurrency(shopifyRevenue + tiktokRevenue),
        helper: "Combined sales across connected channels",
        trend: 12.4,
        status: tiktokDelayed ? "delayed" : "healthy",
        contributions: {
          shopify: { value: shopifyRevenue, label: formatCurrency(shopifyRevenue), status: "healthy" },
          tiktok: { value: tiktokRevenue, label: formatCurrency(tiktokRevenue), status: tiktokStatus }
        },
        series: [38, 44, 41, 52, 57, 68, 62]
      },
      {
        id: "orders",
        label: "Orders",
        value: `${shopifyOrders + tiktokOrders}`,
        helper: "Paid orders excluding cancellations",
        trend: 8.1,
        status: tiktokDelayed ? "delayed" : "healthy",
        contributions: {
          shopify: { value: shopifyOrders, label: `${shopifyOrders}`, status: "healthy" },
          tiktok: { value: tiktokOrders, label: `${tiktokOrders}`, status: tiktokStatus }
        },
        series: [302, 341, 327, 380, 411, 482, 445]
      },
      {
        id: "conversion",
        label: "Conversion Rate",
        value: "3.42%",
        helper: "Weighted session to purchase rate",
        trend: 4.6,
        status: "healthy",
        contributions: {
          shopify: { value: 3.7, label: "3.70%", status: "healthy" },
          tiktok: { value: 2.9, label: "2.90%", status: tiktokStatus }
        },
        series: [2.9, 3.1, 3.0, 3.3, 3.4, 3.6, 3.42]
      },
      {
        id: "inventory",
        label: "Inventory Health",
        value: "91%",
        helper: "Products stocked and in sync",
        trend: -2.3,
        status: "delayed",
        contributions: {
          shopify: { value: 96, label: "96%", status: "healthy" },
          tiktok: { value: 84, label: "84%", status: tiktokStatus }
        },
        series: [94, 94, 93, 92, 91, 90, 91]
      }
    ],
    chartData,
    inventory: [
      {
        id: "1",
        productName: "Everyday Canvas Tote",
        sku: "BAG-CAN-001",
        shopifyStock: 128,
        tiktokStock: 128,
        syncStatus: "synced",
        riskLevel: "normal",
        updatedAt: minutesAgo(2)
      },
      {
        id: "2",
        productName: "Ribbed Performance Tee",
        sku: "APP-TEE-113",
        shopifyStock: 36,
        tiktokStock: 48,
        syncStatus: "out_of_sync",
        riskLevel: "low",
        updatedAt: minutesAgo(19)
      },
      {
        id: "3",
        productName: "Ceramic Pour Over Kit",
        sku: "HOME-COF-221",
        shopifyStock: 11,
        tiktokStock: 11,
        syncStatus: "low_stock",
        riskLevel: "low",
        updatedAt: minutesAgo(4)
      },
      {
        id: "4",
        productName: "Modular Desk Lamp",
        sku: "HOME-LMP-041",
        shopifyStock: 4,
        tiktokStock: tiktokFailed ? null : 9,
        syncStatus: tiktokFailed ? "delayed" : "critical_stock",
        riskLevel: "critical",
        updatedAt: minutesAgo(31)
      },
      {
        id: "5",
        productName: "Travel Compression Set",
        sku: "TRV-CMP-508",
        shopifyStock: 86,
        tiktokStock: 86,
        syncStatus: "synced",
        riskLevel: "normal",
        updatedAt: minutesAgo(1)
      },
      {
        id: "6",
        productName: "Matte Bottle 24oz",
        sku: "ACC-BTL-024",
        shopifyStock: 22,
        tiktokStock: 26,
        syncStatus: "delayed",
        riskLevel: "normal",
        updatedAt: minutesAgo(18)
      }
    ],
    alerts: [
      {
        id: "sync-delay",
        title: "TikTok sync delayed",
        description: "Recent TikTok order and inventory updates are using the last successful cache.",
        severity: "warning",
        platform: "tiktok",
        actionLabel: "Retry TikTok",
        createdAt: minutesAgo(18)
      },
      {
        id: "low-stock",
        title: "Inventory nearing threshold",
        description: "Ceramic Pour Over Kit has 11 units remaining across both channels.",
        severity: "info",
        actionLabel: "View SKU",
        createdAt: minutesAgo(24)
      },
      {
        id: "stock-mismatch",
        title: "Stock mismatch detected",
        description: "Ribbed Performance Tee differs by 12 units between Shopify and TikTok Shop.",
        severity: "warning",
        platform: "tiktok",
        actionLabel: "Review match",
        createdAt: minutesAgo(42)
      }
    ],
    warnings: tiktokDelayed
      ? ["TikTok Shop data may be delayed. Shopify metrics and inventory remain live."]
      : []
  };
}
