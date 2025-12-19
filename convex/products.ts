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
    // Validate price
    if (args.price <= 0) {
      throw new Error("Price must be greater than 0");
    }
    
    // Validate images
    if (args.images.length === 0) {
      throw new Error("At least one image is required");
    }
    
    // Verify store exists
    const store = await ctx.db.get(args.storeId);
    if (!store) {
      throw new Error("Store not found");
    }
    
    // TODO: Add authorization check
    // Verify the current user owns or can create products for this store
    
    return await ctx.db.insert("products", {
      storeId: args.storeId,
      name: args.name,
      description: args.description,
      price: args.price,
      images: args.images,
      keywords: [],
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
    // Verify product exists
    const product = await ctx.db.get(args.id);
    
    if (!product) {
      throw new Error("Product not found");
    }
    
    // TODO: Add authorization check
    // Verify the current user owns this product's store
    
    // Build update object, excluding undefined values
    const updates: Record<string, any> = {};

    if (args.generatedDescription !== undefined) {
      updates.generatedDescription = args.generatedDescription;
    }

    if (args.keywords !== undefined) {
      updates.keywords = args.keywords;
    }

    if (args.category !== undefined) {
      updates.category = args.category;
    }

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