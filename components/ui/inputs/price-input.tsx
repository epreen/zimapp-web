"use client";

import { Suspense } from "react";
import {
  useDocument,
  useEditDocument,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceInputProps extends DocumentHandle {}

function PriceInputContent(handle: PriceInputProps) {
  const { data: price } = useDocument({ ...handle, path: "price" });
  const editPrice = useEditDocument({ ...handle, path: "price" });

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-foreground/80">MWK</span>
      <Input
        type="text"
        variant="silent"
        min={0}
        step={0.01}
        value={(price as number) ?? 0}
        onChange={(e) => editPrice(parseFloat(e.target.value) || 0)}
        className="w-fit text-right border-none shadow-none ring-none"
      />
    </div>
  );
}

function PriceInputSkeleton() {
  return <Skeleton className="h-8 w-24" />;
}

export function PriceInput(props: PriceInputProps) {
  return (
    <Suspense fallback={<PriceInputSkeleton />}>
      <PriceInputContent {...props} />
    </Suspense>
  );
}
