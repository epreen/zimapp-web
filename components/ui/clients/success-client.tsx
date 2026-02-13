"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle, Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartActions } from "@/components/providers/cart-store-provider";

interface SuccessClientProps {
  transaction: {
    txRef: string;
    amount: number;
    currency: string;
    customerEmail: string;
    status: string;
    metadata?: {
      items?: {
        productId: string;
        quantity: number;
      }[];
    };
  };
}

export function SuccessClient({ transaction }: SuccessClientProps) {
  const { clearCart } = useCartActions();

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
        <h1 className="mt-4 text-3xl font-bold text-foreground">
          Order Confirmed!
        </h1>
        <p className="mt-2 text-foreground/40">
          A confirmation has been sent to{" "}
          <span className="font-medium">{transaction.customerEmail}</span>
        </p>
      </div>

      {/* Order Summary */}
      <div className="mt-10 rounded-lg border border-foreground/10">
        <div className="border-b border-foreground/10 px-6 py-4">
          <h2 className="font-semibold text-foreground">
            Order Summary
          </h2>
        </div>

        <div className="px-6 py-4 space-y-3">
          {transaction.metadata?.items?.map((item) => (
            <div
              key={item.productId}
              className="flex justify-between text-sm"
            >
              <span className="text-foreground/40">
                Product × {item.quantity}
              </span>
              <span className="text-foreground">
                × {item.quantity}
              </span>
            </div>
          ))}

          <div className="mt-4 border-t border-foreground/10 pt-4">
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>
                {formatPrice(transaction.amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="border-t border-foreground/10 px-6 py-4">
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-foreground/40" />
            <span className="text-sm text-foreground/40">
              Payment status:{" "}
              <span className="font-medium capitalize text-green-600">
                {transaction.status}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button asChild variant="outline">
          <Link href="/orders">
            View Your Orders
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild>
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  );
}