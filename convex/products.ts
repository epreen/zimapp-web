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

export const retrieve = query({
  args: {
    userId: v.string(),
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const numItems = args.paginationOpts?.numItems ?? 20;

    // Use index for fast filtering by userId
    // order("desc") sorts by _creationTime descending (newest first)
    // Filter out soft-deleted projects
    const query = ctx.db
      .query("products")
      .order("desc");

    // Built-in pagination with cursor support
    return await query.paginate({
      numItems,
      cursor: args.paginationOpts?.cursor ?? null,
    });
  },
});

export const retrieveByStore = query({
  args: {
    storeId: v.id("stores"), // <--- add this
    paginationOpts: v.optional(
      v.object({
        numItems: v.number(),
        cursor: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const numItems = args.paginationOpts?.numItems ?? 20;

    const query = ctx.db
      .query("products")
      .withIndex("byStoreId", (q) => q.eq("storeId", args.storeId))
      .order("desc");

    return await query.paginate({
      numItems,
      cursor: args.paginationOpts?.cursor ?? null,
    });
  },
});