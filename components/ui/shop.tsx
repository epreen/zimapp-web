"use client";

import { Category, Product } from "@/sanity.types";
import { client } from "@/sanity/lib/client";
import { useEffect, useState, useCallback, useRef } from "react";
import { Loader2, Filter, X, CheckCircle2, PackageSearch, PanelLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";
import CategoryList from "./lists/category-list";
import PriceList from "./lists/price-list";
import { ProductCard } from "./cards/product-card";
import { EmptyState } from "./states/empty-state";
import Title from "@/components/ui/title";
import { ProductCardSkeleton } from "./skeletons/product-card-skeleton";
import {
  useShopFilterStore,
  useShopFilters,
  useShopFilterActions,
  useShopFilterUI,
} from "@/lib/store/shop-filter-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Props {
  categories: Category[];
}

const PRODUCTS_PER_PAGE = 20;

const ShopFiltersSidebar = ({
  categories,
  onCloseMobile,
}: {
  categories: Category[];
  onCloseMobile?: () => void;
}) => {
  const filters = useShopFilters();
  const actions = useShopFilterActions();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
      </div>
      <ScrollArea className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-3 space-y-1">
          <CategoryList
            categories={categories}
            selectedCategory={filters.selectedCategory}
            setSelectedCategory={(v) =>
              actions.setSelectedCategory(
                typeof v === "function" ? v(filters.selectedCategory) : v
              )
            }
          />
          <Separator className="my-3" />
          <PriceList
            selectedPrice={filters.selectedPrice}
            setSelectedPrice={(v) =>
              actions.setSelectedPrice(
                typeof v === "function" ? v(filters.selectedPrice) : v
              )
            }
          />
        </div>
      </ScrollArea>
    </div>
  );
};

