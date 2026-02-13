"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { StockBadge } from "@/components/ui/badges/stock-badge";
import { AddToCartButton } from "@/components/ui/buttons/add-to-cart-button";
import { AskAISimilarButton } from "@/components/ui/buttons/ask-ai-similar-button";
import {
  CreditCardIcon,
  EarthIcon,
  ShieldCheckIcon,
  UserIcon,
  PackageIcon,
} from "lucide-react";
import type { PRODUCT_BY_SLUG_QUERYResult } from "@/sanity.types";

/* =====================================================
   Type from Sanity PRODUCT_BY_SLUG_QUERY (fields can be null)
===================================================== */

interface ProductInfoProps {
  product: NonNullable<PRODUCT_BY_SLUG_QUERYResult>;
}

/* =====================================================
   Component
===================================================== */

export function ProductInfo({ product }: ProductInfoProps) {
  const imageUrl = product.images?.[0]?.asset?.url;
  const primaryCategory = product.categories?.[0];

  return (
    <div className="flex flex-col gap-6">
      {/* =====================
         Category
      ===================== */}
      {primaryCategory && (
        <Link
          href={`/?category=${primaryCategory.slug}`}
          className="w-fit text-xs uppercase tracking-wide text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        >
          {primaryCategory.title}
        </Link>
      )}

      {/* =====================
         Title
      ===================== */}
      <h1 className="text-2xl font-bold leading-tight text-zinc-900 dark:text-zinc-100">
        {product.name ?? "Product"}
      </h1>

      {/* =====================
         Price & Stock
      ===================== */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
          {formatPrice(product.price ?? 0)}
        </p>

        <StockBadge productId={product._id} stock={product.stock ?? 0} />
      </div>

      {/* =====================
         Description
      ===================== */}
      {product.description && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-foreground/80">
            Product description
          </h3>
          <p className="text-sm leading-relaxed text-foreground/70 text-justify">
            {product.description}
          </p>
        </div>
      )}

      {/* =====================
         Actions
      ===================== */}
      <div className="flex flex-col gap-3">
        <AddToCartButton
          productId={product._id}
          name={product.name ?? ""}
          price={product.price ?? 0}
          image={imageUrl}
          stock={product.stock ?? 0}
        />

        <AskAISimilarButton productName={product.name ?? ""} />
      </div>

      {/* =====================
         Product Highlights
      ===================== */}
      <div className="grid grid-cols-1 gap-3 rounded-lg border border-foreground/10 p-4 text-sm text-foreground/70 sm:grid-cols-2">
        <p className="flex items-center gap-2">
          <PackageIcon size={16} />
          Carefully packaged & quality checked
        </p>

        <p className="flex items-center gap-2">
          <EarthIcon size={16} />
          Free worldwide shipping
        </p>

        <p className="flex items-center gap-2">
          <CreditCardIcon size={16} />
          Secure payments supported
        </p>

        <p className="flex items-center gap-2">
          <ShieldCheckIcon size={16} />
          Buyer protection guaranteed
        </p>
      </div>

      {/* =====================
         Trust Signal
      ===================== */}
      <div className="flex items-center gap-2 text-xs text-foreground/50">
        <UserIcon size={14} />
        Trusted by verified stores and top brands
      </div>
    </div>
  );
}