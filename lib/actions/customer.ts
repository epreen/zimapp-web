"use server";

import { paychangu } from "@/lib/paychangu";

export async function verifyPayChanguPayment(txRef: string) {
  try {
    const verification = await paychangu.transaction.verify(txRef);

    if (verification.data.status !== "success") {
      return { success: false, error: "Payment not successful" };
    }

    return {
      success: true,
      transaction: verification.data,
    };
  } catch (err) {
    console.error("Verification error:", err);
    return { success: false, error: "Could not verify payment" };
  }
}