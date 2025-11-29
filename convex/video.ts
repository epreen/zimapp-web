import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const insert = mutation({
  args: {
    url: v.string(),
    storeId: v.id("stores"),  // ← FIXED
    moderationStatus: v.string(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("videos", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("videos"),
    transcript: v.optional(v.string()),
    aiTags: v.optional(v.array(v.string())),
    engagementScore: v.optional(v.number()),
    moderationStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      transcript: args.transcript,
      aiTags: args.aiTags,
      engagementScore: args.engagementScore,
      moderationStatus: args.moderationStatus,
    });
  },
});
