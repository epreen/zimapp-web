// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.string(), // "buyer" | "seller" | "admin"
    preferences: v.optional(v.array(v.string())),
    aiPersona: v.optional(v.string()),
    createdAt: v.number(),
  }),

  stores: defineTable({
    userId: v.id("users"),
    name: v.string(),
    description: v.string(),
    logo: v.optional(v.string()),
    category: v.string(),
    isActive: v.boolean(),
    verificationStatus: v.string(), // "pending" | "verified" | "rejected"
    aiHealthScore: v.optional(v.number()),
    createdAt: v.number(),
  }),

  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    optimizedDescription: v.optional(v.string()),
    price: v.number(),
    images: v.array(v.string()),
    aiKeywords: v.optional(v.array(v.string())),
    aiCategory: v.optional(v.string()),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.string(), // "approved" | "pending" | "rejected"
    createdAt: v.number(),
  }),

  videos: defineTable({
    storeId: v.id("stores"),
    url: v.string(),
    transcript: v.optional(v.string()),
    aiTags: v.optional(v.array(v.string())),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.string(),
    createdAt: v.number(),
  }),

  ratings: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    review: v.string(),
    createdAt: v.number(),
  }),

  coupons: defineTable({
    code: v.string(),
    discount: v.number(),
    description: v.string(),
    expiresAt: v.number(),
    aiTargetAudience: v.optional(v.array(v.string())),
  }),

  messages: defineTable({
    conversationId: v.string(),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    message: v.string(),
    isAI: v.boolean(),
    createdAt: v.number(),
  }),

  moderationLogs: defineTable({
    entity: v.string(), // product or video
    entityId: v.string(),
    issues: v.array(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }),
});