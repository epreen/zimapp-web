import { User } from "firebase/auth";
import { isUserAdmin } from "@/lib/admin-utils";
import { client, writer } from "@/sanity/lib/client";

export async function syncUserToSanity(firebaseUser: User): Promise<string> {
    try {
        const { uid, email, displayName, photoURL } = firebaseUser;

        if (!email) {
            throw new Error("User email is required for Sanity")
        }

        const existingUser = await client.fetch(
            `*[_type == "user" && (firebaseUid == $firebaseUid || email == $email)][0]`,
            { firebaseUid: uid, email }
        );

        if (existingUser) {
            const shouldBeAdmin = isUserAdmin(email);

            const updates: any = {
                updatedAt: new Date().toISOString(),
            }

            if (!existingUser.firebaseUid || existingUser.firebaseUid !== uid) {
                updates.firebaseUid = uid;
            }

            if (shouldBeAdmin && existingUser.isAdmin !== true) {
                updates.isAdmin = true;
            }

            if (Object.keys(updates).length > 1) {
                await writer.patch(existingUser._id).set(updates).commit();
            }

            return existingUser._id;
        }

        const documentId = `user-${uid}`;
        let firstName = "";
        let lastName = "";

        if (displayName) {
            const nameParts = displayName?.trim().split(" ");
            firstName = nameParts[0] || "";
            lastName = nameParts.slice(1).join(" ") || "";
        } else {
            firstName = email.split("@")[0];
        }

        const shouldBeAdmin = isUserAdmin(email);
        const newUser = await writer.createIfNotExists({
            _id: documentId,
            _type: "user",
            firebaseUid: uid,
            email: email,
            firstName: firstName,
            lastName: lastName || undefined,
            profileImageUrl: photoURL || undefined,
            rewardPoints: 0,
            loyaltyPoints: 0,
            totalSpent: 0,
            walletBalance: 0,
            walletTransactions: [],
            withdrawalRequests: [],
            wishlist: [],
            cart: [],
            orders: [],
            addresses: [],
            notifications: [],
            isActive: true,
            businessStatus: "none",
            isBusiness: false,
            isAdmin: shouldBeAdmin,
            preference: {
                newsletter: false,
                emailNotifications: true,
                smsNotifications: false,
                preferredCurrency: "MWK",
                preferredLanguage: "en"
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });

        return newUser._id;
    } catch (error: any) {
        console.error("Error syncing user to Sanity: ", error);

        if (error?.message?.includes("insufficient permissions")) {
            console.error(
                "\n❌ SANITY TOKEN PERMISSION ERROR:",
                "\n📝 Your SANITY API TOKEN doesn't have written permissions.",
                "\n\n✅ SOLUTION:",
                "\n     1. Go to: https://www.sanity.io/manage",
                "\n     2. Select your project: ",
                process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
                "\n     3. Navigate to: API → Tokens",
                "\n     4. Create new token with 'Editor' or 'Administrator' permissions",
                "\n     5. Update NEXT_PUBLIC_SANITY_API_TOKEN in your environment variables",
                "\n     6. Restart your deployment server"
            );
        }

        throw error;
    }
}