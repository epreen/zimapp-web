// /inngest/jobs/processVideoUpload.ts
import { assemblyAI, openai, cohere } from "@/inngest/integrations";
import { convex } from "@/lib/convex-client";

/**
 * Process a single uploaded video:
 * - transcribe
 * - moderate
 * - extract tags
 * - generate metadata
 * - update Convex
 */
export async function processVideoUpload(videoUrl: string, videoId: string, storeId?: string) {
  // 1. transcription
  const transcript = await assemblyAI.transcribe(videoUrl);

  // 2. content safety
  const safety = await assemblyAI.moderate(videoUrl);

  // 3. generate metadata
  const aiMeta = await openai.generateVideoMetadata(transcript);

  // 4. cohere tags
  const tags = await cohere.generateTags(transcript);

  // 5. save to Convex (replace with your mutation)
  try {
    await convex.mutation((api: any) => api.videos.update, {
      id: videoId,
      transcript,
      aiTags: tags,
      engagementScore: aiMeta?.prediction ?? null,
      moderationStatus: safety.safe ? "approved" : "rejected",
    });
  } catch (err) {
    console.error("processVideoUpload: convex update failed", err);
    throw err;
  }

  return { transcript, safety, aiMeta, tags };
}