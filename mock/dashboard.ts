import type { DashboardResponse, PlatformStatus } from "@/types/dashboard";
import { formatCurrency } from "@/lib/utils";

interface MockOptions {
  tiktokStatus?: PlatformStatus;
  storeId?: string;
  dateRangeId?: string;
}

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60000).toISOString();

const storeProfiles = {
  manila: {
    label: "Manila Supply Co.",
    revenueMultiplier: 1,
    orderMultiplier: 1,
    defaultTiktokStatus: "delayed" as PlatformStatus,
    conversion: { shopify: 3.7, tiktok: 2.9, total: "3.42%" },
    inventory: { total: "91%", shopify: 96, tiktok: 84 },
    products: [
      "Everyday Canvas Tote",
      "Ribbed Performance Tee",
      "Insulated Tumbler Set",
      "Rechargeable Desk Lamp",
      "Travel Organizer Pouch",
      "Matte Bottle 24oz",
      "Bamboo Laptop Stand",
      "Cord Organizer Kit",
      "Mini Ring Light",
      "Foldable Market Bag",
      "Desk Cable Tray",
      "Reusable Food Container",
      "Portable Fan",
      "Cotton Crew Socks",
      "Slim Card Holder"
    ]
  },
  luzon: {
    label: "Luzon Home Goods",
    revenueMultiplier: 0.72,
    orderMultiplier: 0.78,
    defaultTiktokStatus: "healthy" as PlatformStatus,
    conversion: { shopify: 3.1, tiktok: 2.6, total: "2.94%" },
    inventory: { total: "87%", shopify: 92, tiktok: 79 },
    products: [
      "Bamboo Storage Basket",
      "Ceramic Dinnerware Set",
      "Abaca Table Runner",
      "Rattan Floor Lamp",
      "Cotton Bath Towel Pack",
      "Acacia Serving Tray",
      "Capiz Shell Coasters",
      "Woven Laundry Hamper",
      "Linen Pillow Cover",
      "Kitchen Spice Rack",
      "Handwoven Placemat Set",
      "Wooden Utensil Holder",
      "Candle Warmer Lamp",
      "Glass Pantry Jar Set",
      "Sofa Throw Blanket"
    ]
  },
  cebu: {
    label: "Cebu Style Market",
    revenueMultiplier: 1.28,
    orderMultiplier: 1.18,
    defaultTiktokStatus: "stale" as PlatformStatus,
    conversion: { shopify: 4.2, tiktok: 3.4, total: "3.88%" },
    inventory: { total: "94%", shopify: 97, tiktok: 89 },
    products: [
      "Linen Resort Shirt",
      "Woven Crossbody Bag",
      "Pearl Accent Earrings",
      "Beach Day Sandals",
      "Printed Midi Dress",
      "Canvas Weekend Tote",
      "Cropped Knit Top",
      "Tailored Linen Shorts",
      "Beaded Phone Strap",
      "Oversized Sun Hat",
      "Textured Bucket Bag",
      "Silk Square Scarf",
      "Everyday Hoop Earrings",
      "Denim Wrap Skirt",
      "Resort Slide Sandals"
    ]
  }
};

const dateRangeProfiles = {
  today: { label: "Today", multiplier: 0.18, trendOffset: -3 },
  "7d": { label: "Last 7 days", multiplier: 1, trendOffset: 0 },
  "30d": { label: "Last 30 days", multiplier: 3.8, trendOffset: 4 },
  quarter: { label: "This quarter", multiplier: 9.6, trendOffset: 7 }
};

type StoreKey = keyof typeof storeProfiles;
type DateRangeKey = keyof typeof dateRangeProfiles;

function resolveStore(storeId?: string) {
  return storeProfiles[(storeId as StoreKey) in storeProfiles ? (storeId as StoreKey) : "manila"];
}

function resolveDateRange(dateRangeId?: string) {
  return dateRangeProfiles[
    (dateRangeId as DateRangeKey) in dateRangeProfiles ? (dateRangeId as DateRangeKey) : "7d"
  ];
}

