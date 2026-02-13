"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, Search, Star, TrendingUp, X } from "lucide-react";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "@/components/ui/views/price-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchProductItemProps {
  product: Product;
  onClose?: () => void;
  onSearchThis?: (name: string) => void;
  variant?: "row" | "compact";
  className?: string;
}

const defaultImageUrl = (p: Product) =>
  p?.images?.[0]?.asset ? urlFor(p.images[0].asset).url() : undefined;

export function SearchProductItem({
  product,
  onClose,
  onSearchThis,
  variant = "row",
  className,
}: SearchProductItemProps) {
  const imageUrl = defaultImageUrl(product);
  const slug = product?.slug?.current;
  const isOutOfStock = (product?.stock ?? 0) <= 0;

  const linkProps = {
    href: slug ? `/products/${slug}` : "#",
    onClick: onClose,
  };

  const statusBadges = (
    <div className="flex flex-wrap items-center gap-1.5">
      {product?.status === "hot" && (
        <Badge variant="secondary" className="gap-1 bg-primary/20 text-primary border-0">
          <TrendingUp className="size-3" /> Hot
        </Badge>
      )}
      {product?.status === "new" && (
        <Badge variant="secondary" className="gap-1 bg-primary/15 text-primary border-0">
          <Clock className="size-3" /> New
        </Badge>
      )}
      {product?.status === "sale" && (
        <Badge variant="secondary" className="gap-1 border-0 bg-green-500/20 text-green-700 dark:text-green-400">
          <Star className="size-3" /> Sale
        </Badge>
      )}
      {product?.isFeatured && (
        <Badge variant="secondary" className="gap-1 border-0 bg-amber-500/20 text-amber-700 dark:text-amber-400">
          <Star className="size-3" /> Featured
        </Badge>
      )}
    </div>
  );

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-muted/50",
          className
        )}
      >
        <Link {...linkProps} className="relative size-16 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={product.name ?? "Product"}
              width={64}
              height={64}
              className={cn("object-cover size-full", isOutOfStock && "opacity-50 grayscale")}
            />
          )}
        </Link>
        <div className="min-w-0 flex-1">
          <Link {...linkProps} className="block">
            <p className="font-medium text-foreground line-clamp-2 hover:text-primary">{product.name}</p>
          </Link>
          <PriceView price={product?.price} rate={product?.discount} className="text-sm" />
          <div className="mt-1">{statusBadges}</div>
          {onSearchThis && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2 gap-1"
              onClick={() => onSearchThis(product?.name ?? "")}
            >
              <Search className="size-3" /> Search this
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border p-4 last:border-b-0 sm:flex-row sm:items-center",
        "hover:bg-muted/30 transition-colors",
        className
      )}
    >
      <Link
        {...linkProps}
        className="relative size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted sm:size-28"
      >
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name ?? "Product"}
            width={112}
            height={112}
            className={cn("object-cover size-full transition-transform hover:scale-105", isOutOfStock && "opacity-50 grayscale")}
          />
        )}
        {isOutOfStock && (
          <span className="absolute inset-0 flex items-center justify-center bg-background/60 text-xs font-semibold text-destructive">
            Out of stock
          </span>
        )}
      </Link>
      <div className="min-w-0 flex-1 space-y-2">
        <Link {...linkProps}>
          <h3 className="font-semibold text-md text-foreground line-clamp-2 hover:text-primary">{product.name}</h3>
        </Link>
        {statusBadges}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full items-center gap-3">
            <PriceView price={product?.price} rate={product?.discount} className="text-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
