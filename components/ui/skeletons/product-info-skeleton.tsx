import { Skeleton } from "@/components/ui/skeleton";

export function ProductInfoSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {/* Category */}
      <Skeleton className="h-3 w-24 rounded-sm" />

      {/* Title */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-3/4" />
        <Skeleton className="h-7 w-1/2" />
      </div>

      {/* Price & Stock */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28" />
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Skeleton className="h-11 w-full rounded-md" />
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      {/* Product highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-lg border border-foreground/10 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>

      {/* Trust */}
      <Skeleton className="h-3 w-52" />
    </div>
  );
}