"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "../separator";

export function BlogCardSkeleton() {
  return (
    <Card className="bg-background/10 overflow-hidden border-0 rounded-none pt-0 animate-pulse">
      {/* Image Skeleton */}
      <div className="relative aspect-16/10 bg-foreground/10" />

      <CardContent className="p-0">
        {/* Meta Row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="h-3 w-24 bg-foreground/10 rounded" />
          <div className="h-3 w-20 bg-foreground/10 rounded" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-4 w-3/4 bg-foreground/10 rounded" />
          <div className="h-4 w-1/2 bg-foreground/10 rounded" />
        </div>

        {/* Description */}
        <div className="space-y-2 mb-4">
          <div className="h-3 w-full bg-foreground/10 rounded" />
          <div className="h-3 w-5/6 bg-foreground/10 rounded" />
          <div className="h-3 w-2/3 bg-foreground/10 rounded" />
        </div>

        <Separator className="my-4 opacity-20" />

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 bg-foreground/10 rounded" />
          <div className="h-3 w-10 bg-foreground/10 rounded" />
        </div>
      </CardContent>
    </Card>
  );
}