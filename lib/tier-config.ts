// /lib/tier-config.ts
export type PlanName = "basic" | "standard" | "premium" | "business" | "enterprise";

/**
 * Feature constants
 */
export const FEATURES = {
  BUSINESS_VERIFICATION: "business_verification",
  VIDEO_PROMO_UPLOAD: "video_promo_upload",
  FEATURED_LISTING: "featured_listing",
  HOMEPAGE_SPOTLIGHT: "homepage_spotlight",
  PRIORITY_SEARCH: "priority_search",
  SPONSORED_POSTS: "sponsored_posts",
  AUTO_RESPONDER: "auto_responder",
  BASIC_ANALYTICS: "basic_analytics",
  ADVANCED_ANALYTICS: "advanced_analytics",
  CUSTOMER_INSIGHTS: "customer_insights",
  PROMO_PUSH: "promo_push",
  BOOSTED_PRODUCT_SLOTS: "boosted_product_slots",
  CONTENT_UPLOAD_ASSISTANCE: "content_upload_assistance",
} as const;

export type FeatureName = (typeof FEATURES)[keyof typeof FEATURES];

export interface PlanLimits {
  maxProducts: number | null;
  maxFileSize: number; // bytes
  maxDuration: number | null; // seconds
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  basic: { maxProducts: 10, maxFileSize: 50 * 1024 * 1024, maxDuration: 300 },
  standard: { maxProducts: 30, maxFileSize: 200 * 1024 * 1024, maxDuration: 600 },
  premium: { maxProducts: 60, maxFileSize: 500 * 1024 * 1024, maxDuration: 900 },
  business: { maxProducts: null, maxFileSize: 1 * 1024 * 1024 * 1024, maxDuration: 1200 },
  enterprise: { maxProducts: null, maxFileSize: 3 * 1024 * 1024 * 1024, maxDuration: null },
};

export const PLAN_FEATURES: Record<PlanName, FeatureName[]> = {
  basic: [
    FEATURES.BASIC_ANALYTICS,
    FEATURES.BOOSTED_PRODUCT_SLOTS,
    FEATURES.CONTENT_UPLOAD_ASSISTANCE,
    FEATURES.VIDEO_PROMO_UPLOAD,
  ],
  standard: [
    FEATURES.BASIC_ANALYTICS,
    FEATURES.VIDEO_PROMO_UPLOAD,
    FEATURES.FEATURED_LISTING,
    FEATURES.PROMO_PUSH,
  ],
  premium: [
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.VIDEO_PROMO_UPLOAD,
    FEATURES.FEATURED_LISTING,
    FEATURES.HOMEPAGE_SPOTLIGHT,
    FEATURES.SPONSORED_POSTS,
    FEATURES.PROMO_PUSH,
    FEATURES.AUTO_RESPONDER,
  ],
  business: [
    FEATURES.BUSINESS_VERIFICATION,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.VIDEO_PROMO_UPLOAD,
    FEATURES.FEATURED_LISTING,
    FEATURES.HOMEPAGE_SPOTLIGHT,
    FEATURES.SPONSORED_POSTS,
    FEATURES.PROMO_PUSH,
    FEATURES.AUTO_RESPONDER,
    FEATURES.PRIORITY_SEARCH,
    FEATURES.BOOSTED_PRODUCT_SLOTS,
    FEATURES.CONTENT_UPLOAD_ASSISTANCE,
  ],
  enterprise: [
    FEATURES.BUSINESS_VERIFICATION,
    FEATURES.ADVANCED_ANALYTICS,
    FEATURES.VIDEO_PROMO_UPLOAD,
    FEATURES.FEATURED_LISTING,
    FEATURES.HOMEPAGE_SPOTLIGHT,
    FEATURES.SPONSORED_POSTS,
    FEATURES.PROMO_PUSH,
    FEATURES.AUTO_RESPONDER,
    FEATURES.PRIORITY_SEARCH,
    FEATURES.BOOSTED_PRODUCT_SLOTS,
    FEATURES.CONTENT_UPLOAD_ASSISTANCE,
  ],
};

export const PLAN_NAMES: Record<PlanName, string> = {
  basic: "Basic",
  standard: "Standard",
  premium: "Premium",
  business: "Business",
  enterprise: "Enterprise",
};

export const STORE_LIMITS = {
  buyer: 0,
  seller: 1,
  business_seller: 3,
  admin: Infinity,
} as const;
