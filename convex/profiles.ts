import { v } from "convex/values";
import { mutation } from "./_generated/server";

/* -----------------------------
   Upgrade a user to a seller
----------------------------- */
export const upgradeToSeller = mutation({
  args: {
    userId: v.string(),          // Clerk user ID
    paymentRef: v.string(),      // e.g., Stripe, PayPal, Airtel Money
  },

  handler: async (ctx, args) => {
    // Find the profile by userId
    const profileDoc = await ctx.db.query("profiles")
      .filter((p) => p.eq(p.field("userId"), undefined))
      .first();

    if (!profileDoc) throw new Error("Profile not found");

    const profileId = profileDoc._id; // This is the Convex-generated Id<"profiles">

    if (profileDoc.role === "seller") {
      return "User is already a seller.";
    }

    await ctx.db.patch(profileId, {
      role: "seller",
      hasPaidSellerFee: true,
      sellerSince: Date.now(),
      verificationStatus: "pending",
    });

    return "Seller upgrade complete!";
  },
});

/* -----------------------------
   Verify a seller (admin only)
----------------------------- */
export const verifySeller = mutation({
  args: {
    userId: v.string(),
    status: v.string(), // "verified" or "rejected"
  },

  handler: async (ctx, args) => {
    const admin = await ctx.auth.getUserIdentity();
    if (!admin || admin.role !== "admin") {
      throw new Error("Only admins may verify sellers.");
    }

    const profileDoc = await ctx.db.query("profiles")
      .filter((p) => p.eq(p.field("userId"), undefined))
      .first();

    if (!profileDoc) throw new Error("Profile not found");

    const profileId = profileDoc._id;

    await ctx.db.patch(profileId, {
      verificationStatus: args.status,
      verifiedAt: args.status === "verified" ? Date.now() : undefined,
    });

    return `Seller ${args.status}`;
  },
});