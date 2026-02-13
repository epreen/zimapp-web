"use client";

import HeaderBadge from "@/components/ui/badges/top-header-badge";
import HeaderLayoutClient from "@/components/ui/clients/header-layout-client";
import HeaderMenu from "@/components/ui/menu/header-menu";

import { Suspense } from "react";

export function Header() {
  return (
    <Suspense
      fallback={
        <div>

        </div>
      }
    >
      <header className="sticky top-0 z-50 border-b border-foreground/10 backdrop-blur-sm bg-background/90">
        <HeaderBadge />
        <HeaderLayoutClient />
        <HeaderMenu />
      </header>
    </Suspense>
  );
}