// /lib/tier-utils.ts
import type { Auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";
import {
  PLAN_FEATURES,
  PLAN_LIMITS,
  PlanName,
  FeatureName,
  FEATURES,
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
export function getPlanFromAuth(auth: Auth): PlanName {
  const has = auth?.has;
  if (!has) return "free";

  // Order matters: check highest plans first
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
export function checkFeatureAccess(auth: Auth, feature: FeatureName): boolean {
  const has = auth?.has;
  if (has && has({ feature })) return true;

  // fallback using plan features
  const plan = getPlanFromAuth(auth);
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
  // check plans in ascending order of privilege
  const order: PlanName[] = ["free", "standard", "premium", "business", "enterprise"];
  for (const p of order) {
    if (PLAN_FEATURES[p].includes(feature)) return p;
  }
  return "enterprise";
}

/**
 * Validate upload against plan limits:
 * - file size
 * - duration
 * - project counts (number of product uploads or video ads as example)
 *
 * This function uses Convex queries for counting existing objects.
 */
export async function checkUploadLimits(
  auth: Auth,
  userId: string,
  fileSize: number,
  durationSec?: number
): Promise<UploadValidationResult> {
  const plan = getPlanFromAuth(auth);
  const limits = PLAN_LIMITS[plan];

  // Check file size
  if (limits.maxFileSize !== null && fileSize > limits.maxFileSize) {
    return {
      allowed: false,
      reason: "file_size",
      message: `Your plan (${plan}) allows files up to ${Math.round(limits.maxFileSize / (1024 * 1024))}MB.`,
      limit: limits.maxFileSize,
    };
  }

  // Check duration (if provided)
  if (typeof durationSec === "number" && limits.maxDuration !== null && durationSec > limits.maxDuration) {
    return {
      allowed: false,
      reason: "duration",
      message: `Your plan (${plan}) allows uploads up to ${limits.maxDuration} seconds.`,
      limit: limits.maxDuration,
    };
  }

  // Project/product count checks: try to call Convex query that returns count.
  try {
    // Replace these with your actual convex query names. Example:
    // const productCount = await convex.query(api.products.countByOwner, { ownerId: userId });
    // We use generic placeholder names; update to match your convex schema.
    const productCountQuery = (api as any)?.products?.countByOwner;
    let productCount = null;
    if (productCountQuery) {
      productCount = await convex.query(productCountQuery, { ownerId: userId });
    }

    const projectLimit = limits.maxProjects;
    if (projectLimit !== null && typeof productCount === "number" && productCount >= projectLimit) {
      return {
        allowed: false,
        reason: "product_limit",
        message: `You have reached your project/product limit for the ${plan} plan.`,
        currentCount: productCount,
        limit: projectLimit,
      };
    }
  } catch (err) {
    return {
      allowed: false,
      reason: "product_limit",
      message: "Unable to verify upload limits. Please try again.",
    };
  }

  // passed checks
  return { allowed: true };
}