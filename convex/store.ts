// convex/stores.ts

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { STORE_LIMITS } from "../lib/tier-config";
import { getRoleAndPlan } from "./lib/auth";

export const create = mutation({
  args: {
    userId: v.string(),
    name: v.string(),
    description: v.string(),
    category: v.string(),
    logo: v.optional(v.string()),
    isActive: v.boolean(),
    verificationStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("verified"),
        v.literal("rejected")
      ))
  },

  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const { role, plan } = getRoleAndPlan(identity.publicMetadata);

    if (role == "customer") {
      throw new Error("Only business accounts can create stores");
    }

    const safePlan = plan ?? "free";
    const maxStores = STORE_LIMITS[safePlan];

    const existingStores = await ctx.db
      .query("stores")
      .withIndex("byUserId", q => q.eq("userId", identity.subject))
      .collect();

    if (existingStores.length >= maxStores) {
      throw new Error(`Plan limit reached (${maxStores} stores)`);
    }

    return await ctx.db.insert("stores", {
      userId: identity.subject,
      name: args.name,
      description: args.description,
      logo: args.logo,
      category: args.category,
      isActive: true,
      verificationStatus: "pending",
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