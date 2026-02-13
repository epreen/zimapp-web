import * as z from "zod";

export const storeTypeSchema = z.object({
  name: z.string().min(1, "Store name is required"),
  username: z.string().min(1, "Username is required"),
  description: z.string().optional(),
  email: z.string().email("Invalid email").optional(),
  contact: z.string().min(1, "Contact is required"),
});
