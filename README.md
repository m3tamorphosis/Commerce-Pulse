# Commerce Pulse

Commerce Pulse is a modern SaaS-style e-commerce analytics dashboard for merchants operating on both Shopify and TikTok Shop.

Subtitle: **Unified Analytics Command Center for Shopify & TikTok Shop**

The product focuses on revenue performance, order activity, inventory health, platform sync status, and calm operational alerts.

## Assignment Deliverables

This repository is submitted as a high-fidelity structural mockup for the E-commerce Analytics Dashboard assignment. The app is intentionally built as a realistic frontend prototype, but it does not connect to real Shopify or TikTok Shop accounts.

### 1. UI Concept

Commerce Pulse provides a unified command center for merchants selling on Shopify and TikTok Shop. The dashboard includes:

- KPI cards for revenue, orders, conversion rate, and inventory health
- Sales analytics charts comparing Shopify and TikTok Shop
- Inventory health table with mismatch, low stock, and delayed sync states
- Operational alerts that communicate issues without blocking the full dashboard
- Responsive SaaS layout with sidebar navigation, top controls, and mobile support

### 2. Component Architecture

| Area | Components | State ownership |
| --- | --- | --- |
| App shell | `AppShell`, `Sidebar`, `TopNav` | Sidebar collapse, mobile drawer, notifications, theme toggle, store/date selection use local or provider state |
| Server data | `useDashboardQuery`, `fetchDashboard`, `/api/dashboard` | TanStack Query owns dashboard loading, refetching, cache freshness, and retry behavior |
| Dashboard overview | `DashboardOverview`, `KpiGrid`, `MetricCard` | Reads server state from TanStack Query; retry actions call scoped refetch |
| Charts | `SalesAnalytics`, `ChartContainer` | Local state controls revenue/orders and area/line toggles |
| Inventory | `InventoryTable` | Local state controls search, filters, sorting, pagination, and URL-driven alert filters |
| Alerts | `AlertsPanel`, `AlertCard` | Reads alert data from API; local click handlers route to inventory or retry TikTok |
| Shared UI | `StatusBadge`, `PlatformStatusPill`, `SyncIndicator`, `ErrorBanner`, `LoadingSkeleton`, `EmptyState` | Stateless reusable presentation components |

### 3. API Contract & Error Handling

The API is mocked intentionally. It represents the backend contract the frontend would consume in a production version.

- Shopify and TikTok states are separated.
- TikTok can be delayed or failed while Shopify remains usable.
- Stale TikTok data can remain visible when available.
- Retry metadata is scoped to TikTok instead of forcing a full-dashboard failure.
- Store selector data is mock merchant workspace data.

Example request:

```http
GET /api/dashboard?store=manila&range=7d&scenario=failed
```

Example response where Shopify succeeds and TikTok fails:

```json
{
  "platforms": {
    "shopify": {
      "status": "healthy",
      "lastSuccessfulSync": "2026-05-30T09:14:00.000Z",
      "lastAttemptedSync": "2026-05-30T09:14:00.000Z",
      "staleCacheAvailable": false,
      "retry": {
        "retryable": false,
        "attemptCount": 0
      }
    },
    "tiktok": {
      "status": "failed",
      "lastSuccessfulSync": "2026-05-30T08:01:00.000Z",
      "lastAttemptedSync": "2026-05-30T09:10:00.000Z",
      "staleCacheAvailable": true,
      "warningMessage": "TikTok Shop API timed out. Historical data remains visible from cache.",
      "retry": {
        "retryable": true,
        "nextRetryAt": "2026-05-30T09:22:00.000Z",
        "attemptCount": 3
      }
    }
  },
  "sync": {
    "lastUpdated": "2026-05-30T09:15:00.000Z",
    "dataWindow": "Last 7 days",
    "globalStatus": "delayed",
    "shopifyLatencyMs": 142
  },
  "metrics": [
    {
      "id": "revenue",
      "label": "Total Revenue",
      "value": "$238,100",
      "helper": "Combined sales across connected channels",
      "trend": 12.4,
      "status": "failed",
      "contributions": {
        "shopify": {
          "value": 171800,
          "label": "$171,800",
          "status": "healthy"
        },
        "tiktok": {
          "value": 66300,
          "label": "$66,300",
          "status": "failed"
        }
      },
      "series": [38, 44, 41, 52, 57, 68, 62]
    }
  ],
  "chartData": [
    {
      "date": "Sun",
      "shopifyRevenue": 29200,
      "tiktokRevenue": null,
      "shopifyOrders": 319,
      "tiktokOrders": null,
      "tiktokEstimated": true
    }
  ],
  "inventory": [
    {
      "id": "4",
      "productName": "Rechargeable Desk Lamp",
      "sku": "HOME-LMP-041",
      "shopifyStock": 4,
      "tiktokStock": null,
      "syncStatus": "delayed",
      "riskLevel": "critical",
      "updatedAt": "2026-05-30T08:44:00.000Z"
    }
  ],
  "alerts": [
    {
      "id": "sync-delay",
      "title": "TikTok sync delayed",
      "description": "Recent TikTok order and inventory updates are using the last successful cache.",
      "severity": "warning",
      "platform": "tiktok",
      "actionLabel": "Retry TikTok",
      "createdAt": "2026-05-30T08:57:00.000Z"
    }
  ],
  "warnings": [
    "TikTok Shop data may be delayed. Shopify metrics and inventory remain live."
  ]
}
```

