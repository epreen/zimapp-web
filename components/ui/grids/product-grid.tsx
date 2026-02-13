import { PackageSearch } from "lucide-react";
import type { Product } from "@/sanity.types";
import { EmptyState } from "@/components/ui/states/empty-state";
import { ProductCard } from "@/components/ui/cards/product-card";
import { AnimatePresence, motion } from "framer-motion";

/* =====================================================
   Props
===================================================== */

interface ProductGridProps {
  products: Product[];
  productsPerPage: number;
}

/* =====================================================
   Component
===================================================== */

const ProductGrid = ({ products, productsPerPage }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="min-h-[400px] rounded-2xl border-2 border-dashed border-foreground/10 bg-primary/2">
        <EmptyState
          icon={PackageSearch}
          title="No products found"
          description="Try adjusting your search or filters to find what you're looking for"
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {products?.slice(0, productsPerPage).map((product, index) => (
            <motion.div
              key={product._id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                layout: { duration: 0.3 }
              }}
              className="group"
            >
              <ProductCard
                product={product}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductGrid;