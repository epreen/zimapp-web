import { Skeleton } from "@/components/ui/skeleton";

export function ProductStoreInfoSkeleton() {
  return (
    <div className="flex items-center gap-4 mt-14">
      {/* Logo placeholder */}
      <Skeleton className="size-11 rounded-lg border border-foreground/10" />

      {/* Store text */}
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
    </div>
  );
}