function scale(value: number, multiplier: number) {
  return Math.round(value * multiplier);
}

const inventoryTemplates = [
  { sku: "BAG-CAN-001", shopify: 128, tiktok: 128, sync: "synced", risk: "normal", minutes: 2 },
  { sku: "APP-TEE-113", shopify: 36, tiktok: 48, sync: "out_of_sync", risk: "low", minutes: 19 },
  { sku: "HOME-COF-221", shopify: 11, tiktok: 11, sync: "low_stock", risk: "low", minutes: 4 },
  { sku: "HOME-LMP-041", shopify: 4, tiktok: 9, sync: "critical_stock", risk: "critical", minutes: 31 },
  { sku: "TRV-CMP-508", shopify: 86, tiktok: 86, sync: "synced", risk: "normal", minutes: 1 },
  { sku: "ACC-BTL-024", shopify: 22, tiktok: 26, sync: "delayed", risk: "normal", minutes: 18 },
  { sku: "WRK-STD-212", shopify: 64, tiktok: 64, sync: "synced", risk: "normal", minutes: 3 },
  { sku: "ACC-ORG-077", shopify: 17, tiktok: 21, sync: "out_of_sync", risk: "low", minutes: 27 },
  { sku: "VID-LGT-034", shopify: 9, tiktok: 9, sync: "low_stock", risk: "low", minutes: 8 },
  { sku: "BAG-FLD-302", shopify: 142, tiktok: 139, sync: "delayed", risk: "normal", minutes: 22 },
  { sku: "DSK-TRY-610", shopify: 58, tiktok: 58, sync: "synced", risk: "normal", minutes: 5 },
  { sku: "KIT-FOD-480", shopify: 6, tiktok: 8, sync: "critical_stock", risk: "critical", minutes: 35 },
  { sku: "ELE-FAN-099", shopify: 73, tiktok: 73, sync: "synced", risk: "normal", minutes: 7 },
  { sku: "APP-SCK-015", shopify: 29, tiktok: 35, sync: "out_of_sync", risk: "normal", minutes: 41 },
  { sku: "ACC-CRD-888", shopify: 13, tiktok: 13, sync: "low_stock", risk: "low", minutes: 12 }
] as const;

