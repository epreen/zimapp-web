// /lib/tier-config.ts
export type PlanName = "free" | "standard" | "premium" | "business" | "enterprise";

/**
 * Feature constants - canonical feature identifiers used across the app and Clerk.
 */
export const FEATURES = {
  AI_MODERATION: "ai_moderation",
  LISTING_ENHANCER_BASIC: "listing_enhancer_basic",
  LISTING_ENHANCER_FULL: "listing_enhancer_full",
  VIDEO_AUTO_OPTIMIZATION: "video_auto_optimization",
  AUTO_RESPONDER: "auto_responder",
  ANALYTICS_BASIC: "analytics_basic",
  ANALYTICS_MONTHLY: "analytics_monthly",
  ANALYTICS_BIWEEKLY: "analytics_biweekly",
  ANALYTICS_WEEKLY_DEEP: "analytics_weekly_deep",
  SMART_RECOMMENDATIONS: "smart_recommendations",
  BUSINESS_VERIFICATION: "business_verification",
  PROMO_AUTO_GENERATOR: "promo_auto_generator",
  SMART_COUPONS: "smart_coupons",
  SMART_COUPONS_ADVANCED: "smart_coupons_advanced",
  SELLER_ONBOARDING_COACH: "seller_onboarding_coach",
  AI_VIDEO_GENERATION: "ai_video_generation",
  AI_VIDEO_GENERATION_CUSTOM: "ai_video_generation_custom",
  SPONSORED_RANKING_MEDIUM: "sponsored_ranking_medium",
  SPONSORED_RANKING_HIGH: "sponsored_ranking_high",
  SPONSORED_RANKING_TOP: "sponsored_ranking_top",
  SPONSORED_RANKING_DEDICATED: "sponsored_ranking_dedicated",
  PRODUCT_UPLOAD_LIMIT_10: "product_upload_limit_10",
  PRODUCT_UPLOAD_LIMIT_30: "product_upload_limit_30",
  PRODUCT_UPLOAD_LIMIT_60: "product_upload_limit_60",
  PRODUCT_UPLOAD_UNLIMITED: "product_upload_unlimited",
  PROMO_PUSH_1: "promo_push_1",
  PROMO_PUSH_3: "promo_push_3",
  PROMO_PUSH_5: "promo_push_5",
  PROMO_PUSH_CUSTOM: "promo_push_custom",
  DEDICATED_ACCOUNT_MANAGER: "dedicated_account_manager",
  PRIORITY_SUPPORT: "priority_support",
} as const;

export type FeatureName = (typeof FEATURES)[keyof typeof FEATURES];

/**
 * Plan limits (bytes and seconds). Keep in sync with your billing/Clerk UI.
 */
export interface PlanLimits {
  maxProjects: number | null;
  maxFileSize: number;
  maxDuration: number | null;
}

export const PLAN_LIMITS: Record<PlanName, PlanLimits> = {
  free: { maxProjects: 3, maxFileSize: 10 * 1024 * 1024, maxDuration: 600 },
  standard: { maxProjects: 30, maxFileSize: 200 * 1024 * 1024, maxDuration: 7200 },
  premium: { maxProjects: 30, maxFileSize: 200 * 1024 * 1024, maxDuration: 7200 },
  business: { maxProjects: null, maxFileSize: 3 * 1024 * 1024 * 1024, maxDuration: null },
  enterprise: { maxProjects: null, maxFileSize: 3 * 1024 * 1024 * 1024, maxDuration: null },
};

/**
 * Plan -> Features mapping
 *
 * Map Clerk plan names to the list of feature identifiers.
 *
 * Note: plan names must match what you configure in Clerk (or map them when checking).
 */
export const PLAN_FEATURES: Record<PlanName, FeatureName[]> = {
  free: [
    FEATURES.AI_MODERATION,
    FEATURES.LISTING_ENHANCER_BASIC,
    FEATURES.SMART_RECOMMENDATIONS,
    FEATURES.PRODUCT_UPLOAD_LIMIT_10,
  ],
  standard: [
    FEATURES.AI_MODERATION,
    FEATURES.LISTING_ENHANCER_FULL,
    FEATURES.VIDEO_AUTO_OPTIMIZATION,
    FEATURES.AUTO_RESPONDER,
    FEATURES.ANALYTICS_BASIC,
    FEATURES.SMART_RECOMMENDATIONS,
    FEATURES.SPONSORED_RANKING_MEDIUM,
    FEATURES.PRODUCT_UPLOAD_LIMIT_30,
    FEATURES.PROMO_PUSH_1,
  ],
  premium: [
    FEATURES.AI_MODERATION,
    FEATURES.LISTING_ENHANCER_FULL,
    FEATURES.VIDEO_AUTO_OPTIMIZATION,
    FEATURES.AUTO_RESPONDER,
    FEATURES.ANALYTICS_MONTHLY,
    FEATURES.SMART_RECOMMENDATIONS,
    FEATURES.BUSINESS_VERIFICATION,
    FEATURES.PROMO_AUTO_GENERATOR,
    FEATURES.SMART_COUPONS,
    FEATURES.SPONSORED_RANKING_HIGH,
    FEATURES.PRODUCT_UPLOAD_LIMIT_60,
    FEATURES.PROMO_PUSH_3,
  ],
  business: [
    FEATURES.AI_MODERATION,
    FEATURES.LISTING_ENHANCER_FULL,
    FEATURES.VIDEO_AUTO_OPTIMIZATION,
    FEATURES.AUTO_RESPONDER,
    FEATURES.ANALYTICS_BIWEEKLY,
    FEATURES.SMART_RECOMMENDATIONS,
    FEATURES.BUSINESS_VERIFICATION,
    FEATURES.PROMO_AUTO_GENERATOR,
    FEATURES.SMART_COUPONS_ADVANCED,
    FEATURES.SELLER_ONBOARDING_COACH,
    FEATURES.AI_VIDEO_GENERATION,
    FEATURES.SPONSORED_RANKING_TOP,
    FEATURES.PRODUCT_UPLOAD_UNLIMITED,
    FEATURES.PROMO_PUSH_5,
  ],
  enterprise: [
    FEATURES.AI_MODERATION,
    FEATURES.LISTING_ENHANCER_FULL,
    FEATURES.VIDEO_AUTO_OPTIMIZATION,
    FEATURES.AUTO_RESPONDER,
    FEATURES.ANALYTICS_WEEKLY_DEEP,
    FEATURES.SMART_RECOMMENDATIONS,
    FEATURES.BUSINESS_VERIFICATION,
    FEATURES.PROMO_AUTO_GENERATOR,
    FEATURES.SMART_COUPONS_ADVANCED,
    FEATURES.SELLER_ONBOARDING_COACH,
    FEATURES.AI_VIDEO_GENERATION_CUSTOM,
    FEATURES.SPONSORED_RANKING_DEDICATED,
    FEATURES.PRODUCT_UPLOAD_UNLIMITED,
    FEATURES.PROMO_PUSH_CUSTOM,
    FEATURES.DEDICATED_ACCOUNT_MANAGER,
    FEATURES.PRIORITY_SUPPORT,
  ],
};

export const PLAN_NAMES: Record<PlanName, string> = {
  free: "Free",
  standard: "Standard",
  premium: "Premium",
  business: "Business",
  enterprise: "Enterprise",
};