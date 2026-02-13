// // /app/api/videos/upload/route.ts
// import { NextResponse } from "next/server";
// import { inngest } from "@/inngest/client";
// import { convex } from "@/lib/convex-client";
// import { auth } from "@clerk/nextjs/server";
// import { api } from "@/convex/_generated/api";

// export async function POST(req: Request) {
//     try {
//         // Authenticate the request
//         const { userId } = await auth();
//         if (!userId) {
//             return NextResponse.json(
//                 { error: "Unauthorized" },
//                 { status: 401 }
//             );
//         }

//         const body = await req.json();
//         const { url, storeId } = body;

//         // Validate required fields
//         if (!url || !storeId) {
//             return NextResponse.json(
//                 { error: "Missing required fields: url, storeId" },
//                 { status: 400 }
//             );
//         }

//         // Basic URL validation
//         try {
//             new URL(url);
//         } catch {
//             return NextResponse.json(
//                 { error: "Invalid URL format" },
//                 { status: 400 }
//             );
//         }

//         // create video record in Convex (return id)
//         const videoId = await convex.mutation(api.video.insert, {
//             storeId,
//             url,
//             moderationStatus: "pending",
//             uploadedAt: Date.now(),
//         });

//         // send event to Inngest to process video
//         await inngest.send({
//             name: "video.uploaded",
//             data: { url, videoId, storeId },
//         });

//         return NextResponse.json({ ok: true, videoId });
//     } catch (error) {
//         console.error("Error uploading video:", error);
//         return NextResponse.json(
//             { error: "Failed to upload video" },
//             { status: 500 }
//         );
//     }
// }