// lib/actions/verify-payment.ts
"use server";

import { paychangu } from "@/lib/paychangu";

export async function verifyPayChanguPayment(txRef: string) {
  try {
    const verification = await paychangu.transaction.verify(txRef);

    if (verification.data.status !== "success") {
      return { success: false };
    }

    return {
      success: true,
      transaction: {
        txRef,
        amount: verification.data.amount,
        currency: verification.data.currency,
        customerEmail: verification.data.customer.email,
        status: verification.data.status,
        metadata: verification.data.metadata,
      },
    };
  } catch (err) {
    console.error("Verification failed:", err);
    return { success: false };
  }
}