export function getDashboardMock({ tiktokStatus, storeId, dateRangeId }: MockOptions): DashboardResponse {
  const store = resolveStore(storeId);
  const dateRange = resolveDateRange(dateRangeId);
  const resolvedTiktokStatus = tiktokStatus ?? store.defaultTiktokStatus;
  const multiplier = store.revenueMultiplier * dateRange.multiplier;
  const orderMultiplier = store.orderMultiplier * dateRange.multiplier;
  const tiktokFailed = resolvedTiktokStatus === "failed";
  const tiktokDelayed = resolvedTiktokStatus === "delayed" || resolvedTiktokStatus === "stale" || tiktokFailed;
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
    shopifyRevenue: scale(Number(shopifyRevenue), multiplier),
    tiktokRevenue: tiktokFailed && date === "Sun" ? null : scale(Number(tiktokRevenue), multiplier),
    shopifyOrders: scale(Number(shopifyOrders), orderMultiplier),
    tiktokOrders: tiktokFailed && date === "Sun" ? null : scale(Number(tiktokOrders), orderMultiplier),
    tiktokEstimated: tiktokDelayed
  }));

  const shopifyRevenue = chartData.reduce((sum, point) => sum + point.shopifyRevenue, 0);
  const tiktokRevenue = chartData.reduce((sum, point) => sum + (point.tiktokRevenue ?? 0), 0);
  const shopifyOrders = chartData.reduce((sum, point) => sum + point.shopifyOrders, 0);
  const tiktokOrders = chartData.reduce((sum, point) => sum + (point.tiktokOrders ?? 0), 0);
  const inventory = store.products.map((productName, index) => {
    const template = inventoryTemplates[index % inventoryTemplates.length];
    const critical = template.sync === "critical_stock";

    return {
      id: `${index + 1}`,
      productName,
      sku: template.sku,
      shopifyStock: Math.max(critical ? 2 : 0, scale(template.shopify, store.orderMultiplier)),
      tiktokStock:
        tiktokFailed && critical ? null : Math.max(critical ? 3 : 0, scale(template.tiktok, store.orderMultiplier)),
      syncStatus: tiktokFailed && critical ? "delayed" : template.sync,
      riskLevel: template.risk,
      updatedAt: minutesAgo(template.minutes)
    };
  });

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
        status: resolvedTiktokStatus,
        lastSuccessfulSync: tiktokLastSuccessfulSync,
        lastAttemptedSync: minutesAgo(tiktokFailed ? 5 : 18),
        staleCacheAvailable: tiktokDelayed,
        warningMessage: tiktokFailed
          ? "TikTok Shop API timed out. Historical data remains visible from cache."
          : "TikTok Shop data is delayed and may update on the next sync cycle.",
        retry: {
          retryable: resolvedTiktokStatus !== "healthy",
          nextRetryAt: minutesAgo(-7),
          attemptCount: tiktokFailed ? 3 : 1
        }
      }
    },
    sync: {
      lastUpdated: new Date().toISOString(),
      dataWindow: dateRange.label,
      globalStatus: resolvedTiktokStatus === "healthy" ? "healthy" : "delayed",
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
        status: tiktokDelayed ? resolvedTiktokStatus : "healthy",
        contributions: {
          shopify: { value: shopifyRevenue, label: formatCurrency(shopifyRevenue), status: "healthy" },
          tiktok: { value: tiktokRevenue, label: formatCurrency(tiktokRevenue), status: resolvedTiktokStatus }
        },
        series: [38, 44, 41, 52, 57, 68, 62]
      },
      {
        id: "orders",
        label: "Orders",
        value: `${shopifyOrders + tiktokOrders}`,
        helper: "Paid orders excluding cancellations",
        trend: 8.1,
        status: tiktokDelayed ? resolvedTiktokStatus : "healthy",
        contributions: {
          shopify: { value: shopifyOrders, label: `${shopifyOrders}`, status: "healthy" },
          tiktok: { value: tiktokOrders, label: `${tiktokOrders}`, status: resolvedTiktokStatus }
        },
        series: [302, 341, 327, 380, 411, 482, 445]
      },
      {
        id: "conversion",
        label: "Conversion Rate",
        value: store.conversion.total,
        helper: "Weighted session to purchase rate",
        trend: 4.6,
        status: tiktokDelayed ? resolvedTiktokStatus : "healthy",
        contributions: {
          shopify: {
            value: store.conversion.shopify,
            label: `${store.conversion.shopify.toFixed(2)}%`,
            status: "healthy"
          },
          tiktok: {
            value: store.conversion.tiktok,
            label: `${store.conversion.tiktok.toFixed(2)}%`,
            status: resolvedTiktokStatus
          }
        },
        series: [2.9, 3.1, 3.0, 3.3, 3.4, 3.6, 3.42]
      },
      {
        id: "inventory",
        label: "Inventory Health",
        value: store.inventory.total,
        helper: "Products stocked and in sync",
        trend: -2.3,
        status: tiktokDelayed ? resolvedTiktokStatus : "healthy",
        contributions: {
          shopify: {
            value: store.inventory.shopify,
            label: `${store.inventory.shopify}%`,
            status: "healthy"
          },
          tiktok: {
            value: store.inventory.tiktok,
            label: `${store.inventory.tiktok}%`,
            status: resolvedTiktokStatus
          }
        },
        series: [94, 94, 93, 92, 91, 90, 91]
      }
    ],
    chartData,
    inventory,
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
        description: `${store.products[2]} has ${scale(11, store.orderMultiplier)} units remaining across both channels.`,
        severity: "info",
        actionLabel: "View SKU",
        createdAt: minutesAgo(24)
      },
      {
        id: "stock-mismatch",
        title: "Stock mismatch detected",
        description: `${store.products[1]} differs between Shopify and TikTok Shop.`,
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
