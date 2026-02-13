"use client";

import { Loader2, Search, X } from "lucide-react";
import { Product } from "@/sanity.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { SearchProductItem } from "./search-product-item";
import { SearchSaleProducts } from "./search-sale-products";
import { cn } from "@/lib/utils";

interface SearchModalResultsProps {
  query: string;
  products: Product[];
  loading: boolean;
  saleProducts: Product[];
  onClose?: () => void;
  onClearSearch?: () => void;
  onSearchThis?: (name: string) => void;
  className?: string;
}

const MIN_CHARS = 2;

export function SearchModalResults({
  query,
  products,
  loading,
  saleProducts,
  onClose,
  onClearSearch,
  onSearchThis,
  className,
}: SearchModalResultsProps) {
  const trimmed = query.trim();
  const hasMinChars = trimmed.length >= MIN_CHARS;
  const showSaleOnly = !hasMinChars;
  const showMinCharsHint = trimmed.length > 0 && trimmed.length < MIN_CHARS;
  const hasResults = products.length > 0;
  const noResults = hasMinChars && !loading && !hasResults;

  return (
    <ScrollArea
      className={cn("flex-1 max-h-[min(65vh,28rem)]", className)}
      data-slot="scroll-area"
    >
      <div className="p-2 sm:p-4">
        {loading && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Loader2 className="size-10 animate-spin mb-4 text-primary" />
            <p className="text-sm font-medium text-foreground">Searching…</p>
            <p className="text-xs text-muted-foreground mt-1">Finding the best matches</p>
          </div>
        )}

        {!loading && showMinCharsHint && (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-16 rounded-xl",
              "bg-muted/50 border border-border"
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
              <Search className="size-6" />
            </div>
            <p className="text-base font-medium text-foreground mb-1">Keep typing</p>
            <p className="text-sm text-muted-foreground text-center max-w-xs">
              Enter at least <span className="font-semibold text-primary">{MIN_CHARS} characters</span> to search
            </p>
          </div>
        )}

        {!loading && hasMinChars && hasResults && (
          <>
            <div
              className={cn(
                "flex items-center justify-between gap-2 py-3 px-2",
                "border-b border-border bg-muted/30 rounded-t-lg"
              )}
            >
              <div className="flex items-center gap-2">
                <Search className="size-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">Results</span>
              </div>
              <span className="text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded-md border border-border">
                <span className="font-semibold text-primary">{products.length}</span>{" "}
                {products.length === 1 ? "product" : "products"}
              </span>
            </div>
            <div className="divide-y-0">
              {products.map((product) => (
                <SearchProductItem
                  key={product._id}
                  product={product}
                  onClose={onClose}
                />
              ))}
            </div>
          </>
        )}

        {!loading && noResults && (
          <div
            className={cn(
              "flex flex-col items-center justify-center py-12 rounded-xl text-center",
              "bg-muted/50 border border-border"
            )}
          >
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
              <X className="size-6" />
            </div>
            <p className="text-base font-semibold text-foreground mb-1">No results</p>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              No products matching &quot;{query}&quot;
            </p>
            <Button variant="outline" size="sm" onClick={onClearSearch}>
              Clear search
            </Button>
          </div>
        )}

        {!loading && showSaleOnly && saleProducts.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col items-center gap-2 py-6 text-center">
              <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Search className="size-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Discover products</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Search by name or browse products on sale below
              </p>
            </div>
            <SearchSaleProducts
              products={saleProducts}
              onClose={onClose}
              onSearchThis={onSearchThis}
            />
          </div>
        )}

        {!loading && showSaleOnly && saleProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <Search className="size-10 mb-4 opacity-50" />
            <p className="text-sm font-medium text-foreground">Start typing to search</p>
            <p className="text-xs mt-1">No sale products to show right now</p>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
