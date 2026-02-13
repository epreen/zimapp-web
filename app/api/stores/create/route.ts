// import { NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { client } from "@/sanity/lib/client";
// import { PLAN_LIMITS } from "@/lib/tier-config";
// import { apiError } from "@/lib/api-utils";
// import { inngest } from "@/inngest/client";

// // Utility: convert base64 string to Blob
// function base64ToBlob(base64: string): Blob {
//   const parts = base64.split(",");
//   const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
//   const binary = atob(parts[1]);
//   const array = new Uint8Array(binary.length);
//   for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
//   return new Blob([array], { type: mime });
// }

// export async function POST(req: Request) {
//   try {
//     const authObj = await auth();
//     const { userId, has } = authObj;

//     if (!userId) return apiError("Unauthorized", 401);

//     const body = (await req.json()) as {
//       name: string;
//       description: string;
//       category: string;
//       logo?: string; // base64 string
//       username?: string;
//       email?: string;
//       contact?: string;
//     };

//     if (!body.name || !body.description || !body.category) {
//       return apiError("Missing required fields", 400);
//     }

//     let maxFileSize = PLAN_LIMITS.free.maxFileSize;
//     if (has?.({ plan: "standard" })) maxFileSize = PLAN_LIMITS.standard.maxFileSize;
//     else if (has?.({ plan: "premium" })) maxFileSize = PLAN_LIMITS.premium.maxFileSize;
//     else if (has?.({ plan: "business" })) maxFileSize = PLAN_LIMITS.business.maxFileSize;
//     else if (has?.({ plan: "enterprise" })) maxFileSize = PLAN_LIMITS.enterprise.maxFileSize;

//     let logoAsset: { _type: "image"; asset: { _type: "reference"; _ref: string } } | undefined;

//     if (body.logo) {
//       const blob = base64ToBlob(body.logo);
//       const uploadResult = await client.assets.upload("image", blob, {
//         filename: `${body.name}-logo.jpg`,
//       });

//       logoAsset = {
//         _type: "image",
//         asset: {
//           _type: "reference",
//           _ref: uploadResult._id,
//         },
//       };
//     }

//     const storeDoc = {
//       _type: "store",
//       name: body.name,
//       description: body.description,
//       userId,
//       username: body.username || body.name.toLowerCase().replace(/\s+/g, "-"),
//       email: body.email,
//       contact: body.contact,
//       status: "pending",
//       activated: true,
//       keywords: [],
//       categories: [body.category],
//       types: [],
//       logo: logoAsset,
//     };

//     const createdStore = await client.create(storeDoc);

//     await inngest.send({
//       name: "store.created",
//       data: {
//         storeId: createdStore._id,
//         userId,
//         name: createdStore.name,
//       },
//     });

//     return NextResponse.json({ status: "success", storeId: createdStore._id });
//   } catch (error) {
//     console.error("Error creating store:", error);
//     return apiError(
//       error instanceof Error ? error.message : "Failed to create store",
//       500
//     );
//   }
// }