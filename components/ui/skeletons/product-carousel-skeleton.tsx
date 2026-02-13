"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCardSkeleton } from "./product-card-skeleton";

interface ProductCarouselSkeletonProps {
  title?: string;
  count?: number;
}

const ProductCarouselSkeleton = ({
  title = "Loading Products...",
  count = 0,
}: ProductCarouselSkeletonProps) => {
  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-end justify-between border-b border-foreground/10 pb-3 sm:mb-6 sm:pb-4">
        <div>
          <h2 className="text-lg font-bold capitalize sm:text-xl lg:text-2xl">
            {title}
          </h2>
          <p className="text-xs text-foreground/60 sm:text-sm">
            {count}{" "}
            {count === 1 ? "Product loaded" : "Products loaded"}
          </p>
        </div>
      </div>

      {/* Carousel skeleton */}
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="relative"
      >
        <CarouselContent>
          {Array.from({ length: count = 5 }).map((_, index) => (
            <CarouselItem
              key={index}
              className="
                xs:basis-4/5
                sm:basis-1/2
                md:basis-1/3
                lg:basis-1/4
                xl:basis-1/5
              "
            >
              <ProductCardSkeleton />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default ProductCarouselSkeleton;