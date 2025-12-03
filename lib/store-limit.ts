// lib/store-limit.ts
import { PlanName } from "./tier-config";

export function getStoreLimit(plan: PlanName): number {
  switch (plan) {
    case "standard":
      return 1;
    case "premium":
      return 3;
    case "business":
      return 10;
    case "enterprise":
      return 999;
    default:
      return 0;
  }
}

export function canCreateStore(current: number, limit: number) {
  return current < limit;
}