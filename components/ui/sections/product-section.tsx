"use client";

import { useEffect, useState } from "react";
import { client } from "@/sanity/lib/client";
import { Product } from "@/sanity.types";
import ProductCarouselSkeleton from "../skeletons/product-carousel-skeleton";
import ProductCarousel from "../carousels/product-carousel";

// Type definition based on FILTERED_PRODUCT_PROJECTION
type ProductVariant = {
  _id: string;
  title: string | null;
  slug: { current: string };
};

type SortOption =
  | "price-asc"
  | "price-desc"
  | "newest"
  | "oldest";

export function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productVariants, setProductVariants] = useState<ProductVariant[]>([]);
  const [productsByVariant, setProductsByVariant] =
  useState<Record<string, Product[]>>({});

  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variantLoading, setVariantLoading] = useState(false);
  const [carouselsLoading, setCarouselsLoading] = useState(true);

  const [selectedTab, setSelectedTab] = useState<string>("");
  const [stockStatus, setStockStatus] = useState<string>("all");
  const [rating, setRating] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    setMounted(true);
  }, [])
  
  const fetchVariants = async () => {
    setVariantLoading(true);
    try {
      const variantQuery = `
        *[_type == "category" && defined(slug)]{
          _id,
          title,
          slug
        } | order(title asc)
      `;

      const variants = await client.fetch(variantQuery);
      setProductVariants(variants);
      console.log("Variants: ", variants);
      if (variants.length > 0) {
        setSelectedTab(variants[0]._id);
      }
    } catch (error) {
      console.error("Error fetching product variants: ", error);
    } finally {
      setVariantLoading(false);
    }
  };

  useEffect(() => {
    fetchVariants();
  }, [])

  useEffect(() => {
    if (productVariants.length === 0) return;
  
    const fetchProductsByVariant = async () => {
      setCarouselsLoading(true);
  
      try {
        const productsByVariantData: Record<string, Product[]> = {};
  
        for (const variant of productVariants) {
          const query = `
            *[_type == "product" && references($categoryId)] 
            | order(_createdAt desc) [0...10] {
              ...,
              "categories": categories[]->title
            }
          `;
  
          const products = await client.fetch<Product[]>(query, {
            categoryId: variant._id
          });
  
          productsByVariantData[variant._id] = products;
        }
  
        setProductsByVariant(productsByVariantData);
  
        // Optional: flatten for main grid
        const allProducts = Object.values(productsByVariantData).flat();
        setProducts(allProducts);
  
        console.log("Products by variant:", productsByVariantData);
        console.log("All products:", allProducts);
  
      } catch (error) {
        console.error("Error fetching products by variant: ", error);
      } finally {
        setCarouselsLoading(false);
      }
    };
  
    fetchProductsByVariant();
  }, [productVariants]);  

  function getSortQuery(sort: SortOption): string {
    switch (sort) {
      case "price-asc":
        return "price asc";
      case "price-desc":
        return "price desc";
      case "newest":
        return "_createdAt desc";
      case "oldest":
        return "_createdAt asc";
      default:
        return "_createdAt desc";
    }
  }
  
  const query = `
    *[_type == "product" && references($categoryId)] 
    | order(${
      getSortQuery(sortBy)
    }) {
      ...,
      "categories": categories[]->title
    }
  `;

  const params = { categoryId: selectedTab }

  useEffect(() => {
    if (!selectedTab) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await client.fetch(query, params);
        setProducts(await response);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedTab, sortBy])

  return (
    <div>
      {/* Main content area */}
      <div className="grid gap-8">
        {carouselsLoading ? (
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 overflow-hidden">
              <ProductCarouselSkeleton />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-7xl px-3 sm:px-4 overflow-hidden">
            {productVariants?.map((variant) => {
              const variantProducts = productsByVariant[variant._id] || [];
              if (variantProducts?.length === 0) return null;
              return (
                <ProductCarousel
                  key={variant?._id}
                  variantTitle={variant.title}
                  variantSlug={variant.slug.current}
                  variantProducts={variantProducts}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}