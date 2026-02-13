"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  useApplyDocumentActions,
  createDocumentHandle,
  createDocument,
  useDocuments,
  DocumentHandle
} from "@sanity/sdk-react";
import { Plus, Package, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/states/empty-state";
import { Table, TableBody } from "@/components/ui/table";
import {
  ProductRow,
  ProductRowSkeleton,
  AdminSearch,
  useProductSearchFilter
} from "@/components/ui/layout/admin";
import { useStore } from "@/components/providers/store-provider";

interface ProductListContentProps {
  storeId: string;
  filter?: string;
  onCreateProduct: () => void;
  isCreating: boolean;
}

function ProductListContent({
  storeId,
  filter,
  onCreateProduct,
  isCreating,
}: ProductListContentProps) {
  const {
    data: products,
    hasMore,
    loadMore,
    isPending,
  } = useDocuments({
    documentType: "product",
    // ✅ STORE-SCOPED FILTER (non-negotiable)
    filter: `
      _type == "product"
      && store._ref == "${storeId}"
      ${filter ? `&& (${filter})` : ""}
    `,
    orderings: [
      { field: "stock", direction: "asc" },
      { field: "name", direction: "asc" },
    ],
    batchSize: 20,
  });

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title={filter ? "No products found" : "No products yet"}
        description={
          filter
            ? "Try adjusting your search terms."
            : "Get started by adding your first product."
        }
        action={
          !filter
            ? {
                label: "Add Product",
                onClick: onCreateProduct,
                disabled: isCreating,
                icon: isCreating ? Loader2 : Plus,
              }
            : undefined
        }
      />
    );
  }

  return (
    <>
      <div className="overflow-hidden">
        <Table>
          {/* <ProductTableHeader /> */}
          <TableBody>
            {products.map((handle) => (
              <ProductRow key={handle.documentId} {...handle} />
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

function ProductListSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-foreground/10">
      <Table>
        {/* <ProductTableHeader /> */}
        <TableBody>
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function InventoryContent() {
  const store = useStore(); // ✅ store context
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();
  const { filter, isSearching } = useProductSearchFilter(searchQuery);
  const apply = useApplyDocumentActions();

  const handleCreateProduct = () => {
    startTransition(async () => {
      const documentId = crypto.randomUUID();
  
      const newDocHandle = createDocumentHandle({
        documentId,
        documentType: "product",
      });
  
      await apply([
        createDocument(newDocHandle, {
          store: {
            _type: "reference" as const,
            _ref: store._id,
          },
        } as any),
      ]);
  
      router.push(
        `/studio/store/${store.slug}/inventory/${documentId}`
      );
    });
  };  

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 sm:text-3xl">
            Inventory
          </h1>
          <p className="mt-1 text-xs text-foreground/60 sm:text-sm">
            Manage your product stock and pricing
          </p>
        </div>

        <Button
          onClick={handleCreateProduct}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          New Product
        </Button>
      </div>

      {/* Search */}
      <AdminSearch
        placeholder="Search products..."
        value={searchQuery}
        onChange={setSearchQuery}
        className="w-full sm:max-w-sm"
      />

      {/* Product List */}
      {isSearching ? (
        <ProductListSkeleton />
      ) : (
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductListContent
            storeId={store._id}
            filter={filter}
            onCreateProduct={handleCreateProduct}
            isCreating={isPending}
          />
        </Suspense>
      )}
    </div>
  );
}

export default function InventoryPage() {
  return <InventoryContent />;
}