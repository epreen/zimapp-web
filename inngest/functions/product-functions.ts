import { api } from "@/convex/_generated/api";
import { inngest } from "@/inngest/client";
import { openai, cohere } from "@/inngest/integrations";
import { convex } from "@/lib/convex-client";

export const enhanceProduct = inngest.createFunction(
  { id: "enhance-product" },
  { event: "product.created" },
  async ({ event, step }) => {
    const product = event.data;

    const optimized: { description: string; keywords: string[]; category: string } =
      await step.run("rewrite", () =>
        openai.rewriteListing(product.description)
      );

    const category = await step.run("auto-cat", () =>
      cohere.generateTags(product.description)
    );

    convex.mutation(api.products.update, {
      id: product.id,
      generatedDescription: optimized.description,
      category: category,
    });    
  }
);
