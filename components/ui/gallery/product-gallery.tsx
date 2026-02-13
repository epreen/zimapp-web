"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Type definition for product images based on PRODUCT_BY_SLUG_QUERY (url can be null from Sanity)
type ProductImage = {
  _key?: string;
  _id?: string;
  asset?: { _id: string; url: string | null } | null;
  hotspot?: unknown;
};

type ProductImages = ProductImage[] | null;

interface ProductGalleryProps {
  images: ProductImages;
  productName: string | null;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
        <span className="text-zinc-400">No images available</span>
      </div>
    );
  }

  const selectedImage = images[selectedIndex];

  return (
    <div className="flex max-lg:flex-col gap-12">
      <div className="flex max-sm:flex-col-reverse gap-3">

        {/* Thumbnail Grid */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-3">
            {images.map((image, index) => (
              <button
                key={image._key ?? image._id ?? index}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-pressed={selectedIndex === index}
                className={cn(
                  "bg-foreground/10 flex items-center justify-center size-26 rounded-lg group overflow-hidden cursor-pointer",
                  selectedIndex === index
                    ? "ring-2 ring-foreground/40"
                    : "hover:opacity-75",
                )}
              >
                {image.asset?.url ? (
                  <Image
                    src={image.asset.url}
                    alt={`${productName} thumbnail ${index + 1}`}
                    className="object-cover w-full h-full"
                    width={200}
                    height={200}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-zinc-400">
                    N/A
                  </div>
                )}
              </button>
            ))}
          </div>
        )}
        {/* Main Image */}
        <div className="flex justify-center items-center h-100 sm:size-113 bg-foreground/10 rounded-lg overflow-hidden">
          {selectedImage?.asset?.url ? (
            <Image
              src={selectedImage.asset.url}
              alt={productName ?? "Product image"}
              className="object-cover w-full h-full"
              width={1050}
              height={1050}
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-400">
              No image
            </div>
          )}
        </div>
      </div>
    </div>
  );
}