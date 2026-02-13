// app/api/business-application/route.ts
import { NextResponse } from "next/server";
import { writer } from "@/sanity/lib/client";
import { getCurrentUser, getSanityUserByFirebaseId } from "@/lib/firebase-admin";

export async function POST() {
    try {
        console.log("About to get current user");
        const user = await getCurrentUser();
        console.log("Current user:", user);

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        console.log("User: ", user);
    
        const sanityUser = await getSanityUserByFirebaseId(user.uid);
        console.log("Sanity user:", sanityUser);

        if (!sanityUser) {
            return NextResponse.json({ error: "Sanity user not found" }, { status: 404 });
        }
    
        const doc = await writer.createIfNotExists({
            _id: `businessApplication-${user.uid}`,
            _type: "businessApplication",
            user: { _type: "reference", _ref: sanityUser._id },
            userId: user.uid,
            userEmail: user.email,
            status: "pending",
        });
        console.log("Created doc:", doc);
    
        return NextResponse.json({ documentId: doc._id });
    } catch (error: any) {
        console.error("Error creating business application:", error);
        return NextResponse.json(
          { error: error.message ?? "Internal Server Error" },
          { status: 500 }
        );
      }      
}  