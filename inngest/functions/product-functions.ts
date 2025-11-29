import { inngest } from "@/inngest/client";
import { openai, cohere } from "@/inngest/integrations";

export const enhanceProduct = inngest.createFunction(
    { id: "enhance-product" },
    { event: "product.created" },
    async ({ event, step }) => {
      const product = event.data;
  
      const optimized = await step.run("rewrite", () =>
        openai.rewriteDescription(product.description)
      );
  
      const category = await step.run("auto-cat", () =>
        cohere.classify(product.description)
      );
  
      await step.run("save", () =>
        convex.mutations.products.update({
          id: product.id,
          optimizedDescription: optimized.text,
          aiCategory: category,
        })
      );
    }
  );  