import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { processVideo } from "@/inngest/functions/video-functions";
import { enhanceProduct } from "@/inngest/functions/product-functions";
import { storeMetadataFn } from "@/inngest/functions/store-functions";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    processVideo,
    enhanceProduct,
    storeMetadataFn
  ],
});