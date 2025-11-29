// /app/api/videos/upload/route.ts
import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import { convex } from "@/lib/convex-client";

export async function POST(req: Request) {
  const body = await req.json();
  const { url, storeId } = body;

  // create video record in Convex (return id)
  const res = await convex.mutation((api: any) => api.videos.insert, {
    storeId,
    url,
    moderationStatus: "pending",
    createdAt: Date.now(),
  });

  const videoId = res?.id || res;

  // send event to Inngest to process video
  await inngest.send({
    name: "video.uploaded",
    data: { url, videoId, storeId },
  });

  return NextResponse.json({ ok: true, videoId });
}