"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import Link from "next/link";
import { Button } from "../../button";

type ProductVariant = {
  _id: string;
  title: string | null;
  slug: { current: string };
};

interface CategoryTilesProps {
  categories: ProductVariant[];
  activeCategory?: string;
  onActiveCategory: (category: string) => void;
  onClearAll: () => void;
}

export default function CategoriesMarquee({
  categories = [],
  activeCategory,
  onActiveCategory,
  onClearAll
}: CategoryTilesProps) {
  // Controlled repetition count
  const repeatedCategories = Array.from({ length: 8 }, (_, i) =>
    categories.map((category) => ({
      ...category,
      __repeatIndex: i,
    }))
  ).flat();

  const isSeeAllActive = !activeCategory;

  return (
    <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none sm:my-20">
      {/* Left gradient */}
      <div className="absolute left-0 top-0 h-full w-20 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex min-w-[200%] gap-4 whitespace-nowrap animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:paused"
      >
        {repeatedCategories.map((category, i) => {
          const isActive = activeCategory === category._id;

          return (
            <Button
              key={`${category._id}-${category.__repeatIndex}-${i}`}
              onClick={() => onActiveCategory(category?._id)}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm active:scale-95 transition-all duration-300
                ${
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-primary text-background"
                }`}
            >
              {category.title}
            </Button>
          );
        })}
      </div>

      {/* Right gradient */}
      <div className="absolute right-0 top-0 h-full w-32 bg-linear-to-l from-background/90 to-background backdrop-blur-md rounded-l-sm flex justify-end">
        <Button
          variant="outline"
          onClick={onClearAll}
          className={`transition-all duration-300 ${
            isSeeAllActive
              ? "bg-foreground text-background scale-[1.02]"
              : ""
          }`}
        >
          See All
        </Button>
      </div>
    </div>
  );
}