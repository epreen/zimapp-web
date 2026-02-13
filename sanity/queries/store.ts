import { defineQuery } from "next-sanity";

/**
 * Fetch a store by its username (public storefront page)
 */
export const STORE_BY_USERNAME_QUERY = defineQuery(`
  *[_type == "store" && username == $username && activated == true][0]{
    _id,
    name,
    description,
    username,
    address,
    email,
    contact,
    status,
    activated,
    keywords,
    categories,
    types,
    "slug": slug.current,
    logo {
      asset->{
        _id,
        url
      }
    }
  }
`);

/**
 * Fetch all activated stores (marketplace / discovery)
 */
export const ALL_ACTIVE_STORES_QUERY = defineQuery(`
  *[_type == "store" && activated == true] | order(_createdAt desc){
    _id,
    name,
    username,
    description,
    categories,
    types,
    "slug": slug.current,
    logo {
      asset->{
        _id,
        url
      }
    }
  }
`);

/**
 * Fetch stores owned by a specific user
 * (dashboard / account area)
 */
export const STORES_BY_USER_QUERY = defineQuery(`
  *[_type == "store" && userId == $userId] | order(_createdAt desc){
    _id,
    userId,
    name,
    username,
    status,
    activated,
    categories,
    types,
    "slug": slug.current,
    logo {
      asset->{
        _id,
        url
      }
    }
  }
`);

/**
 * Fetch store by slug (admin / moderation / internal tools)
 */
export const STORE_BY_SLUG_QUERY = defineQuery(`
  *[_type == "store" && slug.current == $slug][0]{
    _id,
    name,
    description,
    username,
    address,
    email,
    contact,
    status,
    activated,
    keywords,
    categories,
    types,
    userId,
    "slug": slug.current,
    logo {
      asset->{
        _id,
        url
      }
    }
  }
`);

/**
 * Lightweight existence check
 * (used for validation / routing guards)
 */
export const STORE_EXISTS_BY_USERNAME_QUERY = defineQuery(`
  count(*[_type == "store" && username == $username])
`);