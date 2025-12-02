// schema/aiOutputs.ts
import { z } from "zod";

// AI metadata from video analysis
export const AiVideoMetadataSchema = z.object({
  title: z.string(),
  categories: z.array(z.string()),
  keywords: z.array(z.string()),
  engagementScore: z.number().min(0).max(1),
});

// AI product description enhancement
export const AiListingEnhancementSchema = z.object({
  description: z.string(),
  keywords: z.array(z.string()),
  category: z.string(),
});

// Generic AI tag generation
export const AiGeneratedTagsSchema = z.array(z.string());

export type AiVideoMetadata = z.infer<typeof AiVideoMetadataSchema>;
export type AiListingEnhancement = z.infer<typeof AiListingEnhancementSchema>;
export type AiGeneratedTags = z.infer<typeof AiGeneratedTagsSchema>;

// ------------------------------------------------------
// schema/dataInputs.ts
// ------------------------------------------------------

// Input for video transcription/moderation
export const VideoTranscriptionInputSchema = z.object({
  url: z.string().url(),
});

// Input for listing rewrite
export const ListingRewriteInputSchema = z.object({
  description: z.string(),
});

// Input for AI tag generation
export const TagGenerationInputSchema = z.object({
  text: z.string(),
});

export type VideoTranscriptionInput = z.infer<typeof VideoTranscriptionInputSchema>;
export type ListingRewriteInput = z.infer<typeof ListingRewriteInputSchema>;
export type TagGenerationInput = z.infer<typeof TagGenerationInputSchema>;