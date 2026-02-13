"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Product } from "@/sanity.types";
import { ProductCard } from "@/components/ui/cards/product-card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ProductCarouselProps {
  variantTitle: string | null;
  variantSlug: string;
  variantProducts: Product[];
}

const ProductCarousel = ({
  variantTitle,
  variantSlug,
  variantProducts,
}: ProductCarouselProps) => {
  if (!variantProducts?.length) return null;

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex items-end justify-between border-b border-foreground/10 pb-3 sm:mb-6 sm:pb-4">
        <div>
          <h2 className="text-lg font-bold capitalize sm:text-xl lg:text-2xl">
            {variantTitle}
          </h2>
          <p className="text-xs text-foreground/60 sm:text-sm">
            {variantProducts.length}{" "}
            {variantProducts.length === 1 ? "Product" : "Products"}
          </p>
        </div>

        <Link
          href={`/products/${variantSlug}`}
          className="group flex items-center gap-1.5 text-xs font-medium text-primary/60 sm:gap-2 sm:text-sm"
        >
          View more
          <ArrowRight
            size={14}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>

      {/* Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: variantProducts.length > 5,
          dragFree: true, // smoother mobile feel
        }}
        className="relative"
      >
        <CarouselContent>
          {variantProducts.map((product) => (
            <CarouselItem
              key={product._id}
              className="
                xs:basis-4/5          /* edge peeking */
                sm:basis-1/2          /* ≥ 640px */
                md:basis-1/3          /* ≥ 768px */
                lg:basis-1/4          /* ≥ 1024px */
                xl:basis-1/5          /* ≥ 1280px */
              "
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Desktop controls only */}
        <CarouselPrevious className="left-2 hidden lg:flex" />
        <CarouselNext className="right-2 hidden lg:flex" />
      </Carousel>
    </div>
  );
};

export default ProductCarousel;