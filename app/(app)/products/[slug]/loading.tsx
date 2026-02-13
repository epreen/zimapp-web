import { Separator } from "@/components/ui/separator";
import { ProductGallerySkeleton } from "@/components/ui/skeletons/product-gallery-skeleton";
import { ProductInfoSkeleton } from "@/components/ui/skeletons/product-info-skeleton";
import { ProductStoreInfoSkeleton } from "@/components/ui/skeletons/product-store-info-skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 xl:grid-cols-2">
          {/* Image Gallery */}
          <ProductGallerySkeleton />

          {/* Product Info */}
          <ProductInfoSkeleton />
        </div>
        <Separator className="mt-6" />
        <ProductStoreInfoSkeleton />
      </div>
    </div>
  );
}
