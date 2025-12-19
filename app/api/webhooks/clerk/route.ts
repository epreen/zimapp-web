// app/api/webhooks/clerk/route.ts
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { Roles, Plans } from "@/lib/tier-config";

/**
 * Map plan to role — adjust as your system requires
 */
function getRoleForPlan(plan: Plans): Roles {
  switch (plan) {
    case "standard":
    case "premium":
      return "business";
    case "business":
    case "enterprise":
      return "verified_business";
    default:
      return "customer";
  }
}

export async function POST(req: NextRequest) {
  try {
    const event = await verifyWebhook(req);

    const clerk = await clerkClient();

    // Handle user creation
    if (event.type === "user.created") {
      const userId = event.data.id;

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          role: "customer",
          plan: "free",
        },
      });
    }

    // Handle plan upgrade/downgrade — assume event contains the plan info
    if (event.type === "subscription.updated" || event.type === "subscription.created") {
      const userId = event.data.payer?.user_id;
      if (!userId) return;
    
      // Find the first active plan item
      const activeItem = event.data.items?.find((i: any) => i.status === "active");
      if (!activeItem?.plan?.slug) return; // early exit if missing

      const planSlug = activeItem.plan.slug as Plans; // now TS is happy
      const newRole = getRoleForPlan(planSlug);

      await clerk.users.updateUserMetadata(userId, {
        publicMetadata: {
          plan: planSlug,
          role: newRole,
        },
      });
    }    

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Clerk webhook error:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}