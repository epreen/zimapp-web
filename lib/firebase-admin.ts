import { client } from "@/sanity/lib/client";
import { auth } from "firebase-admin";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { cookies } from "next/headers";

if (!getApps().length) {
    initializeApp({
        credential: cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n")
        })
    })
}

export const adminAuth = auth();

export async function verifySessionCookie(cookie: string) {
    return await getAuth().verifySessionCookie(cookie, true);
}

export async function verifyIdToken(token: string) {
    try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return decodedToken;
    } catch (error) {
        console.error("Error Verifying Token: ", error);
        return null;
    }
}

export async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const idToken =
            cookieStore.get("session")?.value ||
            cookieStore.get("firebaseToken")?.value;
    
        if (!idToken) {
            return null;
        }
    
        const decodedClaims = await adminAuth.verifyIdToken(idToken, true);
        const userRecord = await adminAuth.getUser(decodedClaims.uid);
    
        return {
            uid: userRecord.uid,
            email: userRecord.email || "",
            emailVerified: userRecord.emailVerified,
            displayName: userRecord.displayName || "",
            photoURL: userRecord.photoURL || "",
            phoneNumber: userRecord.phoneNumber || "",
            disabled: userRecord.disabled,
            metadata: userRecord.metadata,
            customClaims: userRecord.customClaims || {},
            providerData: userRecord.providerData || [],
        };
    } catch (error: any) {
        if (error?.code === "auth/id-token-expired") {
            console.log("⚠️ Firebase token expired - client should refresh");
        } else {
            console.error("Error getting current user: ", error);
        }
        return null;
    }
}

export async function getAuthUserId() {
    try {
        const cookieStore = await cookies();
        const idToken =
            cookieStore.get("session")?.value ||
            cookieStore.get("firebaseToken")?.value;
    
        if (!idToken) {
            return null;
        }
    
        const decodedClaims = await adminAuth.verifyIdToken(idToken, true);
        return decodedClaims.uid;
    } catch (error: any) {
        if (error?.code === "auth/id-token-expired") {
            console.log("⚠️ Firebase token expired - client should refresh");
        } else {
            console.error("Error getting current user: ", error);
        }
        return null;
    }
}

export async function requireAuth() {
    const userId = await getAuthUserId();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    return userId;
}

export async function getSanityUserByFirebaseId(firebaseUid: string) {
    try {
        const user = await client.fetch(
            `*[_type == "user" && firebaseUid == $firebaseUid][0]{
                _id,
                _type,
                firebaseUid,
                email,
                name,
                image,
                role,
                accountStatus,
                wallet,
                addresses,
                orders,
                wishlist,
                notifications,
                premiumAccount,
                businessAccount,
                isAdmin,
                createdAt,
                updatedAt
            }`,
            { firebaseUid }
        );

        return user || null;
    } catch (error) {
        console.error("Error getting Sanity user: ", error);
        return null;
    }
}

export async function isAdmin() {
    const user = await getCurrentUser();

    if (!user || !user.email) {
        return false;
    }

    const adminEmailsEnv = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if (adminEmailsEnv) {
        try {
            const adminEmails = adminEmailsEnv
                .replace(/[\[\]]/g, "")
                .split(",")
                .map((email) => email.trim().toLowerCase())
                .filter((email) => email.length > 0);

            if (adminEmails.includes(user.email.toLowerCase())) {
                return true;
            }
        } catch (error) {
            console.error("Error parsing NEXT_PUBLIC_ADMIN_EMAIL: ", error);
        }
    }

    try {
        const sanityUser = await client.fetch(
            `*[_type == "user" && firebaseUid == $firebaseUid][0]{ isAdmin, email }`, { firebaseUid: user.uid }
        );

        if (sanityUser?.isAdmin === true) {
            return true;
        }
    } catch (error) {
        console.error("Error checking Sanity isAdmin field: ", error);
    }

    return false;
}

export async function requireAdmin() {
    const isUserAdmin = await isAdmin();

    if (!isUserAdmin) {
        throw new Error("Forbidden: Admin access required");
    }

    const user = await getCurrentUser();
    return user;
}

export async function checkAdminAccess() {
    const user = await getCurrentUser();

    if (!user) {
        return { isAdmin: false, user: null };
    }

    const userIsAdmin = await isAdmin();

    return { isAdmin: userIsAdmin, user };
}