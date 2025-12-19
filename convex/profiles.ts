import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const retrieveByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db.query("profiles").withIndex("byUserId", q => q.eq("userId", userId)).first();
  }
});