"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useIsMenuOpen,
  useMenuActions,
} from "@/components/providers/menu-store-provider";
import Link from "next/link";
import { headerMenuItems, userProfileMenuItems } from "@/data";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { Heart, List, ShoppingBag } from "lucide-react";

export function MenuSheet() {
    const pathname = usePathname();
    // const { items, favoriteProduct } = useStore();
    const user = useAuthStore((state) => state.user);
    const isOpen = useIsMenuOpen();
    const { openMenu, closeMenu } = useMenuActions();

    return (
        <Sheet
        open={isOpen}
        onOpenChange={(open) => {
            if (open) {
            openMenu();
            } else {
            closeMenu();
            }
        }}
        >
        <SheetContent
            side="left"
            className="
                w-full max-w-sm
                p-4 sm:p-6
            "
        >
            <SheetHeader className="pb-4 mb-6 border-b border-primary/20">
                <SheetTitle className="flex items-center text-2xl font-semibold text-foreground">
                    <span className="font-light text-primary">zim</span>app
                </SheetTitle>
            </SheetHeader>

            <div className="space-y-3 mb-4">
                <h3 className="text-sm font-semibold text-primary/60 uppercase">
                    Quick Access
                </h3>
                <div className="grid gap-2 sm:gap-3 sm:grid-cols-3 grid-cols-2">
                    {user && (
                        <Link
                            href="/products"
                            className="flex flex-col items-center gap-3 p-3 rounded-md text-foreground/60 hover:text-primary relative group bg-primary/60"
                        >
                            <ShoppingBag
                                size={20}
                                className="text-background"
                            />
                            <span className="text-xs font-medium text-white dark:text-black">
                                Shop
                            </span>
                        </Link>
                    )}
                    {user && (
                        <Link
                            href="/account/wishlist"
                            className="flex flex-col items-center gap-3 p-3 rounded-md text-foreground/60 hover:text-primary relative group bg-primary/60"
                        >
                            <Heart
                                size={20}
                                className="text-background"
                            />
                            <span className="text-xs font-medium text-white dark:text-black">
                                Wishlist
                            </span>
                        </Link>
                    )}
                    {user && (
                        <Link
                            href="/account/orders"
                            className="flex flex-col items-center gap-3 p-3 rounded-md text-foreground/60 hover:text-primary relative group bg-primary/60"
                        >
                            <List
                                size={20}
                                className="text-background"
                            />
                            <span className="text-xs font-medium text-white dark:text-black">
                                Orders
                            </span>
                        </Link>
                    )}
                </div>
            </div>
            <div className="overflow-y-auto">
                {/* <div className="space-y-3 mb-4">
                    <h3 className="text-sm font-semibold text-primary/60 uppercase">
                        My Account
                    </h3>
                    <div className="flex flex-col gap-1">
                    {user && userProfileMenuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-2 p-2 hover:text-primary/60 rounded-md text-foreground/60 relative group ${
                            pathname === item.href && "bg-primary/60 text-white dark:text-black hover:bg-background"
                            }`}
                        >
                            {item.icon}
                            <span className="text-xs font-medium">
                                {item.title}
                            </span>
                        </Link>
                    ))}
                    </div>
                </div> */}
                <div className="space-y-3 mb-4">
                    <h3 className="text-sm font-semibold text-primary/60 uppercase">
                        Navigation
                    </h3>
                    <div className="flex flex-col gap-1">
                    {user && headerMenuItems.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-2 p-2 hover:text-primary/60 rounded-md text-foreground/60 relative group ${
                                pathname === item.href && "bg-primary/60 text-white dark:text-black hover:bg-background"
                            }`}
                        >
                            {item.icon}
                            <span className="text-xs font-medium">
                                {item.title}
                            </span>
                        </Link>
                    ))}
                    </div>
                </div>
            </div>
        </SheetContent>
        </Sheet>
    );
}