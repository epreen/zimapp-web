// /inngest/jobs/sendAutoResponder.ts
import { openai } from "@/inngest/integrations";
import { convex } from "@/lib/convex-client";

/**
 * Create an AI reply and persist it as a message.
 */
export async function sendAutoResponder(conversationId: string, incomingMessage: string, senderId: string, receiverId: string) {
  const reply = await openai.chatResponder(incomingMessage);

  await convex.mutation((api: any) => api.messages.insert, {
    conversationId,
    senderId: "ai-bot",
    receiverId,
    message: reply,
    isAI: true,
    createdAt: Date.now(),
  });

  return reply;
}