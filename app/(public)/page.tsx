import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import HomePageClient from "./home-client";

export default async function Page() {
  const products = await preloadQuery(api.products.retrieve, {
    paginationOpts: { numItems: 100 },
  });

  return <HomePageClient products={products} />;
}