import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { PlatformStatus, RiskLevel, SyncStatus } from "@/types/dashboard";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatRelativeMinutes(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
}

export function statusLabel(status: PlatformStatus | SyncStatus | RiskLevel) {
  return status.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function getStatusTone(status: PlatformStatus | SyncStatus | RiskLevel) {
  if (status === "healthy" || status === "synced" || status === "normal") {
    return "success";
  }

  if (status === "failed" || status === "critical" || status === "critical_stock") {
    return "danger";
  }

  return "warning";
}
