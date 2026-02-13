"use server";

import { client, writer } from "@/sanity/lib/client";

interface SubscriptionData {
    email: string;
    source?: string;
    ipAddress?: string;
    userAgent?: string;
}

interface SubscriptionResponse {
    success: boolean;
    message: string;
    data?: any;
    error?: string;
    alreadySubscribed?: boolean;
}

export async function subscribeToNewsletter(
    subscriptionData: SubscriptionData
): Promise<SubscriptionResponse> {
    try {
        const { email, source = "zimapp", ipAddress, userAgent } = subscriptionData;

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                message: "Please provide a valid email address.",
                error: "Invalid email address"
            };
        }

        const normalizedEmail = email.toLowerCase().trim();
        const existingSubscription = await client.fetch(
            `*[_type == "subscription" && email == $email][0]`,
            { email: normalizedEmail }
        );

        if (existingSubscription) {
            if (existingSubscription.status === "active") {
                return {
                    success: false,
                    message:
                        "You're already a subscriber to our newsletter! Check your inbox for our latest updates.",
                    alreadySubscribed: true,
                };
            }

            if (existingSubscription.status === "unsubscribed") {
                await writer
                    .patch(existingSubscription._id)
                    .set({
                        status: "active",
                        subscribedAt: new Date().toISOString(),
                        unsubscribedAt: null,
                    })
                    .commit();
                
                return {
                    success: true,
                    message:
                        "Welcome back! You've been successfully resubscribed to our newsletter.",
                    data: { reactivated: true },
                };
            }
        }

        const doubleCheck = await client.fetch(
            `*[_type == "subscription" && email == $email][0]`,
            { email: normalizedEmail }
        )

        if (doubleCheck) {
            return {
                success: false,
                message:
                    "You're already a subscriber to our newsletter! Check your inbox for our latest updates.",
                alreadySubscribed: true,
            };
        }

        const newSubscription = await writer.create({
            _type: "subscription",
            email: normalizedEmail,
            status: "active",
            subscribedAt: new Date().toISOString(),
            source,
            ipAddress: ipAddress || "unknown",
            userAgent: userAgent || "unknown",
        });

        return {
            success: true,
            message:
                "Thank you for subscribing! Check your email for a welcome message.",
            data: {
                subscriptionId: newSubscription._id,
                email: newSubscription.email,
            },
        };
    } catch (error) {
        console.error("Error subscribing to newsletter: ", error);
        return {
            success: false,
            message: "Something went wrong. Please try again later.",
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }    
}

// export async function unsubscribeFromNewsletter(
//     email: string
// ): Promise<SubscriptionResponse> {
//     const subscription = await client.fetch(
//         `*[_type == "subscription" && email == $email && status == "active"][0]`,
//         { email: email.toLowerCase().trim() }
//     );

//     if (!subscription) {
//         return {
//             success: false,
//             message: "Email not found in our subscription list.",
//         };
//     }
// }