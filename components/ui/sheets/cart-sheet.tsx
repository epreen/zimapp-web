"use client";

import { AlertTriangle, Loader2, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useCartItems,
  useCartIsOpen,
  useCartActions,
  useTotalItems,
} from "@/components/providers/cart-store-provider";
import { useCartStock } from "@/lib/hooks/use-cart-stock";
import { CartItem } from "@/components/ui/items/cart-item";
import { CartSummary } from "@/components/ui/summaries/cart-summary";

export function CartSheet() {
  const items = useCartItems();
  const isOpen = useCartIsOpen();
  const totalItems = useTotalItems();
  const { closeCart } = useCartActions();
  const { stockMap, isLoading, hasStockIssues } = useCartStock(items);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent className = "min-w-72 max-w-96 sm:max-w-lg text-primary p-4">
        <SheetHeader className="flex justify-between pb-4 mb-4 border-b border-primary/20">
          <SheetTitle className="flex items-center font-semibold text-lg text-foreground gap-2">
            <ShoppingBag className="h-5 w-5" />
            Shopping Cart ({totalItems})
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-foreground/40" />
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <ShoppingBag className="h-12 w-12 text-foreground/20" />
            <h3 className="mt-4 text-md font-medium text-foreground/80">
              Your cart is empty
            </h3>
            <p className="mt-1 text-xs text-foreground/60">
              Add some items to get started
            </p>
          </div>
        ) : (
          <>
            {/* Stock Issues Banner */}
            {hasStockIssues && !isLoading && (
              <div className="flex items-center gap-2 rounded-lg border border-amber-800/20 bg-amber-800/10 px-3 py-2 text-sm text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>
                  Some items have stock issues. Please review before checkout.
                </span>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5">
              <div className="space-y-2 py-2 divide-y divide-foreground/20">
                {items.map((item) => (
                  <CartItem
                    key={item.productId}
                    item={item}
                    stockInfo={stockMap.get(item.productId)}
                  />
                ))}
              </div>
            </div>

            {/* Summary */}
            <CartSummary hasStockIssues={hasStockIssues} />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}