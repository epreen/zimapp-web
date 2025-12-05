// convex/syncProfile.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const syncProfile = mutation({
  args: {
    userId: v.string(),
    publicMetadata: v.optional(v.object({})),
  },

  handler: async (ctx, { userId, publicMetadata }) => {
    const existing = await ctx.db
      .query("profiles")
      .withIndex("byUserId", q => q.eq("userId", userId))
      .first();

    // Create if missing
    if (!existing) {
      await ctx.db.insert("profiles", {
        userId,
        role: "buyer",
        hasPlan: false,
        plan: "free",
        verificationStatus: "pending",
        createdAt: Date.now(),
        preferences: [],
        aiPersona: undefined,
        subscribedSince: undefined,
        verifiedAt: undefined,
      });
      return;
    }

    // Update always — keeps profile fresh over time
    await ctx.db.patch(existing._id, {
      // You decide what fields mirror Clerk / metadata
      aiPersona: existing.aiPersona ?? undefined,
    });
  },
});