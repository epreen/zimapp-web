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

/** Validate an upload against user plan limits */
export async function validateUpload(
  userId: string,
  fileSize: number,
  durationSec?: number
): Promise<UploadValidationResult> {
  const authObj = await auth();

  if (!authObj.userId) {
    throw new Error("User is not authenticated.");
  }

  return await checkUploadLimits(authObj.userId, fileSize, durationSec);
}

export async function createStore(
  userId: string,
  name: string,
  description: string,
  category: string,
  logoFile?: File
) {
  const userProfile = await convex.query(api.profiles.retrieveByUserId, { userId });
  if (!userProfile) throw new Error("Profile not found");

  const maxStores = getStoreLimit(userProfile.plan as any);
  const existingStores = await convex.query(api.store.retrieveByUser, { userId });
  if (!canCreateStore(existingStores.length, maxStores)) {
    throw new Error(
      `You can only create up to ${maxStores} store(s) on your current plan (${userProfile.plan}).`
    );
  }

  let logoUrl: string | undefined;
  if (logoFile) {
    const validation = await validateUpload(userId, logoFile.size);
    if (!validation.allowed) throw new Error(validation.message);

    const ext = logoFile.name.split(".").pop();
    const filename = `store-logos/${uuidv4()}${ext ? "." + ext : ""}`;
    const blob = await put(filename, logoFile, {
      token: process.env.BLOB_READ_WRITE_TOKEN!,
      access: "public",
    });
    logoUrl = blob.url;
  }

  return await convex.mutation(api.store.create, {
    userId,
    name,
    description,
    category,
    logo: logoUrl,
    isActive: true,
    verificationStatus: "pending",
  });
}

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
  let logoUrl: string | undefined = undefined;
  if (updates.logoFile) {
    // If you have userId (owner) info available, do plan/upload checks as needed

    const ext = updates.logoFile.name.split(".").pop();
    const filename = `store-logos/${uuidv4()}${ext ? "." + ext : ""}`;
    const blob = await put(filename, updates.logoFile, {
      access: "public",
      addRandomSuffix: true,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });
    logoUrl = blob.url;
  }

  return await convex.mutation(api.store.update, {
    id: storeId,
    name: updates.name,
    description: updates.description,
    category: updates.category,
    logo: logoUrl,
    isActive: updates.isActive,
  });
}

export async function deleteStore(storeId: Id<"stores">) {
  const store = await convex.query(api.store.get, { id: storeId });
  if (!store) throw new Error("Store not found");

  await convex.mutation(api.store.update, {
    id: storeId,
    isActive: false,
    verificationStatus: "deleted",
  });
  return { success: true };
}