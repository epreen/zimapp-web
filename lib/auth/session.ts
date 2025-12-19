import { auth } from "@clerk/nextjs/server";
import { Plans, Roles, PLAN_FEATURES, PLAN_LIMITS } from "@/lib/tier-config";
import { getStoreLimit } from "@/lib/store-limit";

function isValidRole(value: unknown): value is Roles {
  return typeof value === 'string' && ['customer', 'admin', /* other valid roles */].includes(value);
}

function isValidPlan(value: unknown): value is Plans {
  return typeof value === 'string' && Object.keys(PLAN_LIMITS).includes(value);
}

export async function getUserContext() {
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata ?? {};

  const role = isValidRole(metadata.role) ? metadata.role : "customer";
  const plan = isValidPlan(metadata.plan) ? metadata.plan : "free";

  return {
    role,
    plan,
    limits: PLAN_LIMITS[plan],
    features: PLAN_FEATURES[plan],
    storeLimit: getStoreLimit(plan),
  };
}