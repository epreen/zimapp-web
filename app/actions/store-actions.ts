"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { checkUploadLimits, UploadValidationResult } from "@/lib/tier-utils";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";
import { getStoreLimit, canCreateStore } from "@/lib/store-limit";
import { Plans } from "@/lib/tier-config";

/* Upload validation against the user's plan */
export async function validateUpload(
  userId: string,
  fileSize: number,
  durationSec?: number
): Promise<UploadValidationResult> {
  const authObj = await auth();
  if (!authObj.userId) throw new Error("User is not authenticated.");

  return checkUploadLimits(authObj.userId, fileSize, durationSec);
}

/* Create a new store — authenticated and owned by the requesting user */
export async function createStore(
  userId: string,
  name: string,
  description: string,
  category: string,
  logoFile?: File
) {
  // Identity check
  const authObj = await auth();
  if (!authObj.userId) throw new Error("User is not authenticated.");
  if (authObj.userId !== userId) throw new Error("Unauthorized: user mismatch.");

  // Fetch user plan from Clerk public metadata
  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const planFromMetadata = clerkUser.publicMetadata.plan ?? "free";
  
  // Validate plan value
  const validPlans: Plans[] = ["free", "standard", "premium", "business", "enterprise"];
  const userPlan: Plans = validPlans.includes(planFromMetadata as Plans) 
    ? (planFromMetadata as Plans) 
    : "free";

  // Enforce plan limits
  const maxStores = getStoreLimit(userPlan);
  const existingStores = await convex.query(api.store.retrieveByUser, { userId });

  if (!canCreateStore(existingStores.length, maxStores)) {
    throw new Error(
      `You can only create up to ${maxStores} store(s) on your current plan (${userPlan}).`
    );
  }

  let logoUrl: string | undefined;

  // Optional logo upload
  if (logoFile) {
    const validation = await validateUpload(userId, logoFile.size);
    if (!validation.allowed) throw new Error(validation.message);

    const ext = logoFile.name.split(".").pop();
    const filename = `store-logos/${uuidv4()}${ext ? "." + ext : ""}`;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not set");
    }

    const blob = await put(filename, logoFile, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
      access: "public",
    });

    logoUrl = blob.url;
  }

  // Create the store entry
  return convex.mutation(api.store.create, {
    userId,
    name,
    description,
    category,
    logo: logoUrl,
    isActive: true,
    verificationStatus: "pending",
  });
}