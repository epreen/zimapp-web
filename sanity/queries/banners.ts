import { defineQuery } from "next-sanity";

/* ================================
   Banner Queries
================================ */

/**
 * Get all banners
 * Intended for homepage / marketing sections
 */
export const BANNERS_QUERY = defineQuery(`
    *[_type == "banner"] | order(_createdAt desc) {
      _id,
      title,
      buttonTitle,
      buttonHref,
      image {
        asset->{
          url
        }
      }
    }
`);