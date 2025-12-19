// convex/lib/auth.ts
import type { ClerkRole, ClerkPlan } from "../types/auth";

export function getRoleAndPlan(
  publicMetadata: unknown
): { role?: ClerkRole; plan?: ClerkPlan } {
  if (
    !publicMetadata ||
    typeof publicMetadata !== "object" ||
    Array.isArray(publicMetadata)
  ) {
    return {};
  }

  const meta = publicMetadata as Record<string, unknown>;

  const role =
    typeof meta.role === "string" ? (meta.role as ClerkRole) : undefined;

  const plan =
    typeof meta.plan === "string" ? (meta.plan as ClerkPlan) : undefined;

  return { role, plan };
}