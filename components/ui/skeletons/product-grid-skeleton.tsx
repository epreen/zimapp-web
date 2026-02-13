import { AnimatePresence, motion } from "framer-motion";
import { ProductCardSkeleton } from "./product-card-skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="@container">
      <div className="grid grid-cols-1 gap-6 @sm:grid-cols-2 @2xl:grid-cols-3 @4xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {Array.from({ length: 12 }).map((_, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  duration: 0.3,
                  delay: i * 0.05,
                  layout: { duration: 0.3 }
                }}
                className="group"
              >
                <ProductCardSkeleton />
              </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};