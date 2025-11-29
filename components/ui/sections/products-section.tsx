"use client";

import { useMemo, useState } from "react";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { StaticImageData } from "next/image";
import SectionHeading from "@/components/ui/headings/section-heading";
import { Button } from "@/components/ui/button";
import FilterModal from "@/components/ui/modals/filter-modal";
import ProductCard from "../cards/product-card";

/* -----------------------------
   Types
----------------------------- */
interface RatingItem {
  rating: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  images: (string | StaticImageData)[];
  rating?: RatingItem[];
  createdAt: number;
  category?: string;
}

interface ProductsListProps {
    products: Preloaded<typeof api.products.retrieve>;
}

/* -----------------------------
   useSortedProducts Hook
----------------------------- */
export function useSortedProducts({ products }: ProductsListProps) {
    const productArray = unwrapPreloaded(products);
  
    return useMemo(() => {
      return [...productArray].sort((a, b) => b.createdAt - a.createdAt);
    }, [productArray]);
}  

// Only unwrap Preloaded queries
function unwrapPreloaded(
    preloaded: Preloaded<typeof api.products.retrieve>
  ): Product[] {
    const result = usePreloadedQuery(preloaded).page ?? [];
    return result.map((p) => ({
      id: p._id,
      name: p.optimizedDescription ?? "Unnamed Product",
      price: p.price ?? 0,
      images: p.images ?? [],
      rating: p.rating?.map((r) => ({ rating: r })),
      createdAt: p._creationTime,
      category: p.aiCategory ?? "uncategorized",
    }));
}  


/* -----------------------------
   ProductsGrid Component
----------------------------- */
export function ProductsGrid({ items }: { items: Product[] | Preloaded<typeof api.products.retrieve> }) {
    const productArray = Array.isArray(items) ? items : unwrapPreloaded(items);
  
    return (
      <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-center">
        {productArray.map((p) => (
            <ProductCard key={p.id} product={p} />
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
      <section className="px-6 max-w-6xl mx-auto">
        <ProductsHeading
          title="Latest Products"
          description={`Showing ${sorted.length} of ${unwrapPreloaded(products).length} products`}
          showFilter={false}
        />
        <ProductsGrid items={sorted} />
      </section>
    );
}
  
  export function BestSelling({ products }: ProductsListProps) {
    const sortedBest = useMemo(() => {
      return [...unwrapPreloaded(products)]
        .sort((a, b) => (b.rating?.length ?? 0) - (a.rating?.length ?? 0))
        .slice(0, 8);
    }, [products]);
  
    return (
      <section className="px-6 my-30 max-w-6xl mx-auto">
        <ProductsHeading
          title="Best Selling"
          description={`Showing ${sortedBest.length} of ${unwrapPreloaded(products).length} products`}
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
    ? unwrapPreloaded(products)
    : unwrapPreloaded(products).filter(
        (p: Product) => p.category?.toLowerCase() === category.toLowerCase()
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