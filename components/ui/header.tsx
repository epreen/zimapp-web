'use client';

import { Protect } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import HomeNavbar from "@/components/ui/navbars/home-navbar";
import StoreNavbar from "@/components/ui/navbars/store-navbar";
import { usePreloadedQuery } from "convex/react";
import type { Preloaded } from "convex/react";
import { useQuery } from "convex/react";

interface storeListProps {
  preloadedStores?: Preloaded<typeof api.store.retrieveByUser>;
}

export function ProtectedStoreNavbar({ preloadedStores }: storeListProps) {
  const { user } = useUser();

  const stores = preloadedStores
    ? usePreloadedQuery(preloadedStores)
    : useQuery(api.store.retrieveByUser,
        user?.id ? { userId: user.id } : "skip"
      ) ?? [];

  return (
    <Protect fallback={<p>Please sign in to view your store dashboard</p>}>
      <StoreNavbar stores={stores} />
    </Protect>
  );
}

export default function Header() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "";
  const isStore = pathname.startsWith("/store");

  return isStore ? <ProtectedStoreNavbar /> : <HomeNavbar />;
}