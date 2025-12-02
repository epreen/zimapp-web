// inngest/store/jobs.ts

import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { openai } from "@/inngest/integrations";

export const nightlyStoreHealthCheck = inngest.createFunction(
  { id: "store.healthcheck.nightly" },
  { cron: "0 0 * * *" }, // every midnight
  async ({ step }) => {
    // Fetch all stores
    const stores = await step.run("fetch stores", async () => {
      const result = await convex.query(api.store.retrieve, {
        paginationOpts: { numItems: 1000 },
      });
      return result.page;
    });

    // Update each store
    for (const store of stores) {
      await step.run(`evaluate store ${store._id}`, async () => {
        const scoreObj = await openai.generateVideoMetadata(store.description);

        await convex.mutation(api.store.update, {
          id: store._id,
          aiHealthScore: scoreObj?.engagementScore ?? 0.5,
        });
      });
    }

    return { processed: stores.length };
  }
);