import { unstable_cache } from "next/cache";
import { sanityFetch } from "../lib/live";
import { BLOG_CATEGORIES, GET_ALL_BLOG, LATEST_BLOG_QUERY, OTHERS_BLOG_QUERY, SINGLE_BLOG_QUERY } from "../queries/blogs";

const getAllBlogs = unstable_cache(
    async (quantity: number) => {
      try {
        const { data } = await sanityFetch({
          query: GET_ALL_BLOG,
          params: { quantity },
        });
        return data ?? [];
      } catch (error) {
        console.log("Error fetching all blogs:", error);
        return [];
      }
    },
    ["all-blogs"],
    { revalidate: 600, tags: ["blogs"] }
);

const getLatestBlogs = unstable_cache(
    async () => {
      try {
        const { data } = await sanityFetch({ query: LATEST_BLOG_QUERY });
        return data ?? [];
      } catch (error) {
        console.log("Error fetching latest blogs:", error);
        return [];
      }
    },
    ["latest-blogs"],
    { revalidate: 300, tags: ["blogs", "homepage"] }
);

const getSingleBlog = unstable_cache(
    async (slug: string) => {
      try {
        const { data } = await sanityFetch({
          query: SINGLE_BLOG_QUERY,
          params: { slug },
        });
        return data ?? [];
      } catch (error) {
        console.log("Error fetching blog:", error);
        return [];
      }
    },
    ["single-blog"],
    { revalidate: 1800, tags: ["blogs"] }
);

const getBlogCategories = unstable_cache(
    async () => {
      try {
        const { data } = await sanityFetch({
          query: BLOG_CATEGORIES,
        });
        return data ?? [];
      } catch (error) {
        console.log("Error fetching blog categories:", error);
        return [];
      }
    },
    ["blog-categories"],
    { revalidate: 3600, tags: ["blogs"] }
);

const getOthersBlog = unstable_cache(
    async (slug: string, quantity: number) => {
      try {
        const { data } = await sanityFetch({
          query: OTHERS_BLOG_QUERY,
          params: { slug, quantity },
        });
        return data ?? [];
      } catch (error) {
        console.log("Error fetching other blogs:", error);
        return [];
      }
    },
    ["others-blog"],
    { revalidate: 600, tags: ["blogs"] }
);

export {
    getLatestBlogs,
    getSingleBlog,
    getAllBlogs,
    getBlogCategories,
    getOthersBlog
  };