import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/app-shell";
import { QueryProvider } from "@/components/providers/query-provider";
import { RoutePreloader } from "@/components/providers/route-preloader";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { WorkspaceProvider } from "@/components/providers/workspace-provider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('commerce-pulse-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                } catch (error) {}
              })();
            `
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <WorkspaceProvider>
            <QueryProvider>
              <RoutePreloader>
                <AppShell>{children}</AppShell>
              </RoutePreloader>
            </QueryProvider>
          </WorkspaceProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
