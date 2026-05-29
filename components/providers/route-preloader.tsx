"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const dashboardRoutes = ["/", "/analytics", "/inventory", "/orders", "/alerts", "/settings"];

export function RoutePreloader({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const preload = () => {
      dashboardRoutes.forEach((route) => router.prefetch(route));
    };

    if ("requestIdleCallback" in window) {
      const idle = window.requestIdleCallback(preload, { timeout: 1200 });

      return () => {
        window.cancelIdleCallback(idle);
      };
    }

    const timer = globalThis.setTimeout(preload, 250);

    return () => {
      globalThis.clearTimeout(timer);
    };
  }, [router]);

  return children;
}
