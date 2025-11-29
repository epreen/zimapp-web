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
  }).index("byEmail", ["email"])
    .index("byRole", ["role"])
    .index("byCreatedAt", ["createdAt"]),

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
  }).index("byUserId", ["userId"])
    .index("byCategory", ["category"])
    .index("byVerificationStatus", ["verificationStatus"])
    .index("byCreatedAt", ["createdAt"]),

  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),  
    optimizedDescription: v.optional(v.string()),
    price: v.number(),
    images: v.array(v.string()),
    aiKeywords: v.optional(v.array(v.string())),
    aiCategory: v.optional(v.string()),
    rating: v.optional(v.array(v.number())),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.string(), // "approved" | "pending" | "rejected"
    createdAt: v.number(),
  }).index("byStoreId", ["storeId"])
    .index("byModerationStatus", ["moderationStatus"])
    .index("byPrice", ["price"])
    .index("byCreatedAt", ["createdAt"]),

  videos: defineTable({
    storeId: v.id("stores"),
    url: v.string(),
    transcript: v.optional(v.string()),
    aiTags: v.optional(v.array(v.string())),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.string(),
    createdAt: v.number(),
  }).index("byStoreId", ["storeId"])
    .index("byModerationStatus", ["moderationStatus"])
    .index("byCreatedAt", ["createdAt"]),

  ratings: defineTable({
    productId: v.id("products"),
    userId: v.id("users"),
    rating: v.number(),
    review: v.string(),
    createdAt: v.number(),
  }).index("byProductId", ["productId"])
    .index("byUserId", ["userId"])
    .index("byCreatedAt", ["createdAt"]),

  coupons: defineTable({
    code: v.string(),
    discount: v.number(),
    description: v.string(),
    expiresAt: v.number(),
    aiTargetAudience: v.optional(v.array(v.string())),
  }).index("byCode", ["code"])
    .index("byExpiresAt", ["expiresAt"]),

  messages: defineTable({
    conversationId: v.string(),
    senderId: v.id("users"),
    receiverId: v.id("users"),
    message: v.string(),
    isAI: v.boolean(),
    createdAt: v.number(),
  }).index("byConversationId", ["conversationId"])
    .index("bySenderId", ["senderId"])
    .index("byReceiverId", ["receiverId"])
    .index("byCreatedAt", ["createdAt"]),

  moderationLogs: defineTable({
    entity: v.string(), // product or video
    entityId: v.string(),
    issues: v.array(v.string()),
    status: v.string(),
    createdAt: v.number(),
  }).index("byEntity", ["entity"])
    .index("byEntityId", ["entityId"])
    .index("byStatus", ["status"])
    .index("byCreatedAt", ["createdAt"]),
});