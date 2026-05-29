import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorBannerProps {
  title: string;
  description: string;
  actionLabel?: string;
  onRetry?: () => void;
}

export function ErrorBanner({ title, description, actionLabel = "Retry", onRetry }: ErrorBannerProps) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-950 dark:border-red-300/40 dark:bg-red-950/55 dark:text-red-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-300" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-red-900/85 dark:text-red-100">{description}</p>
        </div>
      </div>
      {onRetry ? (
        <Button type="button" variant="warning" size="sm" onClick={onRetry}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
