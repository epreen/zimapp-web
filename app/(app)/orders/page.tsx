import Link from "next/link";
import { Package, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/states/empty-state";
import { sanityFetch } from "@/sanity/lib/live";
import { ORDERS_BY_USER_QUERY } from "@/sanity/queries/orders";
import { getOrderStatus } from "@/lib/constants/order-status";
import { getAuthUserId } from "@/lib/firebase-admin";
import { formatPrice, formatDate, formatOrderNumber } from "@/lib/utils";
import { StackedProductImages } from "@/components/ui/images/stacked-product-images";

export const metadata = {
  title: "Your Orders | Furniture Shop",
  description: "View your order history",
};

export default async function OrdersPage() {
  const userId = await getAuthUserId();

  const { data: orders } = await sanityFetch({
    query: ORDERS_BY_USER_QUERY,
    params: { clerkUserId: userId ?? "" },
  });

  if (orders.length === 0) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, it will appear here."
          action={{ label: "Start Shopping", href: "/" }}
          size="lg"
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Your Orders
        </h1>
        <p className="mt-2 text-foreground/40">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const status = getOrderStatus(order.status);
          const StatusIcon = status.icon;
          const images = (order.itemImages ?? []).filter(
            (url): url is string => url !== null,
          );

          return (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="group block rounded-xl border border-foreground/10 bg-background transition-all hover:foreground/10/40 hover:shadow-lg"
            >
              <div className="flex gap-5 p-5">
                {/* Left: Product Images Stack */}
                <StackedProductImages
                  images={images}
                  totalCount={order.itemCount ?? 0}
                  size="lg"
                />

                {/* Right: Order Details */}
                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  {/* Top: Order Info + Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground">
                        Order #{formatOrderNumber(order.orderNumber)}
                      </p>
                      <p className="mt-0.5 text-sm text-foreground/40">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge
                      className={`${status.color} shrink-0 flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </div>

                  {/* Bottom: Items + Total */}
                  <div className="mt-2 flex items-end justify-between">
                    <p className="text-sm text-foreground/40">
                      {order.itemCount}{" "}
                      {order.itemCount === 1 ? "item" : "items"}
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer: View Details */}
              <div className="flex items-center justify-between border-t border-foreground/10 px-5 py-3">
                <p className="truncate text-sm text-foreground/40">
                  {order.itemNames?.slice(0, 2).filter(Boolean).join(", ")}
                  {(order.itemNames?.length ?? 0) > 2 && "..."}
                </p>
                <span className="flex shrink-0 items-center gap-1 text-sm font-medium text-foreground/40 transition-colors group-hover:text-foreground">
                  View order
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
