"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";

import { StoreProvider } from "@/components/providers/store-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StoreLayoutClientProps {
  children: ReactNode;
  store: {
    _id: string;
    name: string;
    slug: string;
    logo: {
      asset: {
        url: string;
      };
    };
  };
}

export function StoreLayoutClient({
  children,
  store,
}: StoreLayoutClientProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ✅ Store-aware navigation (MUST live inside component)
  const navItems = [
    {
      label: "Dashboard",
      href: `/studio/store/${store.slug}`,
      icon: LayoutDashboard,
    },
    {
      label: "Inventory",
      href: `/studio/store/${store.slug}/inventory`,
      icon: Package,
    },
    {
      label: "Orders",
      href: `/studio/store/${store.slug}/orders`,
      icon: ShoppingCart,
    },
  ];

  return (
      <StoreProvider store={store}>
        <div className="flex min-h-screen">
          {/* ================= Mobile Header ================= */}
          <div className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center justify-between border-b border-foreground/10 px-4 lg:hidden">
            <Link
              href={`/studio/store/${store.slug}`}
              className="flex items-center gap-2 w-full justify-between text-foreground"
            >
              <div className="flex h-10 w-10 overflow-hidden rounded-md bg-foreground">
                <Image
                  src={store.logo.asset.url}
                  alt={store.name}
                  width={200}
                  height={200}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="text-sm font-light">{store.name}</span>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen((v) => !v)}
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* ================= Mobile Overlay ================= */}
          {sidebarOpen && (
            <button
              aria-label="Close sidebar"
              className="fixed inset-0 z-40 bg-foreground/50 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          {/* ================= Sidebar ================= */}
          <aside
            className={cn(
              "fixed left-0 top-0 z-50 h-screen w-64 border-r border-foreground/10 transition-transform",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
              "lg:translate-x-0",
            )}
          >
            <div className="flex h-full flex-col">
              {/* Logo */}
              <div className="flex h-16 items-center border-b border-foreground/10 px-6">
                <Link
                  href={`/studio/store/${store.slug}`}
                  className="flex items-center gap-2 w-full justify-between text-foreground"
                >
                  <div className="flex h-10 w-10 overflow-hidden rounded-md bg-foreground">
                    <Image
                      src={store.logo.asset.url}
                      alt={store.name}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span className="text-sm font-light">{store.name}</span>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="flex-1 space-y-1 px-3 py-4">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-background text-primary/60"
                          : "text-foreground/60 hover:text-primary hover",
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Footer */}
              <div className="space-y-3 border-t border-foreground/10 px-3 py-4">
                <Link
                  href="/studio"
                  target="_blank"
                  className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-foreground/10"
                >
                  Open Studio
                  <ExternalLink className="h-4 w-4" />
                </Link>

                <Link
                  href="/"
                  className="block px-3 text-sm text-foreground/40 hover:text-foreground/60"
                >
                  ← Back to Store
                </Link>
              </div>
            </div>
          </aside>

          {/* ================= Main Content ================= */}
          <main className="flex-1 pt-14 lg:ml-64 lg:pt-0">
            <div className="p-4 lg:p-8">{children}</div>
          </main>
        </div>
      </StoreProvider>
  );
}