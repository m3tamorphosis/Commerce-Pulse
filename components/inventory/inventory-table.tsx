"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowDownUp, Search } from "lucide-react";
import type { InventoryItem, RiskLevel, SyncStatus } from "@/types/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, formatRelativeMinutes, statusLabel } from "@/lib/utils";

type SortKey = "productName" | "shopifyStock" | "tiktokStock" | "riskLevel";
type FilterKey = "all" | SyncStatus | RiskLevel;

const filters: FilterKey[] = ["all", "synced", "delayed", "out_of_sync", "low", "critical"];

export function InventoryTable({
  items,
  isLoading
}: {
  items?: InventoryItem[];
  isLoading: boolean;
}) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [sortKey, setSortKey] = useState<SortKey>("riskLevel");
  const [page, setPage] = useState(1);
  const [animationKey, setAnimationKey] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const filterParam = searchParams.get("filter") as FilterKey | null;
    const riskParam = searchParams.get("risk") as FilterKey | null;
    const nextFilter =
      filterParam && filters.includes(filterParam)
        ? filterParam
        : riskParam && filters.includes(riskParam)
          ? riskParam
          : null;

    if (nextFilter) {
      setFilter(nextFilter);
      setPage(1);
      setAnimationKey((value) => value + 1);
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    const normalized = query.toLowerCase().trim();

    return (items ?? [])
      .filter((item) => {
        const matchesQuery =
          item.productName.toLowerCase().includes(normalized) ||
          item.sku.toLowerCase().includes(normalized);
        const matchesFilter =
          filter === "all" || item.syncStatus === filter || item.riskLevel === filter;
        return matchesQuery && matchesFilter;
      })
      .sort((a, b) => {
        if (sortKey === "tiktokStock") {
          return (a.tiktokStock ?? -1) - (b.tiktokStock ?? -1);
        }
        if (sortKey === "shopifyStock") {
          return a.shopifyStock - b.shopifyStock;
        }
        if (sortKey === "riskLevel") {
          const weight = { critical: 0, low: 1, normal: 2 };
          return weight[a.riskLevel] - weight[b.riskLevel];
        }
        return a.productName.localeCompare(b.productName);
      });
  }, [filter, items, query, sortKey]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <CardTitle>Inventory Health</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Stock visibility across Shopify and TikTok Shop with mismatch-aware states.
            </p>
          </div>
          <div className="relative w-full lg:w-80">
            <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              className="h-9 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none transition focus:ring-2 focus:ring-ring"
              placeholder="Search product or SKU"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map((option) => (
            <button
              key={option}
              className={cn(
                "whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition duration-150 ease-out active:scale-[0.98]",
                filter === option ? "bg-slate-950 text-white" : "bg-card text-muted-foreground hover:bg-muted"
              )}
              onClick={() => {
                setFilter(option);
                setPage(1);
                setAnimationKey((value) => value + 1);
              }}
            >
              {option === "all" ? "All" : statusLabel(option)}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? <LoadingSkeleton className="h-72" /> : null}
        {!isLoading && !visible.length ? (
          <EmptyState title="No inventory matches" description="Adjust search or filters to view current stock rows." />
        ) : null}
        {!isLoading && visible.length ? (
          <>
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-[820px] w-full border-collapse text-left text-sm">
                <thead className="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                  <tr>
                    {[
                      ["productName", "Product Name"],
                      ["sku", "SKU"],
                      ["shopifyStock", "Shopify Stock"],
                      ["tiktokStock", "TikTok Stock"],
                      ["syncStatus", "Sync Status"],
                      ["riskLevel", "Risk Level"]
                    ].map(([key, label]) => (
                      <th key={key} className="px-4 py-3 font-semibold">
                        {["productName", "shopifyStock", "tiktokStock", "riskLevel"].includes(key) ? (
                          <button
                            className="inline-flex items-center gap-2"
                            onClick={() => {
                              setSortKey(key as SortKey);
                              setAnimationKey((value) => value + 1);
                            }}
                          >
                            {label}
                            <ArrowDownUp className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          label
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y bg-card">
                  {visible.map((item, index) => {
                    const mismatch = item.tiktokStock !== null && item.shopifyStock !== item.tiktokStock;
                    return (
                      <tr
                        key={`${animationKey}-${item.id}`}
                        className={cn(
                          "motion-safe:animate-row-in transition-colors duration-200 hover:bg-muted/45",
                          mismatch
                            ? "border-l-4 border-l-red-400 bg-red-100/80 dark:border-l-red-400 dark:bg-red-950/35"
                            : undefined,
                          filter !== "all" && "ring-1 ring-primary/15"
                        )}
                        style={{ animationDelay: `${index * 35}ms` }}
                      >
                        <td className="px-4 py-4">
                          <div>
                            <p className="font-medium">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">
                              Updated {formatRelativeMinutes(item.updatedAt)}
                            </p>
                          </div>
                        </td>
                        <td className="px-4 py-4 font-mono text-xs text-muted-foreground">{item.sku}</td>
                        <td className="px-4 py-4 font-medium text-emerald-700 dark:text-emerald-200">
                          {item.shopifyStock}
                        </td>
                        <td className="px-4 py-4 font-medium">
                          {item.tiktokStock === null ? (
                            <span className="text-red-700 dark:text-red-200">Unavailable</span>
                          ) : (
                            <span
                              className={
                                mismatch || item.syncStatus === "delayed"
                                  ? "text-red-700 dark:text-red-200"
                                  : "text-emerald-700 dark:text-emerald-200"
                              }
                            >
                              {item.tiktokStock}
                            </span>
                          )}
                          {mismatch ? (
                            <p className="mt-1 text-xs text-red-700 dark:text-red-200">Mismatch: {Math.abs(item.shopifyStock - item.tiktokStock!)} units</p>
                          ) : null}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={item.syncStatus} />
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={item.riskLevel} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {visible.length} of {filtered.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => {
                    setPage((value) => Math.max(1, value - 1));
                    setAnimationKey((value) => value + 1);
                  }}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {page} of {pageCount}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page === pageCount}
                  onClick={() => {
                    setPage((value) => Math.min(pageCount, value + 1));
                    setAnimationKey((value) => value + 1);
                  }}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
