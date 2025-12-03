import { v } from "convex/values";
import { mutation } from "./_generated/server";

/**
 * Ensure a profile exists for a given Clerk user ID
 */
export const syncProfile = mutation({
  args: {
    userId: v.string(),
    publicMetadata: v.optional(v.object({})), // optional Clerk metadata
  },
  handler: async (ctx, { userId, publicMetadata }) => {
    const existingProfile = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", userId))
      .first();

    if (!existingProfile) {
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
    } else {
      await ctx.db.patch(existingProfile._id, {
        aiPersona: existingProfile.aiPersona,
      });
    }
  },
});