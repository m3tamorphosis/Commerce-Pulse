import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-72" />
        <LoadingSkeleton className="h-10 w-80" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <LoadingSkeleton key={index} className="h-44" />
        ))}
      </div>
      <LoadingSkeleton className="h-96" />
    </div>
  );
}
