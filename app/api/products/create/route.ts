// app/api/products/create/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ALLOWED_IMAGE_TYPES } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/tier-config";
import { apiError } from "@/lib/api-utils";
import { inngest } from "@/inngest/client";
import { Id } from "@/convex/_generated/dataModel";

export async function POST(req: Request) {
  try {
    // Authenticate the request
    const { userId, has } = await auth();
    if (!userId) return apiError("Unauthorized", 401);

    // Parse request body
    const body = (await req.json()) as {
      name: string;
      price: number;
      description: string;
      images?: HandleUploadBody[];
      storeId: string;
    };

    // Validate required fields
    if (!body.name || !body.price || !body.storeId) {
      return apiError("Missing required fields: name, price, storeId", 400);
    }

    // Determine plan-based file size limit
    let maxFileSize = PLAN_LIMITS.free.maxFileSize; // default to free plan
    if (has?.({ plan: "standard" })) maxFileSize = PLAN_LIMITS.standard.maxFileSize;
    else if (has?.({ plan: "premium" })) maxFileSize = PLAN_LIMITS.premium.maxFileSize;
    else if (has?.({ plan: "business" })) maxFileSize = PLAN_LIMITS.business.maxFileSize;
    else if (has?.({ plan: "enterprise" })) maxFileSize = PLAN_LIMITS.enterprise.maxFileSize;

    // Generate pre-signed URLs for each image (if provided)
    const uploadedImageUrls: string[] = [];
    if (body.images?.length) {
      for (const image of body.images) {
        await handleUpload({
          body: image,
          request: req,
          onBeforeGenerateToken: async () => ({
            allowedContentTypes: ALLOWED_IMAGE_TYPES,
            maximumSizeInBytes: maxFileSize,
            addRandomSuffix: true,
          }),
          onUploadCompleted: async ({ blob }) => {
            uploadedImageUrls.push(blob.url);
          },
        });
      }
    }

    // Insert product into Convex
    const productData = {
        name: body.name,
        price: body.price,
        description: body.description,
        images: uploadedImageUrls,
        storeId: body.storeId as unknown as Id<"stores">,
        optimizedDescription: undefined,
        aiKeywords: [],
        aiCategory: undefined,
        engagementScore: 0,
        moderationStatus: "pending",
        createdAt: Date.now(),
    };

    const product = await convex.mutation(api.products.create, productData);

    // Trigger Inngest event
    await inngest.send({
      name: "product.created",
      data: productData,
    });

    return NextResponse.json({ status: "success", productId: product });
  } catch (error) {
    console.error("Error creating product:", error);
    return apiError(error instanceof Error ? error.message : "Upload failed", 500);
  }
}