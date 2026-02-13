import { getAuthUserId } from "@/lib/firebase-admin";
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        const userId = await getAuthUserId();

        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const user = await client.fetch(
            `*[_type == "user" && firebaseUid == $userId][0]{
                wallet,
                orders,
                notifications
            }`,
            { userId }
        );

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            ordersCount: user.orders?.length ?? 0,
            unreadNotifications:
                user.notifications?.filter((n: any) => n.read !== true).length ?? 0,
            walletBalance: user.wallet?.balance ?? 0
        });

    } catch (error) {
        console.error("Error fetching combined user data:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}