"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartActions } from "@/components/providers/cart-store-provider";
import { cn, formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/lib/store/cart-store";
import type { StockInfo } from "@/lib/hooks/use-cart-stock";
import { StockBadge } from "@/components/ui/badges/stock-badge";
import { AddToCartButton } from "@/components/ui/buttons/add-to-cart-button";

interface CartItemProps {
  item: CartItemType;
  stockInfo?: StockInfo;
}

export function CartItem({ item, stockInfo }: CartItemProps) {
  const { removeItem } = useCartActions();

  const isOutOfStock = stockInfo?.isOutOfStock ?? false;
  const exceedsStock = stockInfo?.exceedsStock ?? false;
  const currentStock = stockInfo?.currentStock ?? 999;
  const hasIssue = isOutOfStock || exceedsStock;

  return (
    <div
      className={cn(
        "flex gap-4 py-4",
        hasIssue && "rounded-lg bg-red-600/10 p-3",
      )}
    >
      {/* Image */}
      <div
        className={cn(
          "relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-foreground/10",
          isOutOfStock && "opacity-50",
        )}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            sizes="1000px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-foreground/20">
            No image
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between">
          <Link
            href={`/products/${item.slug?.current}`}
            className={cn(
              "font-semibold text-foreground/80 text-sm",
              isOutOfStock && "text-foreground/40",
            )}
          >
            {item.name}
          </Link>
          <Button
            variant="icon"
            size="icon"
            className="h-8 w-8 text-foreground/60 hover:text-red-500"
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <p className="text-xs font-medium text-foreground/60">
          {formatPrice(item.price)}
        </p>

        {/* Stock Badge & Quantity Controls */}
        <div className="flex justify-between items-center">
          <StockBadge productId={item.productId} stock={currentStock} />
        </div>
      </div>
    </div>
  );
}