// /inngest/jobs/generateListingEnhancement.ts
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { openai } from "@/inngest/integrations";
import { convex } from "@/lib/convex-client";

/**
 * Enhance a product listing (title + description + keywords).
 */
export async function generateListingEnhancement(productId: Id<"products">, description: string) {
  const enhanced = await openai.rewriteListing(description); // implement rewriteListing in integrations
  // Save to Convex
  await convex.mutation(api.products.update, {
    id: productId,
    generatedDescription: enhanced.description,
    keywords: enhanced.keywords,
    category: enhanced.category,
  });
  return enhanced;
}