"use client";

import Image from "next/image";
import Link from "next/link";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice } from "@/lib/utils";

import { AddToCartButton } from "../buttons/add-to-cart-button";
import { StockBadge } from "../badges/stock-badge";
import { Skeleton } from "@/components/ui/skeleton"; // import shadcn Skeleton
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";

/* =====================================================
   Types (Aligned with FILTERED_PRODUCT_PROJECTION)
===================================================== */

interface ProductCardProps {
  product: Product;
  className?: string;
}

/* =====================================================
   Component
===================================================== */

export function ProductCard({ product, className }: ProductCardProps) {
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;

  const imageUrl = product.images?.[0]?.asset
    ? urlFor(product.images[0].asset).url()
    : undefined;

  const hasSlug = Boolean(product.slug?.current);

  const price = product.price || 0;
  const rate = product.discount;

  const discount = rate && price ? (rate * price) / 100 : 0;

  const currentPrice = price - discount;

  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-none bg-background shadow-none",
        className,
      )}
    >
      {/* =====================
         Image
      ===================== */}
      {hasSlug ? (
        <Link href={`/products/${product.slug!.current}`} className="block">
          <div className="relative aspect-square overflow-hidden bg-linear-to-br from-background to-white dark:from-black dark:to-background">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={"Product"}
                fill
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              />
            ) : (
              <Skeleton className="h-full w-full" />
            )}

            {/* Soft contrast overlay */}
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Stock / Status */}
            <div className="absolute right-3 top-3">
              {isOutOfStock ? (
                <Badge
                  variant="destructive"
                  className="rounded-full bg-black/50 px-3 py-1 text-xs text-white"
                >
                  Out of stock
                </Badge>
              ) : (
                <StockBadge productId={product._id} stock={stock} />
              )}
            </div>

            {/* Category */}
            {product.categories?.length ? (
              <span className="absolute left-3 top-3 rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-black/80 backdrop-blur">
                {product.categories[0]._ref}
              </span>
            ) : null}
          </div>
        </Link>
      ) : (
        <div className="relative aspect-square overflow-hidden">
          <Skeleton className="h-full w-full" />
        </div>
      )}

      {/* =====================
         Content
      ===================== */}
      <CardContent className="flex items-start justify-between gap-3 px-0 pt-3 text-sm">
        {hasSlug ? (
          <Link href={`/products/${product.slug!.current}`} className="min-w-0 flex-1">
            <p className="truncate font-medium text-foreground">
              {product.name}
            </p>
          </Link>
        ) : (
          <Skeleton className="h-4 w-3/4" />
        )}

        <p className="shrink-0 font-semibold text-foreground">
          {formatPrice(currentPrice)}
        </p>
      </CardContent>

      {/* =====================
         Actions
      ===================== */}
      <CardFooter className="px-0 pt-2">
        {currentPrice != null ? (
          <AddToCartButton
            productId={product._id}
            name={product.name ?? "Unnamed product"}
            price={currentPrice}
            image={imageUrl}
            slug={product?.slug}
            stock={stock}
          />
        ) : (
          <span className="text-sm font-medium text-secondary">
            Negotiable
          </span>
        )}
      </CardFooter>
    </Card>
  );
}