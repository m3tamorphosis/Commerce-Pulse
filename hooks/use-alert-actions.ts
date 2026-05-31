"use client";

import { useRouter } from "next/navigation";
import type { OperationalAlert } from "@/types/dashboard";

export function useAlertActions(refetch: () => void) {
  const router = useRouter();

  return (alert: OperationalAlert) => {
    if (alert.actionLabel?.includes("Retry")) {
      refetch();
      return;
    }

    if (alert.id === "low-stock") {
      router.push("/inventory?risk=low");
      return;
    }

    if (alert.id === "stock-mismatch") {
      router.push("/inventory?filter=out_of_sync");
    }
  };
}
