import Link from "next/link";
import type { OrderSummary } from "@/lib/ai/tools/get-my-orders";
import { getOrderStatus } from "@/lib/constants/order-status";
import { formatDate, formatOrderNumber } from "@/lib/utils";
import { StackedProductImages } from "@/components/ui/images/stacked-product-images";

interface OrderCardWidgetProps {
  order: OrderSummary;
  onClose: () => void;
}

export function OrderCardWidget({ order, onClose }: OrderCardWidgetProps) {
  const config = getOrderStatus(order.status);

  const handleClick = () => {
    // Only close chat on mobile (< 768px)
    if (window.matchMedia("(max-width: 767px)").matches) {
      onClose();
    }
  };

  // Format date
  const formattedDate = order.createdAt
    ? formatDate(order.createdAt, "long")
    : null;

  // Truncate item names for display
  const displayItems =
    order.itemNames.length > 2
      ? `${order.itemNames.slice(0, 2).join(", ")} +${order.itemNames.length - 2} more`
      : order.itemNames.join(", ");

  const cardContent = (
    <>
      <StackedProductImages
        images={order.itemImages}
        totalCount={order.itemCount}
        size="sm"
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="block truncate text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-amber-600">
              Order #{formatOrderNumber(order.orderNumber)}
            </span>
            {displayItems && (
              <span className="block truncate text-xs text-foreground/40">
                {displayItems}
              </span>
            )}
          </div>
          {order.totalFormatted && (
            <span className="shrink-0 text-sm font-semibold text-foreground">
              {order.totalFormatted}
            </span>
          )}
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium ${config.iconColor}`}
          >
            {order.statusDisplay}
          </span>
          {formattedDate && (
            <>
              <span className="text-foreground/20">•</span>
              <span className="text-xs text-foreground/40">
                {formattedDate}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );

  const cardClasses =
    "group flex items-center gap-3 rounded-lg border border-zinc-200 bg-background p-3 transition-all duration-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100/50 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-amber-600/50 dark:hover:shadow-amber-900/20";

  return (
    <Link href={order.orderUrl} onClick={handleClick} className={cardClasses}>
      {cardContent}
    </Link>
  );
}
