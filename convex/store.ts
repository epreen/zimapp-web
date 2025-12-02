// convex/stores.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { STORE_LIMITS } from "../lib/tier-config";

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    logo: v.optional(v.string()),
    category: v.string(),
    isActive: v.boolean(),
    verificationStatus: v.string(),
  },
  handler: async (ctx, args) => {

    const userProfiles = await ctx.db
      .query("profiles")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();

    const sellerStores = await ctx.db
      .query("stores")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .collect();

    const userProfile = userProfiles[0];
    if (!userProfile) throw new Error("Profile not found.");      

    const maxStores = STORE_LIMITS[userProfile.role];

    if (sellerStores.length >= maxStores) {
      throw new Error(
        `Your account allows a maximum of ${maxStores} store(s). Upgrade to create more.`
      );
    }

    if (userProfile.role !== "seller" || !userProfile.hasPaidSellerFee) {
      throw new Error(
        "Only verified sellers may create stores and sell their products."
      );
    }

    return await ctx.db.insert("stores", {
      userId: args.userId,
      name: args.name,
      description: args.description,
      category: args.category,
      logo: args.logo,
      isActive: args.isActive,
      verificationStatus: args.verificationStatus,
      createdAt: Date.now(),
    });
  },
});

/* -------------------------------------------------------
   Retrieve one store by ID
------------------------------------------------------- */
export const get = query({
  args: { id: v.id("stores") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/* -------------------------------------------------------
   All stores owned by a user
------------------------------------------------------- */
export const retrieveByUser = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("stores")
      .withIndex("byUserId", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();
  },
});

/* -------------------------------------------------------
   Paginated list of all stores
------------------------------------------------------- */
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

    const query = ctx.db
      .query("stores")
      .withIndex("byCreatedAt")
      .order("desc");

    return await query.paginate({
      numItems,
      cursor: args.paginationOpts?.cursor ?? null,
    });
  },
});

/* -------------------------------------------------------
   Filter by category
------------------------------------------------------- */
export const retrieveByCategory = query({
  args: {
    category: v.string(),
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
      .query("stores")
      .withIndex("byCategory", (q) => q.eq("category", args.category))
      .order("desc");

    return await query.paginate({
      numItems,
      cursor: args.paginationOpts?.cursor ?? null,
    });
  },
});

/* -------------------------------------------------------
   Update store info
------------------------------------------------------- */
export const update = mutation({
  args: {
    id: v.id("stores"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    logo: v.optional(v.string()),
    category: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    verificationStatus: v.optional(v.string()),
    aiHealthScore: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});