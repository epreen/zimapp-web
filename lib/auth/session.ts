import { auth } from "@clerk/nextjs/server";
import { Plans, Roles, PLAN_FEATURES, PLAN_LIMITS } from "@/lib/tier-config";
import { getStoreLimit } from "@/lib/store-limit";

export async function getUserContext() {
  const { sessionClaims } = await auth();
  const metadata = sessionClaims?.metadata ?? {};

  const role = (metadata.role ?? "customer") as Roles;
  const plan = (metadata.plan ?? "free") as Plans;

  return {
    role,
    plan,
    limits: PLAN_LIMITS[plan],
    features: PLAN_FEATURES[plan],
    storeLimit: getStoreLimit(plan),
  };
}