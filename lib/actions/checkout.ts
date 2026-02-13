"use server";

import { client } from "@/sanity/lib/client";
import { PRODUCTS_BY_IDS_QUERY } from "@/sanity/queries/products";
import { getPaychangu } from "@/lib/paychangu";
import { getCurrentUser } from "@/lib/firebase-admin";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export async function createPayChanguPayment(items: CartItem[]) {
  try {
    const user = await getCurrentUser();
    const userId = user?.uid;

    if (!userId || !user) {
      return { success: false, error: "Please sign in to checkout" };
    }

    // 2. Validate cart is not empty
    if (!items || items.length === 0) {
      return { success: false, error: "Your cart is empty" };
    }

    // 3. Fetch current product data from Sanity to validate prices/stock
    const productIds = items.map((item) => item.productId);
    const products = await client.fetch(PRODUCTS_BY_IDS_QUERY, {
      ids: productIds,
    });

    // 4. Validate each item
    const validationErrors: string[] = [];
    const validatedItems: {
      product: (typeof products)[number];
      quantity: number;
    }[] = [];

    for (const item of items) {
      const product = products.find(
        (p: { _id: string }) => p._id === item.productId
      );

      if (!product) {
        validationErrors.push(`Product "${item.name}" is no longer available`);
        continue;
      }

      if ((product.stock ?? 0) === 0) {
        validationErrors.push(`"${product.name}" is out of stock`);
        continue;
      }

      if (item.quantity > (product.stock ?? 0)) {
        validationErrors.push(
          `Only ${product.stock} of "${product.name}" available`
        );
        continue;
      }

      validatedItems.push({ product, quantity: item.quantity });
    }

    // 5. Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    const txRef = `order_${userId}_${Date.now()}`;

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Initialize PayChangu payment
    const response = await getPaychangu().initialize({
      amount: totalAmount,
      currency: "MWK",
      email: user.email || "",
      first_name: user.displayName?.split(" ")[0] ?? "",
      last_name: user.displayName?.split(" ").slice(1).join(" ") ?? "",
      tx_ref: txRef,
      callback_url: `${baseUrl}/checkout/success`,
      return_url: `${baseUrl}/checkout/success`,
      metadata: {
        clerkUserId: userId,
        items: validatedItems,
      },
    });

    return {
      success: true,
      url: response.data.checkout_url,
    };
  } catch (err) {
    console.error("PayChangu error:", err);
    return { success: false, error: "Payment initialization failed" };
  }
}