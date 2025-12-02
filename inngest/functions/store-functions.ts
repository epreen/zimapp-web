// inngest/store/create-metadata.ts

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { openai } from "@/inngest/integrations";

export const storeMetadataFn = inngest.createFunction(
  { id: "store.generate.metadata" },
  { event: "store/created" },
  async ({ event, step }) => {
    const { storeId } = event.data;

    // Fetch store
    const store = await step.run("fetch store", async () => {
      return await convex.query(api.store.get, { id: storeId });
    });

    if (!store) return step.run("abort", () => "Store not found");

    // Use store description to generate metadata
    const metadata = await step.run("generate ai metadata", async () => {
      // Swap in whatever analysis your model does
      const response = await openai.generateVideoMetadata(store.description);
      return response;
    });

    // Update store
    await step.run("update store ai metadata", async () => {
      await convex.mutation(api.store.update, {
        id: storeId,
        aiHealthScore: metadata?.engagementScore ?? 0.5,
        verificationStatus: "pending", // you can change this logic
      });
    });

    return { status: "done", metadata };
  }
);
