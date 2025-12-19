import { Feature } from "@/lib/tier-config";

export const JOBS = {
  GENERATE_LISTING_ENHANCEMENT: "generateListingEnhancement",
  PROCESS_VIDEO_UPLOAD: "processVideoUpload",
  SEND_AUTO_RESPONDER: "sendAutoResponder",
  GENERATE_ANALYTICS_REPORT: "generateAnalyticsReport",
  RUN_RECOMMENDATION_JOB: "runRecommendationJob",
  VERIFY_BUSINESS: "verifyBusiness",
  GENERATE_PROMO_BANNER: "generatePromoBanner",
  APPLY_SMART_COUPONS: "applySmartCoupons",
  RUN_ONBOARDING_COACH: "runOnboardingCoach",
  GENERATE_AI_VIDEO: "generateAIVideo",
  BOOST_RANKING: "boostRanking",
  SEND_PROMO_PUSH: "sendPromoPush",
} as const;

export type JobName = (typeof JOBS)[keyof typeof JOBS];

export const FEATURE_TO_JOB_MAP: Record<Feature, JobName[]> = {
  // original tier-config features
  business_verification: [JOBS.VERIFY_BUSINESS],
  video_promo_upload: [JOBS.PROCESS_VIDEO_UPLOAD],
  featured_listing: [],
  homepage_spotlight: [],
  priority_search: [],
  sponsored_posts: [],
  auto_responder: [JOBS.SEND_AUTO_RESPONDER],
  basic_analytics: [JOBS.GENERATE_ANALYTICS_REPORT],
  advanced_analytics: [JOBS.GENERATE_ANALYTICS_REPORT],
  customer_insights: [JOBS.GENERATE_ANALYTICS_REPORT],
  promo_push: [JOBS.SEND_PROMO_PUSH],
  boosted_product_slots: [],
  content_upload_assistance: [],

  // Option B expanded features
  ai_moderation: [JOBS.PROCESS_VIDEO_UPLOAD],
  listing_enhancer_basic: [JOBS.GENERATE_LISTING_ENHANCEMENT],
  listing_enhancer_full: [JOBS.GENERATE_LISTING_ENHANCEMENT],
  video_auto_optimization: [JOBS.PROCESS_VIDEO_UPLOAD],
  analytics_monthly: [JOBS.GENERATE_ANALYTICS_REPORT],
  analytics_biweekly: [JOBS.GENERATE_ANALYTICS_REPORT],
  analytics_weekly_deep: [JOBS.GENERATE_ANALYTICS_REPORT],
  smart_recommendations: [JOBS.RUN_RECOMMENDATION_JOB],
  promo_auto_generator: [JOBS.GENERATE_PROMO_BANNER],
  smart_coupons: [JOBS.APPLY_SMART_COUPONS],
  smart_coupons_advanced: [JOBS.APPLY_SMART_COUPONS],
  seller_onboarding_coach: [JOBS.RUN_ONBOARDING_COACH],
  ai_video_generation: [JOBS.GENERATE_AI_VIDEO],
  ai_video_generation_custom: [JOBS.GENERATE_AI_VIDEO],
  sponsored_ranking_medium: [JOBS.BOOST_RANKING],
  sponsored_ranking_high: [JOBS.BOOST_RANKING],
  sponsored_ranking_top: [JOBS.BOOST_RANKING],
  sponsored_ranking_dedicated: [JOBS.BOOST_RANKING],

  product_upload_limit_10: [],
  product_upload_limit_30: [],
  product_upload_limit_60: [],
  product_upload_unlimited: [],

  promo_push_1: [JOBS.SEND_PROMO_PUSH],
  promo_push_3: [JOBS.SEND_PROMO_PUSH],
  promo_push_5: [JOBS.SEND_PROMO_PUSH],
  promo_push_custom: [JOBS.SEND_PROMO_PUSH],

  dedicated_account_manager: [],
  priority_support: [],
};