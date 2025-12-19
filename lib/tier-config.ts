export type Roles =
  | "admin"
  | "customer"
  | "business"
  | "verified_business"

export type Plans =
  | "free"
  | "standard"
  | "premium"
  | "business"
  | "enterprise";

/**
 * Unified feature list — all features used across the entire system.
 */
export const FEATURES = {
  // original tier-config features
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

  // features used in feature-job-map
  AI_MODERATION: "ai_moderation",
  LISTING_ENHANCER_BASIC: "listing_enhancer_basic",
  LISTING_ENHANCER_FULL: "listing_enhancer_full",
  VIDEO_AUTO_OPTIMIZATION: "video_auto_optimization",
  ANALYTICS_MONTHLY: "analytics_monthly",
  ANALYTICS_BIWEEKLY: "analytics_biweekly",
  ANALYTICS_WEEKLY_DEEP: "analytics_weekly_deep",
  SMART_RECOMMENDATIONS: "smart_recommendations",
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

export type Feature = (typeof FEATURES)[keyof typeof FEATURES];

export interface Limits {
  maxProducts: number | null;
  maxFileSize: number; // bytes
  maxDuration: number | null; // seconds
}

export const PLAN_LIMITS: Record<Plans, Limits> = {
  free: { maxProducts: 10, maxFileSize: 50 * 1024 * 1024, maxDuration: 300 },
  standard: { maxProducts: 30, maxFileSize: 200 * 1024 * 1024, maxDuration: 600 },
  premium: { maxProducts: 60, maxFileSize: 500 * 1024 * 1024, maxDuration: 900 },
  business: { maxProducts: null, maxFileSize: 1 * 1024 * 1024 * 1024, maxDuration: 1200 },
  enterprise: { maxProducts: null, maxFileSize: 3 * 1024 * 1024 * 1024, maxDuration: null },
};

export const PLAN_FEATURES: Record<Plans, Feature[]> = {
  free: [
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

export const PLAN_NAMES: Record<Plans, string> = {
  free: "Basic",
  standard: "Standard",
  premium: "Premium",
  business: "Business",
  enterprise: "Enterprise",
};

export const STORE_LIMITS = {
  free: 0,
  standard: 1,
  premium: 3,
  business: 10,
  enterprise: 99,
  partner: Infinity,
} as const;
