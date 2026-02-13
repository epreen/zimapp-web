import { defineQuery } from "next-sanity";
import { LOW_STOCK_THRESHOLD } from "@/lib/constants/stock";

// ============================================
// Shared Query Fragments (DRY)
// ============================================
export const PRODUCT_BASE = `
_id,
name,
description,
"slug": slug.current,
price,
discount,
stock,
status,
isFeatured,
isOffer,
"images": images[]{
  asset->{url},
  hotspot
}
`;

/**
 * Count products owned by a user (via store ownership)
 */
export const PRODUCT_COUNT_BY_USER_QUERY = defineQuery(`
  count(
    *[
      _type == "product"
      && store->userId == $userId
    ]
  )
`);


/** Common filter conditions for product filtering */
const PRODUCT_FILTER_CONDITIONS = `
  _type == "product"
  && ($categorySlug == "" || categories[0]->slug.current == $categorySlug)
  && ($minPrice == 0 || price >= $minPrice)
  && ($maxPrice == 0 || price <= $maxPrice)
  && (
    $searchQuery == ""
    || name match $searchQuery + "*"
    || description match $searchQuery + "*"
    || categories[0]->title match $searchQuery + "*"
  )
  && ($inStock == false || stock > 0)
`;

const STORE_PRODUCT_FILTER = `
  _type == "product"
  && store._ref == $storeId
`;


/** Projection for filtered product lists (includes multiple images for hover) */
const FILTERED_PRODUCT_PROJECTION = `{
  _id,
  name,
  "slug": slug.current,
  price,
  stock,
  featured,

  "images": images[0...4]{
    _key,
    asset->{ _id, url }
  },

  categories[0]->{
    _id,
    title,
    "slug": slug.current
  },

  // --- TYPE-SPECIFIC DETAILS (SAFE) ---
  electronics{
    brand,
    model,
    specs{
      ram,
      storage,
      capacity
    }
  },

  clothing{
    fabric,
    color,
    sizes
  },

  consumable{
    exp
  }
}`;

export const PRODUCTS_BY_STORE_QUERY = defineQuery(`
  *[${STORE_PRODUCT_FILTER}]
  | order(_createdAt desc) {
    _id,
    name,
    price,
    stock,
    featured,
    "slug": slug.current,
    images[0]{ asset->{ url } }
  }
`);

export const PRODUCT_CARD_PROJECTION = `
  _id,
  name,
  "slug": slug.current,
  price,
  discount,
  stock,
  status,
  isFeatured,
  isOffer,

  "images": images[0...4]{
    _key,
    asset->{ _id, url }
  },

  categories[]->{
    _id,
    title,
    "slug": slug.current
  }
`;


/** Scoring for relevance-based search */
const RELEVANCE_SCORE = `score(
  boost(name match $searchQuery + "*", 3),
  boost(description match $searchQuery + "*", 1),
  boost(categories[0]->title match $searchQuery + "*", 1)
)`;

// ============================================
// All Products Query
// ============================================

/**
 * Get all products with category expanded
 * Used on landing page
 */
export const ALL_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  price,
  "images": images[]{
    _key,
    asset->{
      _id,
      url
    },
    hotspot
  },
  categories[0]->{
    _id,
    title,
    "slug": slug.current
  },
  material,
  color,
  dimensions,
  stock,
  featured,
  assemblyRequired
}`);

/**
 * Get featured products for homepage carousel
 */
export const FEATURED_PRODUCTS_QUERY = defineQuery(`
  *[
    _type == "product" &&
    defined(description) &&
    count(categories) > 0 &&
    enableRatingsManagement == true &&
    averageRating > 4.5
  ]{
    ${PRODUCT_BASE},
    categories[]->{
      title,
      "slug": slug.current
    }
  }
`);  

/**
 * Get products by category slug
 */
export const PRODUCTS_BY_CATEGORY_QUERY = defineQuery(`*[
  _type == "product"
  && categories[0]->slug.current == $categorySlug
] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  price,
  "image": images[0]{
    asset->{
      _id,
      url
    },
    hotspot
  },
  categories[0]->{
    _id,
    title,
    "slug": slug.current
  },
  material,
  color,
  stock
}`);

/**
 * Get single product by slug
 * Used on product detail page
 */
export const PRODUCT_BY_SLUG_QUERY = defineQuery(`
  *[
    _type == "product"
    && slug.current == $slug
  ][0]{
    _id,
    name,
    "slug": slug.current,
    description,
    price,
    discount,
    stock,
    status,
    isFeatured,
    isOffer,

    images[]{
      _key,
      asset->{ _id, url },
      hotspot
    },

    categories[]->{
      _id,
      title,
      "slug": slug.current
    },

    hasBrand,
    brand->{
      _id,
      name,
      "slug": slug.current
    },

    isElectronic,
    electronicDetails,

    isClothing,
    clothingDetails,

    isConsumable,
    consumableDetails,

    isMaterial,
    materialDetails,

    enableRatingsManagement,
    averageRating,
    totalReviews,
    ratingDistribution,

    store->{
      _id,
      name,
      username,
      logo{
        asset->{ _id, url }
      }
    }
  }
