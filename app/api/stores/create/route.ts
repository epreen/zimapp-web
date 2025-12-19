// app/api/stores/create/route.ts
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { ALLOWED_IMAGE_TYPES } from "@/lib/constants";
import { PLAN_LIMITS } from "@/lib/tier-config";
import { apiError } from "@/lib/api-utils";
import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  try {
    const authObj = await auth();
    const { userId, has } = authObj;

    if (!userId) return apiError("Unauthorized", 401);

    const body = (await req.json()) as {
      name: string;
      description: string;
      category: string;
      logo?: HandleUploadBody;
    };

    if (!body.name || !body.description || !body.category) {
      return apiError("Missing required fields", 400);
    }

    // Determine plan-based upload size
    let maxFileSize = PLAN_LIMITS.free.maxFileSize;
    if (has?.({ plan: "standard" })) maxFileSize = PLAN_LIMITS.standard.maxFileSize;
    else if (has?.({ plan: "premium" })) maxFileSize = PLAN_LIMITS.premium.maxFileSize;
    else if (has?.({ plan: "business" })) maxFileSize = PLAN_LIMITS.business.maxFileSize;
    else if (has?.({ plan: "enterprise" })) maxFileSize = PLAN_LIMITS.enterprise.maxFileSize;

    let logoUrl: string | undefined;

    if (body.logo) {
      await handleUpload({
        body: body.logo,
        request: req,
        onBeforeGenerateToken: async () => ({
          allowedContentTypes: ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: maxFileSize,
          addRandomSuffix: true,
        }),
        onUploadCompleted: async ({ blob }) => {
          logoUrl = blob.url;
        },
      });
    }

    // ✅ Send only what Convex expects
    const storeId = await convex.mutation(api.store.create, {
      userId,
      name: body.name,
      description: body.description,
      category: body.category,
      logo: logoUrl,
      isActive: true,
      verificationStatus: "pending" as const,
    });

    await inngest.send({
      name: "store.created",
      data: {
        storeId,
        userId,
        name: body.name,
      },
    });

    return NextResponse.json({ status: "success", storeId });
  } catch (error) {
    console.error("Error creating store:", error);
    return apiError(
      error instanceof Error ? error.message : "Failed to create store",
      500
    );
  }
}