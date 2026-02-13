import { NextRequest, NextResponse } from "next/server";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { syncUserToSanity } from "@/lib/sync-user-to-sanity";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        }),
    });
}

export async function POST(request: NextRequest) {
    try {
        const { idToken } = await request.json();
        if (!idToken) return NextResponse.json({ error: "ID token required" }, { status: 400 });

        // Verify Firebase ID token
        const decodedToken = await getAuth().verifyIdToken(idToken);
        const firebaseUser = await getAuth().getUser(decodedToken.uid);

        // Sync user to Sanity
        const sanityUserId = await syncUserToSanity({
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            displayName: firebaseUser.displayName || null,
            photoURL: firebaseUser.photoURL || null,
        } as any);

        // Set secure session cookie
        const response = NextResponse.json({ success: true, sanityUserId, firebaseUid: firebaseUser.uid });
        response.cookies.set("session", idToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 hour
            path: "/",
        });

        return response;
    } catch (error: any) {
        console.error("Error syncing user:", error);
        return NextResponse.json({ error: error.message || "Failed to sync user" }, { status: 500 });
    }
}
