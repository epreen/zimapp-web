"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="border-none bg-background shadow-none">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden rounded-md">
        <Skeleton className="h-full w-full" />
      </div>

      {/* Content */}
      <CardContent className="px-0 pt-3 flex justify-between items-center">
        <Skeleton className="h-5 w-1/2" />
        <Skeleton className="h-5 w-1/4" />
      </CardContent>

      {/* Action */}
      <CardFooter className="px-0 pt-2">
        <Skeleton className="h-11 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
