// lib/schemas.ts
import { z } from "zod";

/* ---------- Per-step schemas ---------- */

export const businessStepSchema = z.object({
  businessName: z.string().min(2, "Business name is required"),
  businessDescription: z.string().optional(),
  businessType: z.string().min(1, "Select a business type"),
  businessAddress: z.string().optional(),
});

export const contactStepSchema = z.object({
  businessEmail: z.string().email("Invalid email").optional(),
  businessPhone: z.string().optional(),
  businessTax: z.string().optional(),
  businessWebsite: z.string().url().optional(),
});

export const productStepSchema = z.object({
  productsCategory: z.string().min(1, "Select a category"),
  estimatedMonthlyRevenue: z.string().min(1, "Select revenue"),
});

/* ---------- Full application schema (optional) ---------- */

export const applicationSchema = z.object({
  business: businessStepSchema,
  contact: contactStepSchema,
  product: productStepSchema,
  status: z.enum(["draft", "pending", "approved", "rejected"]).optional(),
  appliedAt: z.string().optional(),
});

export type BusinessStepValues = z.infer<typeof businessStepSchema>;
export type ContactStepValues = z.infer<typeof contactStepSchema>;
export type ProductStepValues = z.infer<typeof productStepSchema>;
export type ApplicationValues = z.infer<typeof applicationSchema>;