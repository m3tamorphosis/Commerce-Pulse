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
    <div className="flex flex-col gap-3 rounded-xl border border-l-4 border-rose-300/80 border-l-rose-500 bg-rose-50 p-4 text-rose-950 shadow-soft dark:border-rose-300/40 dark:border-l-rose-400 dark:bg-rose-950/55 dark:text-rose-50 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600 dark:text-rose-200" />
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-rose-900/85 dark:text-rose-100">{description}</p>
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
