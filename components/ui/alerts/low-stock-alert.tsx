"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  useDocuments,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/components/providers/store-provider";

interface ProductProjection {
  name: string;
  stock: number;
  image: {
    asset: {
      url: string;
    } | null;
  } | null;
}

function LowStockProductRow(handle: DocumentHandle) {
  const store = useStore();

  const { data } = useDocumentProjection<ProductProjection>({
    ...handle,
    projection: `{
      name,
      stock,
      "image": images[0]{
        asset->{
          url
        }
      }
    }`,
  });

  if (!data) return null;
  if (!store?.slug) return null;

  const isOutOfStock = data.stock === 0;

  return (
    <Link
      href={`/studio/store/${store.slug}/inventory/${handle.documentId}`}
      className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-foreground/10"
    >
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-foreground/10">
        {data.image?.asset?.url ? (
          <Image
            src={data.image.asset.url}
            alt={data.name}
            fill
            className="object-cover"
            sizes="40px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-foreground/40">
            ?
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground/80">
          {data.name}
        </p>
      </div>

      <Badge
        variant={isOutOfStock ? "destructive" : "secondary"}
        className="shrink-0"
      >
        {isOutOfStock ? "Out of stock" : `${data.stock} left`}
      </Badge>
    </Link>
  );
}

function LowStockProductRowSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-foreground/10 bg-background p-3">
      <Skeleton className="h-10 w-10 rounded-md" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

function LowStockAlertContent() {
  const store = useStore();

  const { data: lowStockProducts } = useDocuments({
    documentType: "product",
    filter: `
      _type == "product"
      && store._ref == $storeId
      && stock <= 5
    `,
    params: {
      storeId: store?._id ?? "",
    },
    orderings: [{ field: "stock", direction: "asc" }],
    batchSize: 10,
  });

  if (!lowStockProducts || lowStockProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-4">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
          <span className="text-lg">✓</span>
        </div>
        <p className="text-xs text-foreground/60">
          All products are well stocked!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 rounded-b-xl border border-foreground/10 p-4">
      {lowStockProducts.slice(0, 5).map((handle) => (
        <Suspense
          key={handle.documentId}
          fallback={<LowStockProductRowSkeleton />}
        >
          <LowStockProductRow {...handle} />
        </Suspense>
      ))}

      {lowStockProducts.length > 5 && store?.slug && (
        <Link
          href={`/studio/store/${store.slug}/inventory?filter=low-stock`}
          className="block text-center text-sm text-foreground/60 hover:text-foreground/80"
        >
          View all {lowStockProducts.length} low stock items →
        </Link>
      )}
    </div>
  );
}

function LowStockAlertSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <LowStockProductRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function LowStockAlert() {
  return (
    <div>
      <div className="flex items-center gap-2 px-6 py-4">
        <AlertTriangle className="h-5 w-5 text-amber-500" />
        <h2 className="font-semibold text-foreground/80">
          Low Stock Alerts
        </h2>
      </div>

      <div>
        <Suspense fallback={<LowStockAlertSkeleton />}>
          <LowStockAlertContent />
        </Suspense>
      </div>
    </div>
  );
}