const Shop = ({ categories }: Props) => {
  const searchParams = useSearchParams();
  const brandParam = searchParams?.get("brand");

  const filters = useShopFilters();
  const actions = useShopFilterActions();
  const ui = useShopFilterUI();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  // Hydrate store from URL on mount
  useEffect(() => {
    useShopFilterStore.getState().hydrateFromSearchParams(brandParam || null);
  }, [brandParam]);

  const fetchProducts = useCallback(
    async (pageNum: number, isLoadMore: boolean = false) => {
      const { selectedCategory, selectedBrand, selectedPrice } =
        useShopFilterStore.getState();

      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      try {
        let minPrice = 0;
        let maxPrice = 10000;
        if (selectedPrice) {
          const [min, max] = selectedPrice.split("-").map(Number);
          minPrice = min;
          maxPrice = max;
        }

        const offset = pageNum * PRODUCTS_PER_PAGE;
        const limit = PRODUCTS_PER_PAGE;

        const query = `
          *[_type == 'product' 
            && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
            && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
            && price >= $minPrice && price <= $maxPrice
          ] 
          | order(name asc) [$offset...$end] {
            ...,"categories": categories[]->title
          }
        `;
        const countQuery = `
          count(*[_type == 'product' 
            && (!defined($selectedCategory) || references(*[_type == "category" && slug.current == $selectedCategory]._id))
            && (!defined($selectedBrand) || references(*[_type == "brand" && slug.current == $selectedBrand]._id))
            && price >= $minPrice && price <= $maxPrice
          ])
        `;

        const [data, count] = await Promise.all([
          client.fetch(
            query,
            {
              selectedCategory,
              selectedBrand,
              minPrice,
              maxPrice,
              offset,
              end: offset + limit,
            },
            { next: { revalidate: 0 } }
          ),
          client.fetch(
            countQuery,
            { selectedCategory, selectedBrand, minPrice, maxPrice },
            { next: { revalidate: 0 } }
          ),
        ]);

        setTotalCount(count);
        if (isLoadMore) {
          setProducts((prev) => [...prev, ...data]);
        } else {
          setProducts(data);
        }
        setHasMore(offset + data.length < count);
      } catch (error) {
        console.error("Shop product fetching error:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [filters.selectedCategory, filters.selectedBrand, filters.selectedPrice]
  );

  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchProducts(0, false);
  }, [filters.selectedCategory, filters.selectedBrand, filters.selectedPrice, fetchProducts]);

  useEffect(() => {
    if (loading || loadingMore || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchProducts(nextPage, true);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [loading, loadingMore, hasMore, page, fetchProducts]);

  return (
    <div className="flex min-h-screen w-full max-w-[1600px] mx-auto">
      {/* Desktop Sidebar - always visible on lg+ */}
      <aside
        className={cn(
          "hidden lg:flex flex-col shrink-0 border-r border-border bg-card/50 transition-all duration-300",
          ui.sidebarCollapsed ? "w-14" : "w-72"
        )}
      >
        <div className="fixed top-38 flex flex-col h-[calc(100vh-10rem)] overflow-hidden border border-l-0 bg-background">
          {ui.sidebarCollapsed ? (
            <div className="flex flex-col items-center py-4 gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={actions.toggleSidebar}
                aria-label="Expand filters"
              >
                <PanelLeft className="size-5" />
              </Button>
              {ui.activeFilterCount > 0 && (
                <Badge variant="secondary" className="size-6 rounded-full p-0 text-xs">
                  {ui.activeFilterCount}
                </Badge>
              )}
            </div>
          ) : (
            <>
              <ShopFiltersSidebar categories={categories} />
              <div className="p-3 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-muted-foreground"
                  onClick={actions.toggleSidebar}
                >
                  Collapse
                  <PanelLeft className="size-4 rotate-180" />
                </Button>
              </div>
            </>
          )}
        </div>
      </aside> 

      {/* Main content */}
      <div className="flex-1 min-w-0 p-4 lg:p-6">
        {/* Header */}
        <div className="fixed top-36 z-10 bg-background/90 backdrop-blur w-full pr-4 supports-backdrop-filter:bg-background/90 pb-2 h-20"/>
        <div className="mb-6 sticky top-39 z-40 bg-background w-full pr-4 pb-2 h-fit rounded-tr-lg">
          <div>
            <div className="grid gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <Title className="text-2xl lg:text-3xl font-bold tracking-tight">
                    Shop Products
                  </Title>
                  <p className="text-muted-foreground text-sm mt-1">
                    Discover amazing products tailored to your needs
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {ui.hasActiveFilters && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={actions.clearFilters}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      Clear filters
                    </Button>
                  )}
                  {/* Mobile filter trigger */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="lg:hidden"
                    onClick={actions.toggleMobileFilters}
                  >
                    <Filter className="size-4 mr-2" />
                    Filters
                    {ui.activeFilterCount > 0 && (
                      <Badge variant="secondary" className="ml-2 size-5 rounded-full p-0 text-xs">
                        {ui.activeFilterCount}
                      </Badge>
                    )}
                  </Button>
                </div>
              </div>

              {/* Active filters chips */}
              {ui.hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {filters.selectedCategory && (
                    <Badge variant="secondary" className="font-normal">
                      Category: {categories?.find((c) => c?.slug?.current === filters.selectedCategory)?.title}
                    </Badge>
                  )}
                  {filters.selectedPrice && (
                    <Badge variant="secondary" className="font-normal">
                      Price: MWK {filters.selectedPrice.replace("-", " – MWK ")}
                    </Badge>
                  )}
                </div>
              )}
              <div className="flex items-center justify-between mb-2 text-sm text-muted-foreground pb-0">
                <span className="font-medium text-foreground">{totalCount} products</span>
                <span>Showing {products.length} of {totalCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Products grid */}
        <div>
          {loading ? (
            <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className="grid grid-cols-2 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                {products.map((product) => (
                  <ProductCard key={product?._id} product={product} />
                ))}
              </div>

              {hasMore && (
                <div
                  ref={loadMoreRef}
                  className="flex justify-center items-center py-12"
                >
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="size-8 text-primary animate-spin" />
                    <p className="text-sm text-muted-foreground">Loading more…</p>
                  </div>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="flex justify-center items-center py-12 border-t border-border mt-8">
                  <div className="flex flex-col items-center gap-3">
                    <div className="rounded-full bg-primary/10 p-3">
                      <CheckCircle2 className="size-8 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium">You&apos;ve seen all products</p>
                      <p className="text-sm text-muted-foreground">
                        {products.length} {products.length === 1 ? "product" : "products"} displayed
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-16">
              <EmptyState
                icon={PackageSearch}
                title="No products found"
                description="Try adjusting your filters to find what you're looking for"
                size="lg"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile filters sheet */}
      <Sheet open={ui.mobileFiltersOpen} onOpenChange={(o) => !o && actions.closeMobileFilters()}>
        <SheetContent side="left" className="w-[min(320px,100vw)] p-0">
          <SheetHeader className="sr-only">
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <ShopFiltersSidebar
            categories={categories}
            onCloseMobile={actions.closeMobileFilters}
          />
          <div className="p-4 border-t border-border">
            <Button
              className="w-full"
              onClick={actions.closeMobileFilters}
            >
              Apply filters
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Shop;
