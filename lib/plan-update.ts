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
    const limits = PLAN_LIMITS[plan] ?? {};
    const features = PLAN_FEATURES[plan] ?? {};

    try {
        await clerk.users.updateUserMetadata(userId, {
            publicMetadata: {
            role,
            plan,
            limits,
            features,
            storeLimit,
            },
        });
    } catch (error) {
        console.error(`Failed to update user plan for userId ${userId}:`, error);
        throw new Error(`Failed to update user plan: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}