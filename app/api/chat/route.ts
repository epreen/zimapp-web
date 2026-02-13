import { createAgentUIStreamResponse, type UIMessage } from "ai";
import { createShoppingAgent } from "@/lib/ai/shopping-agent";
import { getAuthUserId } from "@/lib/firebase-admin";

export async function POST(request: Request) {
    const { messages }: { messages: UIMessage[] } = await request.json();

    const userId = await getAuthUserId();

    const agent = createShoppingAgent({ userId });

    return createAgentUIStreamResponse({
        agent,
        uiMessages: messages
    })
}