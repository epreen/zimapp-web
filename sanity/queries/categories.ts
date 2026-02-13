import { defineQuery } from "next-sanity";
import { sanityFetch } from "../lib/live";
import { unstable_cache } from "next/cache"; 

export const ALL_CATEGORIES_QUERY = defineQuery(`*[
  _type == "category"
] | order(title asc) {
  _id,
  title,
  "slug": slug.current,
  "image": image{
    asset->{
      _id,
      url
    },
    hotspot
  }
}`);

/**
 * Get category by slug
 */
export const CATEGORY_BY_SLUG_QUERY = defineQuery(`*[
  _type == "category"
  && slug.current == $slug
][0] {
  _id,
  title,
  "slug": slug.current,
  "image": image{
    asset->{
      _id,
      url
    },
    hotspot
  }
}`);

const getCategories = unstable_cache(
  async (quantity?: number) => {
    try {
      const query = quantity
        ? `*[_type == 'category'] | order(name asc) [0...$quantity] {
            ...,
            "productCount": count(*[_type == "product" && references(^._id)])
          }`
        : `*[_type == 'category'] | order(name asc) {
            ...,
            "productCount": count(*[_type == "product" && references(^._id)])
          }`;

      const { data } = await sanityFetch({
        query,
        params: quantity ? { quantity } : {},
      });

      return data ?? [];
    } catch (error) {
      console.log("Error fetching categories with product count:", error);
      return [];
    }
  },
  ["categories-list"],
  { revalidate: 900, tags: ["categories", "navigation"] }
);

export {
  getCategories
}