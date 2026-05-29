import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { RoutePreloader } from "@/components/providers/route-preloader";
import { ThemeProvider } from "@/components/providers/theme-provider";

export const metadata: Metadata = {
  title: "Commerce Pulse",
  description: "Unified Analytics Command Center for Shopify & TikTok Shop"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <QueryProvider>
            <RoutePreloader>
              <AppShell>{children}</AppShell>
            </RoutePreloader>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
