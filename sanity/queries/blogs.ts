import { defineQuery } from "next-sanity";

export const LATEST_BLOG_QUERY = defineQuery(
    ` *[_type == 'blog' && isLatest == true]|order(name asc){
            ...,
            blogcategories[]->{
            title
        }
    }`
);
  
export const GET_ALL_BLOG = defineQuery(
    `*[_type == 'blog'] | order(publishedAt desc)[0...$quantity]{
            ...,  
            blogcategories[]->{
            title
        }
      }
    `
);
  
export const SINGLE_BLOG_QUERY =
    defineQuery(`*[_type == "blog" && slug.current == $slug][0]{
        ..., 
        author->{
        name,
        image,
    },
    blogcategories[]->{
        title,
        "slug": slug.current,
    },
}`);
  
export const BLOG_CATEGORIES = defineQuery(
    `*[_type == "blog"]{
            blogcategories[]->{
            ...
        }
    }`
);
  
export const OTHERS_BLOG_QUERY = defineQuery(`*[
    _type == "blog"
    && defined(slug.current)
    && slug.current != $slug
    ]|order(publishedAt desc)[0...$quantity]{
        _id,
        publishedAt,
        title,
        mainImage,
        slug,
        author->{
            name,
            image,
        },
        categories[]->{
            title,
            "slug": slug.current,
        }
}`);