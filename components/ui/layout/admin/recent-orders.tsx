"use client";

import { Suspense } from "react";
import Link from "next/link";
import {
  useDocuments,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { ShoppingCart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { getOrderStatus } from "@/lib/constants/order-status";
import { formatPrice, formatOrderNumber } from "@/lib/utils";
import { useStore } from "@/components/providers/store-provider";

interface OrderProjection {
  orderNumber: string;
  email: string;
  total: number;
  status: string;
  createdAt: string;
}

function OrderRow(handle: DocumentHandle) {
  const store = useStore();

  const { data } = useDocumentProjection<OrderProjection>({
    ...handle,
    projection: `{
      orderNumber,
      email,
      total,
      status,
      createdAt
    }`,
  });

  if (!data) return null;

  const status = getOrderStatus(data.status);
  const StatusIcon = status.icon;

  return (
    <Link
      href={`/studio/store/${store.slug}/orders/${handle.documentId}`}
      className="flex items-center justify-between rounded-lg border border-foreground/20 p-3 transition-colors hover:border-foreground/20 hover:bg-background"
    >
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground/60">
          #{formatOrderNumber(data.orderNumber)}
        </p>
        <p className="truncate text-xs font-light text-foreground">
          {data.email}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium text-foreground/60">
          {formatPrice(data.total)}
        </p>
        <Badge className={`${status.color} flex items-center gap-1`}>
          <StatusIcon className="h-3 w-3" />
          {status.label}
        </Badge>
      </div>
    </Link>
  );
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center justify-between rounded-lg border border-foreground/20 bg-foreground/10 p-3">
      <div className="space-y-1">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-3 w-32" />
      </div>
      <div className="flex items-center gap-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-16" />
      </div>
    </div>
  );
}

function RecentOrdersContent() {
  const store = useStore();

  const { data: orders } = useDocuments({
    documentType: "order",
    filter: `
      _type == "order"
      && store._ref == $storeId
    `,
    params: {
      storeId: store._id,
    },
    orderings: [{ field: "_createdAt", direction: "desc" }],
    batchSize: 5,
  });

  if (!orders || orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-background">
          <ShoppingCart className="h-6 w-6 text-foreground/40" />
        </div>
        <p className="text-xs text-foreground/60">
          No orders yet
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-b-xl border border-foreground/20 py-8 space-y-2">
      {orders.slice(0, 5).map((handle) => (
        <Suspense key={handle.documentId} fallback={<OrderRowSkeleton />}>
          <OrderRow {...handle} />
        </Suspense>
      ))}
    </div>
  );
}

function RecentOrdersSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <OrderRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function RecentOrders() {
  const store = useStore();

  return (
    <div>
      <div className="flex items-center justify-between px-6 py-4">
        <h2 className="font-semibold text-foreground/80">
          Recent Orders
        </h2>
        <Link
          href={`/studio/store/${store.slug}/orders`}
          className="text-sm text-foreground/40 hover:text-foreground/80"
        >
          View all →
        </Link>
      </div>

      <div className="p-4">
        <Suspense fallback={<RecentOrdersSkeleton />}>
          <RecentOrdersContent />
        </Suspense>
      </div>
    </div>
  );
}