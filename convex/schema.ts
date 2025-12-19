// convex/schema.ts

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  profiles: defineTable({
    userId: v.string(), // Clerk user ID
    preferences: v.optional(v.array(v.string())),
    persona: v.optional(v.string()),
    about: v.optional(v.string()),
    bio: v.optional(v.string()),
    createdAt: v.number(),
  }).index("byUserId", ["userId"]),

  stores: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    logo: v.optional(v.string()),
    category: v.string(),
    isActive: v.boolean(),
    verificationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected")
      )), // "pending" | "verified" | "rejected"
    healthScore: v.optional(v.number()),
    createdAt: v.number(),
  }).index("byUserId", ["userId"])
    .index("byCategory", ["category"])
    .index("byVerificationStatus", ["verificationStatus"])
    .index("byCreatedAt", ["createdAt"]),

  products: defineTable({
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),  
    generatedDescription: v.optional(v.string()),
    price: v.number(),
    images: v.array(v.string()),
    keywords: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
    ratings: v.optional(
      v.array(
        v.object({
          userId: v.string(),
          score: v.number(),
          review: v.string(),
          timestamp: v.number(),
        })
      )
    ),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("approved"),
        v.literal("rejected")
      )), // "approved" | "pending" | "rejected"
    createdAt: v.number(),
  }).index("byStoreId", ["storeId"])
    .index("byModerationStatus", ["moderationStatus"])
    .index("byPrice", ["price"]),

  videos: defineTable({
    storeId: v.id("stores"),
    url: v.string(),
    transcript: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.string(),
    uploadedAt: v.number(),
  }).index("byStoreId", ["storeId"])
    .index("byModerationStatus", ["moderationStatus"])
    .index("byUploadedAt", ["uploadedAt"]),

  coupons: defineTable({
    code: v.string(),
    discount: v.number(),
    description: v.string(),
    expiresAt: v.number(),
    audience: v.optional(v.array(v.string())),
  }).index("byCode", ["code"])
    .index("byExpiresAt", ["expiresAt"]),

  chats: defineTable({
    createdAt: v.number(),
    isArchived: v.boolean(),
    deletedAt: v.optional(v.number())
  }),

  messages: defineTable({
    chatId: v.string(),
    senderId: v.string(),
    receiverId: v.string(),
    message: v.string(),
    isGenerated: v.boolean(),
    createdAt: v.number(),
  }).index("byChatId", ["chatId"])
    .index("bySenderId", ["senderId"])
    .index("byReceiverId", ["receiverId"])
    .index("byCreatedAt", ["createdAt"]),

  moderationLogs: defineTable({
    entity: v.string(), // product or video
    entityId: v.string(),
    issues: v.array(v.string()),
    status: v.string(),
    timestamp: v.number(),
  }).index("byEntity", ["entity"])
    .index("byEntityId", ["entityId"])
    .index("byStatus", ["status"])
    .index("byTimestamp", ["timestamp"]),
});