### 4. Engineering & UX Decisions

Trade-off: I did not include profit margin, customer segmentation, or real authentication because the assignment focuses on daily performance, inventory health, and platform resilience. Adding those areas would increase scope without improving the core Shopify/TikTok delay scenario.

Edge case decision: TikTok delays are shown with muted warning cards, delayed status pills, dotted chart lines, and retry actions. Shopify data stays visible and marked healthy, so the merchant can keep operating even when TikTok Shop is delayed or unavailable.

## Design Philosophy

The UI is intentionally data-first and operational. It uses soft gray backgrounds, white cards, restrained borders, readable typography, and muted warning states. The goal is to communicate confidence during platform delays rather than overwhelm merchants with red error banners.

Primary references: Stripe Dashboard, Shopify Admin, Linear, Vercel Analytics, and Plausible Analytics.

## Tech Stack

- Next.js 15 App Router
- TypeScript
- TailwindCSS
- shadcn/ui-style local primitives
- Lucide React Icons
- Recharts
- TanStack Query

## Architecture Decisions

- `app/api/dashboard` exposes a realistic mock dashboard API instead of scattering mock data across components.
- TanStack Query owns dashboard server state, retry behavior, cache freshness, and background refresh.
- Shopify and TikTok platform states are modeled independently so one degraded integration does not crash or block the whole dashboard.
- UI primitives live in `components/ui`, reusable operational components live in `components/shared`, and product-specific modules are split by dashboard area.
- Local component state is used for table filters, sorting, pagination, chart toggles, and sidebar collapse.

## API Contract

`GET /api/dashboard`

The response includes:

- `platforms`: independent Shopify and TikTok health objects
- `sync`: global timestamps, latency, and data window metadata
- `metrics`: KPI cards with platform contributions and trend series
- `chartData`: revenue and order history with TikTok estimated/stale flags
- `inventory`: stock rows with sync and risk states
- `alerts`: calm operational alert cards
- `warnings`: top-level partial data notices

Example:

```json
{
  "platforms": {
    "shopify": {
      "status": "healthy"
    },
    "tiktok": {
      "status": "delayed"
    }
  }
}
```

Supported platform states:

- `healthy`
- `delayed`
- `failed`
- `stale`

## Edge Case Handling

Commerce Pulse assumes Shopify inventory is real-time while TikTok Shop can be delayed or unavailable.

Implemented behavior:

- Shopify metrics remain live when TikTok is delayed.
- TikTok chart lines render as dotted during degraded states.
- Cached TikTok values remain visible where available.
- Missing TikTok values render as unavailable instead of crashing.
- Retry actions are scoped to degraded platform areas.
- Inventory mismatches are highlighted with calm warning colors rather than full-page destructive errors.

## Folder Structure

```txt
app/
  api/dashboard/route.ts
  globals.css
  layout.tsx
  page.tsx
components/
  alerts/
  charts/
  dashboard/
  inventory/
  layout/
  providers/
  shared/
  ui/
hooks/
lib/
mock/
services/
types/
public/
```

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run typecheck
npm run build
```

## Screenshots

Add screenshots here after running the app locally:

- Desktop dashboard overview
- Mobile drawer and stacked metrics
- Inventory mismatch state
- TikTok delayed chart state

## Engineering Trade-offs

- The API is mocked in a Next route to demonstrate contract design without adding unnecessary backend complexity.
- shadcn/ui patterns are implemented as local primitives to keep the assignment lightweight and easy to review.
- The sidebar items are presentational because authentication, routing depth, and permissions are intentionally out of scope.
- Alert actions are UI-ready but not wired to real integrations because the assignment focuses on dashboard architecture and operational UX.

## Scalability Considerations

- The dashboard response can be split into route-specific endpoints when data volume grows.
- Inventory table behavior can move to server-side pagination and filtering.
- Platform integration retries can become service-specific mutations in TanStack Query.
- The UI component boundaries support adding dedicated Analytics, Orders, Alerts, and Settings routes later.
