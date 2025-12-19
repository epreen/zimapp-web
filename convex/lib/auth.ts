// convex/lib/auth.ts
import { Plans, Roles } from "../../lib/tier-config";

export function getRoleAndPlan(
  publicMetadata: unknown
): { role?: Roles; plan?: Plans } {
  if (
    !publicMetadata ||
    typeof publicMetadata !== "object" ||
    Array.isArray(publicMetadata)
  ) {
    return {};
  }

  const meta = publicMetadata as Record<string, unknown>;

  const role =
    typeof meta.role === "string" ? (meta.role as Roles) : undefined;

  const plan =
    typeof meta.plan === "string" ? (meta.plan as Plans) : undefined;

  return { role, plan };
}