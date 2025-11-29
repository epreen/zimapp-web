// /inngest/functions/videoProcessing.ts
import { inngest } from "@/inngest/client";
import { processVideoUpload } from "@/inngest/jobs/video-jobs";

export const processVideo = inngest.createFunction(
  { id: "process-video-upload" },
  { event: "video.uploaded" },
  async ({ event, step }) => {
    const { url, videoId } = event.data;
    await step.run("process", async () => processVideoUpload(url, videoId));
  }
);