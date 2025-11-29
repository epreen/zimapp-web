// /inngest/jobs/generateListingEnhancement.ts
import { openai } from "@/inngest/integrations";
import { convex } from "@/lib/convex-client";

/**
 * Enhance a product listing (title + description + keywords).
 */
export async function generateListingEnhancement(productId: string, description: string) {
  const enhanced = await openai.rewriteListing(description); // implement rewriteListing in integrations
  // Save to Convex
  await convex.mutation((api: any) => api.products.update, {
    id: productId,
    optimizedDescription: enhanced.description,
    aiKeywords: enhanced.keywords,
    aiCategory: enhanced.category,
  });
  return enhanced;
}