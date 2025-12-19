// lib/plan-update.ts
import { clerkClient } from "@clerk/nextjs/server";
import { Roles, Plans, PLAN_FEATURES, PLAN_LIMITS, STORE_LIMITS } from "./tier-config";

export async function updateUserPlan(userId: string, plan: Plans) {
    const role: Roles = 
        plan === "business" || plan === "enterprise" ? "verified_business" :
        plan === "standard" || plan === "premium" ? "business" :
        "customer";  

    const clerk = await clerkClient();

    const storeLimit = STORE_LIMITS[plan] ?? 0; // fallback if plan key is missing

    await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
        role,
        plan,
        limits: PLAN_LIMITS[plan],
        features: PLAN_FEATURES[plan],
        storeLimit,
        },
    });
}