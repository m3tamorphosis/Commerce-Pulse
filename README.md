# Commerce Pulse

Commerce Pulse is a modern SaaS-style e-commerce analytics dashboard for merchants operating on both Shopify and TikTok Shop.

Subtitle: **Unified Analytics Command Center for Shopify & TikTok Shop**

The product focuses on revenue performance, order activity, inventory health, platform sync status, and calm operational alerts.

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
- Inventory mismatches are highlighted with amber, not destructive red.

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
