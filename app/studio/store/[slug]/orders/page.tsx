"use client";

import { Suspense, useState } from "react";
import { useDocuments } from "@sanity/sdk-react";
import { ShoppingCart } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states/empty-state";
import {
  OrderRow,
  OrderRowSkeleton,
  AdminSearch,
  useOrderSearchFilter,
} from "@/components/ui/layout/admin";
import { ORDER_STATUS_TABS } from "@/lib/constants/order-status";
import { useStore } from "@/components/providers/store-provider";

interface OrderListContentProps {
  storeId: string;
  statusFilter: string;
  searchFilter?: string;
}

function OrderListContent({
  storeId,
  statusFilter,
  searchFilter,
}: OrderListContentProps) {
  const filters: string[] = [
    `store._ref == "${storeId}"`, // 🔒 STORE SCOPE
  ];

  if (statusFilter !== "all") {
    filters.push(`status == "${statusFilter}"`);
  }

  if (searchFilter) {
    filters.push(`(${searchFilter})`);
  }

  const filter = filters.join(" && ");

  const {
    data: orders,
    hasMore,
    loadMore,
    isPending,
  } = useDocuments({
    documentType: "order",
    filter,
    orderings: [{ field: "createdAt", direction: "desc" }],
    batchSize: 20,
  });

  if (!orders || orders.length === 0) {
    const description = searchFilter
      ? "Try adjusting your search terms."
      : statusFilter === "all"
        ? "Orders will appear here when customers place orders."
        : `No ${statusFilter} orders at the moment.`;

    return (
      <EmptyState
        icon={ShoppingCart}
        title="No orders found"
        description={description}
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        <Table>
          <TableBody>
            {orders.map((handle) => (
              <OrderRow key={handle.documentId} {...handle} />
            ))}
          </TableBody>
        </Table>
      </div>

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button
            variant="outline"
            onClick={() => loadMore()}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}

function OrderListSkeleton() {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <OrderRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export default function OrdersPage() {
  const store = useStore(); // ✅ current store context
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { filter: searchFilter, isSearching } =
    useOrderSearchFilter(searchQuery);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground/80 dark:text-zinc-100 sm:text-3xl">
          Orders
        </h1>
        <p className="mt-1 text-xs text-foreground/60 dark:text-zinc-400 sm:text-sm">
          Manage and track orders for this store
        </p>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col gap-4">
        <AdminSearch
          placeholder="Search by order # or email..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:max-w-xs"
        />

        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="w-max">
              {ORDER_STATUS_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="text-xs sm:text-sm"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Orders List */}
      {isSearching ? (
        <OrderListSkeleton />
      ) : (
        <Suspense
          key={`${store._id}-${statusFilter}-${searchFilter ?? ""}`}
          fallback={<OrderListSkeleton />}
        >
          <OrderListContent
            storeId={store._id}
            statusFilter={statusFilter}
            searchFilter={searchFilter}
          />
        </Suspense>
      )}
    </div>
  );
}