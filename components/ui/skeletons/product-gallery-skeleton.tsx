import { Skeleton } from "@/components/ui/skeleton";

export function ProductGallerySkeleton() {
  return (
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">
        
        {/* Thumbnail Gallery */}
        <div className="flex sm:flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-26 w-26 shrink-0 rounded-lg" />
          ))}
        </div>

        {/* Main Image */}
        <Skeleton className="flex justify-center items-center h-100 sm:size-113 rounded-lg" />

      </div>
      
    </div>
  );
}
