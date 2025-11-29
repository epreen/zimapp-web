import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
    args: {
      name: v.string(),
      price: v.number(),
      description: (v.string()),
      storeId: v.id("stores"), // enforce proper type
      images: v.array(v.string()), // let the client send this
    },
    handler: async (ctx, args) => {
      return await ctx.db.insert("products", {
        ...args,
        optimizedDescription: undefined,
        aiKeywords: [],
        aiCategory: undefined,
        engagementScore: 0,
        moderationStatus: "pending",
        createdAt: Date.now(),
      });
    },
});  

export const countByOwner = query({
    args: { ownerId: v.string() },
    handler: async (ctx, args) => {
        return (await ctx.db.query("products").collect()).length;
    },
});

export const update = mutation({
    args: {
        id: v.id("products"),
        optimizedDescription: v.optional(v.string()),
        aiKeywords: v.optional(v.array(v.string())),
        aiCategory: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
        optimizedDescription: args.optimizedDescription,
        aiKeywords: args.aiKeywords,
        aiCategory: args.aiCategory,
        });
    },
});