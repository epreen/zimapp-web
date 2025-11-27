"use client";

import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import ProductCard from "@/components/ui/cards/product-card";
import SectionHeading from "@/components/ui/headings/section-heading";
import { Button } from "@/components/ui/button";
import FilterModal from "@/components/ui/modals/filter-modal";
import { dummyProductsData as staticProducts } from "@/data/dummy/products";

/* ---------------------------------------------------------
   Shared Hook — Sorting logic reused across all sections
--------------------------------------------------------- */
export function useSortedProducts(products: any[]) {
    return useMemo(() => {
        return [...products].sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
        );
    }, [products]);
}

/* ---------------------------------------------------------
   Shared Grid Component
--------------------------------------------------------- */
export function ProductsGrid({ items }: { items: any[] }) {
    return (
        <div className="mt-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-center">
            {items.map((p) => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

/* ---------------------------------------------------------
   Shared Heading Wrapper
--------------------------------------------------------- */
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

/* ---------------------------------------------------------
   LatestProducts (Redux-powered)
--------------------------------------------------------- */
export function LatestProducts() {
    const displayQuantity = 4;
    const products = useSelector((state: any) => state.product.list);
    const sorted = useSortedProducts(products).slice(0, displayQuantity);

    return (
        <section className="px-6 max-w-6xl mx-auto">
            <ProductsHeading
                title="Latest Products"
                description={`Showing ${sorted.length} of ${products.length} products`}
                showFilter={false}
            />
            <ProductsGrid items={sorted} />
        </section>
    );
}

/* ---------------------------------------------------------
   ⭐ BestSelling (Redux-powered)
--------------------------------------------------------- */
export function BestSelling() {
    const displayQuantity = 8;
    const products = useSelector((state: any) => state.product.list);

    // Sort by number of ratings
    const sortedBest = useMemo(() => {
        return [...products]
            .sort((a, b) => b.rating.length - a.rating.length)
            .slice(0, displayQuantity);
    }, [products]);

    return (
        <section className="px-6 my-30 max-w-6xl mx-auto">
            <ProductsHeading
                title="Best Selling"
                description={`Showing ${
                    sortedBest.length
                } of ${products.length} products`}
            />

            <div className="mt-12 xl:gap-12 grid grid-cols-2 sm:flex flex-wrap gap-6 justify-center">
                {sortedBest.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </section>
    );
}

/* ---------------------------------------------------------
   ProductsSection (Category-based dynamic view)
--------------------------------------------------------- */
export function ProductsSection({
                                    category,
                                    heading = true,
                                }: {
    category: string;
    heading?: boolean;
}) {
    const [filterOpen, setFilterOpen] = useState(false);

    const filteredProducts =
        category.toLowerCase() === "all"
            ? staticProducts
            : staticProducts.filter(
                (p) =>
                    p.category.toLowerCase() ===
                    category.toLowerCase()
            );

    return (
        <>
            {heading && (
                <ProductsHeading
                    title={
                        category.charAt(0).toUpperCase() +
                        category.slice(1)
                    }
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
                            <Button
                                key={color}
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                            >
                                {color}
                            </Button>
                        ))}
                    </div>
                </div>
            </FilterModal>
        </>
    );
}

/* ---------------------------------------------------------
   Default export — category section
--------------------------------------------------------- */
export default ProductsSection;