"use client";

import { createContext, useContext, useMemo, useState } from "react";

export const stores = [
  { id: "manila", label: "Manila Supply Co." },
  { id: "luzon", label: "Luzon Home Goods" },
  { id: "cebu", label: "Cebu Style Market" }
] as const;

export const dateRanges = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 days" },
  { id: "30d", label: "Last 30 days" },
  { id: "quarter", label: "This quarter" }
] as const;

export type StoreId = (typeof stores)[number]["id"];
export type DateRangeId = (typeof dateRanges)[number]["id"];

interface WorkspaceContextValue {
  selectedStore: (typeof stores)[number];
  selectedDateRange: (typeof dateRanges)[number];
  setSelectedStoreId: (storeId: StoreId) => void;
  setSelectedDateRangeId: (dateRangeId: DateRangeId) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [selectedStoreId, setSelectedStoreId] = useState<StoreId>("manila");
  const [selectedDateRangeId, setSelectedDateRangeId] = useState<DateRangeId>("7d");

  const value = useMemo(() => {
    const selectedStore = stores.find((store) => store.id === selectedStoreId) ?? stores[0];
    const selectedDateRange =
      dateRanges.find((range) => range.id === selectedDateRangeId) ?? dateRanges[1];

    return {
      selectedStore,
      selectedDateRange,
      setSelectedStoreId,
      setSelectedDateRangeId
    };
  }, [selectedDateRangeId, selectedStoreId]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }

  return context;
}
