// /lib/tier-utils.ts
import { auth } from "@clerk/nextjs/server"; // ✅ import as value
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import {
  PLAN_FEATURES,
  PLAN_LIMITS,
  PlanName,
  FeatureName,
} from "@/lib/tier-config";

export interface UploadValidationResult {
  allowed: boolean;
  reason?: "file_size" | "duration" | "product_limit" | "video_ad_limit" | "promo_push_limit";
  message?: string;
  currentCount?: number;
  limit?: number | null;
}

/**
 * Detect plan from Clerk Auth object using auth.has().
 */
export async function getPlanFromAuth(): Promise<PlanName> {
  const authObj = await auth(); // await the promise
  const has = authObj?.has;
  if (!has) return "free";

  if (has({ plan: "enterprise" })) return "enterprise";
  if (has({ plan: "business" })) return "business";
  if (has({ plan: "premium" })) return "premium";
  if (has({ plan: "standard" })) return "standard";
  return "free";
}

/**
 * Check if a user has access to a feature using Clerk's feature flags (auth.has)
 * or fallback to plan mapping.
 */
export async function checkFeatureAccess(feature: FeatureName): Promise<boolean> {
  const authObj = await auth();
  const has = authObj?.has;
  if (has && has({ feature })) return true;

  const plan = await getPlanFromAuth();
  return PLAN_FEATURES[plan].includes(feature);
}

/**
 * Returns features available for a plan
 */
export function getPlanFeatures(plan: PlanName): FeatureName[] {
  return PLAN_FEATURES[plan];
}

/**
 * Minimum plan that includes a given feature (based on the mapping)
 */
export function getMinimumPlanForFeature(feature: FeatureName): PlanName {
  const order: PlanName[] = ["free", "standard", "premium", "business", "enterprise"];
  for (const p of order) {
    if (PLAN_FEATURES[p].includes(feature)) return p;
  }
  return "enterprise";
}

/**
 * Validate upload against plan limits:
 */
export async function checkUploadLimits(
  userId: string,
  fileSize: number,
  durationSec?: number
): Promise<UploadValidationResult> {
  const plan = await getPlanFromAuth(); // ✅ await here
  const limits = PLAN_LIMITS[plan];

  // File size check
  if (limits.maxFileSize !== null && fileSize > limits.maxFileSize) {
    return {
      allowed: false,
      reason: "file_size",
      message: `Your plan (${plan}) allows files up to ${Math.round(limits.maxFileSize / (1024 * 1024))}MB.`,
      limit: limits.maxFileSize,
    };
  }

  // Duration check
  if (typeof durationSec === "number" && limits.maxDuration !== null && durationSec > limits.maxDuration) {
    return {
      allowed: false,
      reason: "duration",
      message: `Your plan (${plan}) allows uploads up to ${limits.maxDuration} seconds.`,
      limit: limits.maxDuration,
    };
  }

  // Project/product count check
  try {
    const productCountQuery = (api as any)?.products?.countByOwner;
    let productCount = null;
    if (productCountQuery) {
      productCount = await convex.query(productCountQuery, { ownerId: userId });
    }

    const productLimit = limits.maxProducts;
    if (productLimit !== null && typeof productCount === "number" && productCount >= productLimit) {
      return {
        allowed: false,
        reason: "product_limit",
        message: `You have reached your project/product limit for the ${plan} plan.`,
        currentCount: productCount,
        limit: productLimit,
      };
    }
  } catch (err) {
    return {
      allowed: false,
      reason: "product_limit",
      message: "Unable to verify upload limits. Please try again.",
    };
  }

  return { allowed: true };
}