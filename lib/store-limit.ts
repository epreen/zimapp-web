// lib/store-limit.ts
import { Plans } from "./tier-config";

export function getStoreLimit(plan: Plans): number {
  switch (plan) {
    case "standard":
      return 1;
    case "premium":
      return 3;
    case "business":
      return 10;
    case "enterprise":
      return 99;
    default:
      return 0;
  }
}

export function canCreateStore(current: number, limit: number) {
  return current < limit;
}