`);

// ============================================
// Search & Filter Queries (Server-Side)
// Uses GROQ score() for relevance ranking
// ============================================

/**
 * Search products with relevance scoring
 * Uses score() + boost() for better ranking
 * Orders by relevance score descending
 */
export const SEARCH_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && (
    name match $searchQuery + "*"
    || description match $searchQuery + "*"
  )
] | score(
  boost(name match $searchQuery + "*", 3),
  boost(description match $searchQuery + "*", 1)
) | order(_score desc) {
  _id,
  _score,
  store->{
    _id,
    name,
    username,
    logo{
      asset->{
        _id,
        url
      }
    }
  },
  name,
  "slug": slug.current,
  price,
  "image": images[0]{
    asset->{
      _id,
      url
    },
    hotspot
  },
  categories[0]->{
    _id,
    title,
    "slug": slug.current
  },
  stock
}`);

/**
 * Filter products - ordered by name (A-Z)
 * Returns up to 4 images for hover preview in product cards
 */
export const FILTER_PRODUCTS_BY_NAME_QUERY = defineQuery(`
  *[${PRODUCT_FILTER_CONDITIONS}]
  | order(name asc)
  {
    ${PRODUCT_CARD_PROJECTION}
  }
`);

export const FILTER_PRODUCTS_BY_PRICE_ASC_QUERY = defineQuery(`
  *[${PRODUCT_FILTER_CONDITIONS}]
  | order(price asc)
  {
    ${PRODUCT_CARD_PROJECTION}
  }
`);

export const FILTER_PRODUCTS_BY_PRICE_DESC_QUERY = defineQuery(`
  *[${PRODUCT_FILTER_CONDITIONS}]
  | order(price desc)
  {
    ${PRODUCT_CARD_PROJECTION}
  }
`);

export const FILTER_PRODUCTS_BY_RELEVANCE_QUERY = defineQuery(`
  *[${PRODUCT_FILTER_CONDITIONS}]
  | ${RELEVANCE_SCORE}
  | order(_score desc, name asc)
  {
    ${PRODUCT_CARD_PROJECTION}
  }
`);

/**
 * Get products by IDs (for cart/checkout)
 */
export const PRODUCTS_BY_IDS_QUERY = defineQuery(`*[
  _type == "product"
  && _id in $ids
] {
  _id,
  store->{
    _id,
    name,
    username,
    logo{
      asset->{
        _id,
        url
      }
    }
  },
  name,
  "slug": slug.current,
  price,
  "image": images[0]{
    asset->{
      _id,
      url
    },
    hotspot
  },
  stock
}`);

/**
 * Get low stock products (admin)
 * Uses LOW_STOCK_THRESHOLD constant for consistency
 */
export const LOW_STOCK_PRODUCTS_QUERY = defineQuery(`
  *[
    ${STORE_PRODUCT_FILTER}
    && stock > 0
    && stock <= ${LOW_STOCK_THRESHOLD}
  ]
  | order(stock asc) {
    _id,
    name,
    stock,
    "slug": slug.current,
    images[0]{ asset->{ url } }
  }
`);

/**
 * Get out of stock products (admin)
 */
export const OUT_OF_STOCK_PRODUCTS_QUERY = defineQuery(`
  *[
    ${STORE_PRODUCT_FILTER}
    && stock == 0
  ]
  | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    images[0]{ asset->{ url } }
  }
`);


// ============================================
// AI Shopping Assistant Query
// Uses score() + boost() with all filters for AI agent
// ============================================

/**
 * Search products for AI shopping assistant
 * Full-featured search with all filters and product details
 */
export const AI_SEARCH_PRODUCTS_QUERY = defineQuery(`*[
  _type == "product"
  && (
    $searchQuery == ""
    || name match $searchQuery + "*"
    || description match $searchQuery + "*"
    || categories[0]->title match $searchQuery + "*"
  )
  && ($categorySlug == "" || categories[0]->slug.current == $categorySlug)
  && ($material == "" || material == $material)
  && ($color == "" || color == $color)
  && ($minPrice == 0 || price >= $minPrice)
  && ($maxPrice == 0 || price <= $maxPrice)
] | order(name asc) [0...20] {
  _id,
  store->{
    _id,
    name,
    username,
    logo{
      asset->{
        _id,
        url
      }
    }
  },
  name,
  "slug": slug.current,
  description,
  price,
  "image": images[0]{
    asset->{
      _id,
      url
    }
  },
  categories[0]->{
    _id,
    title,
    "slug": slug.current
  },
  stock,
  featured
}`);