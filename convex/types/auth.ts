// convex/types/auth.ts
export type ClerkRole =
  | "admin"
  | "customer"
  | "business"
  | "verified_business";

export type ClerkPlan =
  | "free"
  | "standard"
  | "premium"
  | "business"
  | "enterprise";