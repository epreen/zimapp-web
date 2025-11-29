// app/api/products/create/route.ts

import { inngest } from "@/inngest/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { convex } from "@/lib/convex-client";
import { api } from "@/convex/_generated/api";

export async function POST(req: Request) {
    try {
        // Authenticate the request
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json(
            { error: "Unauthorized" },
            { status: 401 }
            );
        }

        const data = await req.json();

        // Validate required fields
        if (!data.name || !data.price) {
            return NextResponse.json(
            { error: "Missing required fields: name, price" },
            { status: 400 }
            );
        }

        await convex.mutation(api.products.create, data);

        await inngest.send({
            name: "product.created",
            data,
        });

        return NextResponse.json({ status: "queued" });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Failed to create product" },
            { status: 500 }
        );
    }
}
    