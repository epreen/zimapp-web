// /app/actions/store-actions.ts
"use server";

import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import { checkUploadLimits, UploadValidationResult } from "@/lib/tier-utils";
import { v4 as uuidv4 } from "uuid";
import { put } from "@vercel/blob";
import { Id } from "@/convex/_generated/dataModel";
import { getStoreLimit, canCreateStore } from "@/lib/store-limit";
import { PlanName } from "@/lib/tier-config";

/* Upload validation against the user's plan */
export async function validateUpload(
  userId: string,
  fileSize: number,
  durationSec?: number
): Promise<UploadValidationResult> {
  const authObj = await auth();
  if (!authObj.userId) {
    throw new Error("User is not authenticated.");
  }

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
  // Identity check: trust no one
  const authObj = await auth();
  if (!authObj.userId) {
    throw new Error("User is not authenticated.");
  }
  if (authObj.userId !== userId) {
    throw new Error("Unauthorized: user mismatch.");
  }

  // Load & verify user profile
  const userProfile = await convex.query(api.profiles.retrieveByUserId, { userId });
  if (!userProfile) {
    throw new Error("Profile not found");
  }

  // Enforce plan limits
  const maxStores = getStoreLimit(userProfile.plan as PlanName);
  const existingStores = await convex.query(api.store.retrieveByUser, { userId });

  if (!canCreateStore(existingStores.length, maxStores)) {
    throw new Error(
      `You can only create up to ${maxStores} store(s) on your current plan (${userProfile.plan}).`
    );
  }

  let logoUrl: string | undefined;

  // Optional logo upload
  if (logoFile) {
    const validation = await validateUpload(userId, logoFile.size);
    if (!validation.allowed) {
      throw new Error(validation.message);
    }

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

/* Update an existing store */
export async function updateStore(
  storeId: Id<"stores">,
  updates: {
    name?: string;
    description?: string;
    category?: string;
    logoFile?: File;
    isActive?: boolean;
  }
) {
  const authObj = await auth();
  if (!authObj.userId) {
    throw new Error("User is not authenticated.");
  }

  const currentUserId = authObj.userId;

  // Load target store
  const store = await convex.query(api.store.get, { id: storeId });
  if (!store) {
    throw new Error("Store not found.");
  }

  // Ownership check
  if (store.userId !== currentUserId) {
    throw new Error("Unauthorized: You can only update your own stores.");
  }

  // Load profile for plan enforcement
  const profile = await convex.query(api.profiles.retrieveByUserId, {
    userId: currentUserId,
  });
  if (!profile) {
    throw new Error("Profile not found.");
  }

  let logoUrl: string | undefined;

  // If updating logo, validate & upload
  if (updates.logoFile) {
    const validation = await checkUploadLimits(
      currentUserId,
      updates.logoFile.size
    );

    if (!validation.allowed) {
      throw new Error(validation.message || "Upload exceeds plan limits.");
    }

    const ext = updates.logoFile.name.split(".").pop();
    const filename = `store-logos/${uuidv4()}${ext ? "." + ext : ""}`;

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN environment variable is not set.");
    }

    const blob = await put(filename, updates.logoFile, {
      access: "public",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    logoUrl = blob.url;
  }

  // Apply validated updates
  return convex.mutation(api.store.update, {
    id: storeId,
    name: updates.name,
    description: updates.description,
    category: updates.category,
    logo: logoUrl,
    isActive: updates.isActive,
  });
}

/* Soft delete a store */
export async function deleteStore(storeId: Id<"stores">) {
  const authObj = await auth();
  if (!authObj.userId) {
    throw new Error("Unauthorized");
  }

  const store = await convex.query(api.store.get, { id: storeId });
  if (!store) {
    throw new Error("Store not found");
  }

  // Ownership validation
  if (store.userId !== authObj.userId) {
    throw new Error("Unauthorized: You can only delete your own stores");
  }

  await convex.mutation(api.store.update, {
    id: storeId,
    isActive: false,
    verificationStatus: "deleted",
  });

  return { success: true };
}