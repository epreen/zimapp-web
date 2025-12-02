"use client";

import { useMemo, useState } from "react";
import type { Preloaded } from "convex/react";
import { usePreloadedQuery } from "convex/react";
import type { api } from "@/convex/_generated/api";
import SectionHeading from "@/components/ui/headings/section-heading";
import { Button } from "@/components/ui/button";
import FilterModal from "@/components/ui/modals/filter-modal";
import ProductCard from "@/components/ui/cards/product-card";

/* -----------------------------
   Types
----------------------------- */

type ProductItem = ReturnType<typeof usePreloaded>[number];

interface ProductsListProps {
    products: Preloaded<typeof api.products.retrieve>;
}

/* -----------------------------
   useSortedProducts Hook
----------------------------- */
export function useSortedProducts({ products }: ProductsListProps) {
    const result = usePreloaded(products);
  
    return useMemo(() => {
      return result
        .slice()
        .sort((a, b) => b.createdAt - a.createdAt);
    }, [result]);
}

// Only unwrap Preloaded queries
function usePreloaded(
    preloaded: Preloaded<typeof api.products.retrieve>
  ) {
    return usePreloadedQuery(preloaded).page ?? [];
}  


/* -----------------------------
   ProductsGrid Component
----------------------------- */
export function ProductsGrid({ items }: { items: ProductItem[] }) {
    return (
      <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-center">
        {items.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    );
}  

/* -----------------------------
   ProductsHeading Component
----------------------------- */
export function ProductsHeading({
  title,
  description,
  showDisplay = false,
  onFilter,
  showFilter = false,
}: {
  title: string;
  description?: string;
  onFilter?: () => void;
  showDisplay?: boolean;
  showFilter?: boolean;
}) {
  return (
    <SectionHeading
      title={title}
      description={description}
      onDisplay={showDisplay}
      onOpenFilter={showFilter ? onFilter : undefined}
    />
  );
}

/* -----------------------------
   LatestProducts Component
----------------------------- */
export function LatestProducts({ products }: ProductsListProps) {
    const sorted = useSortedProducts({ products }).slice(0, 4);
  
    return (
      <section className="px-6 mt-10 max-w-6xl mx-auto">
        <ProductsHeading
          title="Latest Products"
          description={`Showing ${sorted.length} of ${usePreloaded(products).length} products`}
          showFilter={false}
        />
        <ProductsGrid items={sorted} />
      </section>
    );
}
  
  export function BestSelling({ products }: ProductsListProps) {
    const sortedBest = useMemo(() => {
      return [...usePreloaded(products)]
        .sort((a, b) => (b.rating?.length ?? 0) - (a.rating?.length ?? 0))
        .slice(0, 8);
    }, [products]);
  
    return (
      <section className="px-6 my-30 max-w-6xl mx-auto">
        <ProductsHeading
          title="Best Selling"
          description={`Showing ${sortedBest.length} of ${usePreloaded(products).length} products`}
        />
        <ProductsGrid items={sortedBest} />
      </section>
    );
}  

/* -----------------------------
   ProductsSection Component
----------------------------- */
export function ProductsSection({
  products,
  category,
  heading = true,
}: ProductsListProps & { category: string; heading?: boolean }) {
  const [filterOpen, setFilterOpen] = useState(false);

  const filteredProducts =
  category.toLowerCase() === "all"
    ? usePreloaded(products)
    : usePreloaded(products).filter(
        (p) => p.aiCategory?.toLowerCase() === category.toLowerCase()
      );

  return (
    <>
      {heading && (
        <ProductsHeading
          title={category.charAt(0).toUpperCase() + category.slice(1)}
          onFilter={() => setFilterOpen(true)}
          showDisplay={true}
          showFilter
        />
      )}

      <section className="py-10">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          {filteredProducts.length > 0 ? (
            <>
              <ProductsGrid items={filteredProducts} />
              <div className="w-full text-center mt-6">
                <Button
                  variant="outline"
                  className="text-gray-700 dark:text-gray-300"
                >
                  Show more
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-600 dark:text-gray-300 py-10">
              No products found in this category.
            </div>
          )}
        </div>
      </section>

      <FilterModal
        open={filterOpen}
        onOpenChange={setFilterOpen}
        title="Filter Products"
      >
        {/* Filter: Condition */}
        <div className="space-y-4">
          <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Condition
          </h6>
          <div className="flex gap-3">
            <label className="flex items-center space-x-2">
              <input type="radio" name="condition" value="all" defaultChecked />
              <span>All</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="radio" name="condition" value="new" />
              <span>New</span>
            </label>
          </div>
        </div>

        {/* Filter: Color */}
        <div className="space-y-4">
          <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Color
          </h6>
          <div className="flex flex-wrap gap-2">
            {["Red", "Blue", "Green", "Gray"].map((color) => (
              <Button key={color} variant="outline" size="sm" className="rounded-full">
                {color}
              </Button>
            ))}
          </div>
        </div>
      </FilterModal>
    </>
  );
}

export default ProductsSection;