import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    storeId: v.id("stores"),
    name: v.string(),
    description: v.string(),
    price: v.number(),
    images: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("products", {
      storeId: args.storeId,
      name: args.name,
      description: args.description,
      price: args.price,
      images: args.images,
      generatedDescription: undefined,
      keywords: [],
      category: undefined,
      ratings: [],
      engagementScore: 0,
      moderationStatus: "pending",
      createdAt: Date.now(),
    });    
  },
});

export const update = mutation({
  args: {
    id: v.id("products"),
    generatedDescription: v.optional(v.string()),
    keywords: v.optional(v.array(v.string())),
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      generatedDescription: args.generatedDescription,
      keywords: args.keywords,
      category: args.category,
    });
  },
});

export const countByOwner = query({
    args: { ownerId: v.string() },
    handler: async (ctx, args) => {
        return (await ctx.db.query("products").collect()).length;
    },
});

export const retrieve = query({
  args: {
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