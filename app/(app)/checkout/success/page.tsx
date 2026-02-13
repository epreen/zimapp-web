import { redirect } from "next/navigation";
import { SuccessClient } from "@/components/ui/clients/success-client";
import { verifyPayChanguPayment } from "@/lib/actions/verify-payment";

export const metadata = {
  title: "Order Confirmed | Furniture Shop",
  description: "Your order has been placed successfully",
};

interface SuccessPageProps {
  searchParams: { tx_ref?: string };
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const txRef = searchParams.tx_ref;

  if (!txRef) {
    redirect("/");
  }

  const result = await verifyPayChanguPayment(txRef);

  if (!result.success) {
    redirect("/");
  }

  if (!result.transaction) {
    redirect("/");
  }

  return <SuccessClient transaction={result.transaction} />;
}