"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

import type { FEATURED_PRODUCTS_QUERYResult } from "@/sanity.types";

/* =====================================================
   Types
===================================================== */

type FeaturedProduct = FEATURED_PRODUCTS_QUERYResult[number];

interface Banner {
  _id: string;
  title: string;
  buttonTitle: string;
  buttonHref: string;
  image?: {
    asset?: {
      url?: string;
    };
  };
}

type Slide =
  | { type: "product"; id: string; product: FeaturedProduct }
  | { type: "banner"; id: string; banner: Banner };

interface FeaturedCarouselProps {
  products?: FEATURED_PRODUCTS_QUERYResult;
  banners?: Banner[];
}

/* =====================================================
   Carousel
===================================================== */

export function FeaturedCarousel({
  products = [],
  banners = [],
}: FeaturedCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [current, setCurrent] = useState(0);

  const slides: Slide[] = useMemo(() => {
    if (products.length > 0) {
      return products.map((product) => ({
        type: "product",
        id: product._id,
        product,
      }));
    }

    return banners.map((banner) => ({
      type: "banner",
      id: banner._id,
      banner,
    }));
  }, [products, banners]);

  const hasMultipleSlides = slides.length > 1;

  useEffect(() => {
    if (!api || !hasMultipleSlides) return;

    const update = () => setCurrent(api.selectedScrollSnap());

    update();
    api.on("select", update);
    return () => {
      api.off("select", update);
    };
  }, [api, hasMultipleSlides]);

  const scrollTo = useCallback(
    (index: number) => api?.scrollTo(index),
    [api],
  );

  if (slides.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden bg-linear-to-br from-zinc-900 via-zinc-800 to-zinc-900">
      <Carousel
        setApi={setApi}
        opts={{ loop: hasMultipleSlides }}
        plugins={
          hasMultipleSlides
            ? [
                Autoplay({
                  delay: 5000,
                  stopOnInteraction: false,
                  stopOnMouseEnter: true,
                }),
              ]
            : []
        }
      >
        <CarouselContent className="ml-0">
          {slides.map((slide) => (
            <CarouselItem key={slide.id} className="pl-0">
              {slide.type === "product" ? (
                <FeaturedProductSlide product={slide.product} />
              ) : (
                <BannerSlide banner={slide.banner} />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>

        {hasMultipleSlides && (
          <>
            <CarouselPrevious className="left-4 bg-zinc-800/80 text-white" />
            <CarouselNext className="right-4 bg-zinc-800/80 text-white" />
          </>
        )}
      </Carousel>

      {hasMultipleSlides && (
        <div
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2"
          role="tablist"
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                current === index
                  ? "w-6 bg-white"
                  : "bg-white/40 hover:bg-white/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   Banner Slide
===================================================== */

function BannerSlide({ banner }: { banner: Banner }) {
  const image = banner.image?.asset?.url;

  return (
    <div className="relative flex min-h-[400px] items-center">
      {image && (
        <Image
          src={image}
          alt={banner.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      )}

      <div className="absolute inset-0 bg-zinc-900/70" />

      <div className="relative z-10 max-w-xl px-8">
        <h2 className="text-3xl font-bold text-white">
          {banner.title}
        </h2>

        <Button asChild size="lg" className="mt-6">
          <Link href={banner.buttonHref}>
            {banner.buttonTitle}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

/* =====================================================
   Product Slide
===================================================== */

function FeaturedProductSlide({
  product,
}: {
  product: FeaturedProduct;
}) {
  const image = product.images?.[0]?.asset?.url;

  return (
    <div className="flex min-h-[400px] flex-col md:min-h-[450px] md:flex-row lg:min-h-[500px]">
      {/* Image */}
      <div className="relative h-64 w-full md:h-auto md:w-3/5">
        {image ? (
          <Image
            src={image}
            alt={product.name ?? "Featured product"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-zinc-800 text-zinc-500">
            No image
          </div>
        )}

        <div className="absolute inset-0 hidden bg-linear-to-r from-transparent via-transparent to-zinc-900/90 md:block" />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900/90 via-transparent to-transparent md:hidden" />
      </div>

      {/* Content */}
      <div className="flex w-full flex-col justify-center px-6 py-8 md:w-2/5 md:px-10 lg:px-16">
        {product.category && (
          <Badge className="mb-4 hidden w-fit bg-yellow-300/10 px-4 py-1 text-yellow-300 md:block">
            {product.category.title}
          </Badge>
        )}

        <h2 className="mt-14 text-xl font-bold tracking-tight text-white sm:text-2xl md:mt-2 lg:text-4xl">
          {product.name}
        </h2>

        {product.description && (
          <p className="mt-4 line-clamp-3 text-xs text-zinc-300 sm:text-sm lg:text-base">
            {product.description}
          </p>
        )}

        <p className="mt-6 text-2xl font-light text-white lg:text-3xl">
          {formatPrice(product.price)}
        </p>

        <Button
          asChild
          size="lg"
          className="mt-8 w-fit bg-white text-zinc-900 hover:bg-zinc-100"
        >
          <Link href={`/products/${product.slug}`}>
            Shop Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}