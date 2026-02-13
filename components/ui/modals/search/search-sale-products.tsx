"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Product } from "@/sanity.types";
import { urlFor } from "@/sanity/lib/image";
import PriceView from "@/components/ui/views/price-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SearchProductItem } from "./search-product-item";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface SearchSaleProductsProps {
  products: Product[];
  onClose?: () => void;
  onSearchThis?: (name: string) => void;
  className?: string;
}

export function SearchSaleProducts({
  products,
  onClose,
  onSearchThis,
  className,
}: SearchSaleProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2">
        <Separator className="flex-1" />
        <div className="flex items-center gap-2 rounded-full border border-border bg-primary/10 px-3 py-1.5">
          <Star className="size-4 text-primary" />
          <span className="text-xs font-semibold uppercase tracking-wide text-foreground">
            On sale
          </span>
        </div>
        <Separator className="flex-1" />
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="text-muted-foreground font-medium">Image</TableHead>
              <TableHead className="text-muted-foreground font-medium">Product</TableHead>
              <TableHead className="text-muted-foreground font-medium">Price</TableHead>
              <TableHead className="text-muted-foreground font-medium">Status</TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const imageUrl = product.images?.[0]?.asset
                ? urlFor(product.images[0].asset).url()
                : undefined;
              return (
                <TableRow
                  key={product._id}
                  className="border-border hover:bg-muted/30"
                >
                  <TableCell className="py-3">
                    <Link
                      href={product.slug?.current ? `/products/${product.slug.current}` : "#"}
                      onClick={onClose}
                      className="block"
                    >
                      <div className="relative size-14 overflow-hidden rounded-md border border-border bg-muted">
                        {imageUrl && (
                          <Image
                            src={imageUrl}
                            alt={product.name ?? "Product"}
                            width={56}
                            height={56}
                            className="object-cover size-full"
                          />
                        )}
                      </div>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={product.slug?.current ? `/products/${product.slug.current}` : "#"}
                      onClick={onClose}
                      className="font-medium text-foreground hover:text-primary line-clamp-2"
                    >
                      {product.name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    <PriceView price={product?.price} rate={product?.discount} className="text-sm font-semibold" />
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="border-0 bg-green-500/20 text-green-700 dark:text-green-400">
                      Sale
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="default"
                      size="sm"
                      className="gap-1"
                      onClick={() => onSearchThis?.(product?.name ?? "")}
                    >
                      <Star className="size-3.5" /> Search
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-3">
        {products.map((product) => (
          <SearchProductItem
            key={product._id}
            product={product}
            variant="compact"
            onClose={onClose}
            onSearchThis={onSearchThis}
          />
        ))}
      </div>

      <p className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Showing <span className="font-semibold text-foreground">{products.length}</span> products on sale
      </p>
    </div>
  );
}
