// app/api/derive-store-metadata/route.ts
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const StoreMetadataSchema = z.object({
  categories: z.array(z.string()),
  types: z.array(z.string()),
});

export async function POST(req: Request) {
  const { keywords } = await req.json();

  const result = await generateObject({
    model: openai("gpt-4.1-mini"),
    schema: StoreMetadataSchema,
    prompt: `
You are classifying a store.

Given these keywords:
${keywords.join(", ")}

Infer:
- high-level categories
- business types

Rules:
- Use lowercase strings
- Be deterministic
- No duplicates
`,
  });

  return Response.json(result.object);
}