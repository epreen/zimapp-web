import Link from "next/link";
import Image from "next/image";
import { Package } from "lucide-react";
import type { SearchProduct } from "@/lib/ai/types";

interface ProductCardWidgetProps {
  product: SearchProduct;
  onClose: () => void;
}

export function ProductCardWidget({
  product,
  onClose,
}: ProductCardWidgetProps) {
  const isOutOfStock = product.stockStatus === "out_of_stock";
  const isLowStock = product.stockStatus === "low_stock";

  const handleClick = () => {
    // Only close chat on mobile (< 768px)
    if (window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  const cardContent = (
    <>
      {product.imageUrl ? (
        <Image
          src={product.imageUrl}
          alt={product.name ?? "Product"}
          width={48}
          height={48}
          className="h-12 w-12 shrink-0 rounded-lg object-cover transition-transform duration-200 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-foreground/10 transition-colors duration-200 group-hover:bg-foreground/20">
          <Package className="h-5 w-5 text-foreground/40" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-amber-600">
              {product.name}
            </span>
            {product.category && (
              <span className="text-xs text-foreground/40">
                {product.category}
              </span>
            )}
          </div>
          {product.priceFormatted && (
            <span className="shrink-0 text-sm font-semibold text-foreground">
              {product.priceFormatted}
            </span>
          )}
        </div>
        {(isOutOfStock || isLowStock) && (
          <span
            className={`mt-1 inline-block text-xs font-medium ${
              isOutOfStock
                ? "text-red-600"
                : "text-amber-600"
            }`}
          >
            {isOutOfStock ? "Out of stock" : "Low stock"}
          </span>
        )}
      </div>
    </>
  );

  const cardClasses =
    "group flex items-center gap-3 rounded-lg border border-foreground/20 bg-background p-3 transition-all duration-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-600/40";

  if (product.productUrl) {
    return (
      <Link
        href={product.productUrl}
        onClick={handleClick}
        className={cardClasses}
      >
        {cardContent}
      </Link>
    );
  }

  return <div className={cardClasses}>{cardContent}</div>;
}
