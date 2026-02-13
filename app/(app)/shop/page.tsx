import Shop from "@/components/ui/shop";
import { getCategories } from "@/sanity/queries/categories";
import { Suspense } from "react";

const ShopPage = async () => {
  const categories = await getCategories();
  
  return (
    <div className="min-h-screen">
      <Suspense
        fallback={
          <div className="min-h-96 animate-pulse rounded-lg" />
        }
      >
        <Shop categories={categories} />
      </Suspense>
    </div>
  );
};

export default ShopPage;
