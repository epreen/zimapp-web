// app/api/products/create/route.ts

import { inngest } from "@/inngest/client";

export async function POST(req: Request) {
  const data = await req.json();

  await convexcalls.createProduct(data);

  await inngest.send({
    name: "product.created",
    data,
  });

  return Response.json({ status: "queued" });
}
