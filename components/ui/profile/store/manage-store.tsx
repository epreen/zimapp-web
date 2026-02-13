"use client";

import { startTransition, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Plus } from "lucide-react";

import { STORES_BY_USER_QUERY } from "@/sanity/queries/store";
import CreateStorePage from "./[id]/create-store";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "../../item";
import { Avatar, AvatarFallback, AvatarImage } from "../../avatar";

import { Plans } from "@/lib/tier-config";
import { getStoreLimit } from "@/lib/store-limit";

import {
  createDocument,
  createDocumentHandle,
  useApplyDocumentActions,
  useQuery,
} from "@sanity/sdk-react";

type StoreTab = "list" | "edit";

interface UserStore {
  _id: string;
  name?: string;
  username?: string;
  logo?: {
    asset?: { url?: string };
  };
}

interface ManageStoresProps {
  userId: string;
}

/* ------------------------------------------------ */
/* Store List Item                                  */
/* ------------------------------------------------ */

function StoreListItem({
  store,
  onSelect,
}: {
  store: {
    _id: string;
    name?: string;
    username?: string;
    logo?: {
      asset?: {
        url?: string;
      };
    };
  };
  onSelect: (id: string) => void;
}) {
  return (
    <Item className="p-0 pb-3 mb-4 rounded-none w-full justify-between">
      <ItemMedia>
        <Avatar>
          {store.logo?.asset?.url ? (
            <AvatarImage src={store.logo.asset.url} />
          ) : (
            <AvatarFallback>
              {store.name?.charAt(0)}
            </AvatarFallback>
          )}
        </Avatar>
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{store.name}</ItemTitle>
        <ItemDescription className="text-xs">
          @{store.username}
        </ItemDescription>
      </ItemContent>

      <ItemActions>
        <Button
          size="sm"
          variant="link"
          onClick={() => onSelect(store._id)}
        >
          Edit store <ArrowRight />
        </Button>
      </ItemActions>
    </Item>
  );
}

/* ------------------------------------------------ */
/* Manage Stores                                    */
/* ------------------------------------------------ */

export function ManageStores({ userId }: ManageStoresProps) {
  const [activeTab, setActiveTab] = useState<StoreTab>("list");
  const [activeStoreId, setActiveStoreId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  const apply = useApplyDocumentActions();

  /* ---------- Fetch stores ---------- */

  const { data: userStores = [], isPending } = useQuery<UserStore[]>({
    query: STORES_BY_USER_QUERY,
    params: { userId },
  });

  /* ---------- Mount guard ---------- */

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  /* ---------- Plan & limits ---------- */

  // TODO: Replace with Firebase/Sanity-based plan detection
  const currentPlan: Plans = "free";

  const storeLimit = getStoreLimit(currentPlan);
  const storeCount = userStores.length;
  const remainingStores = Math.max(0, storeLimit - storeCount);

  const hasAccess = storeLimit > 0;
  const canCreateStore = remainingStores > 0;

  /* ---------- Create store ---------- */

  const handleCreateStore = () => {
    startTransition(async () => {
      const handle = createDocumentHandle({
        documentId: crypto.randomUUID(),
        documentType: "store",
      });

      await apply([
        createDocument(handle, { userId } as any),
      ]);

      setActiveStoreId(handle.documentId);
      setActiveTab("edit");
    });
  };

  /* ---------- No access ---------- */

  if (!hasAccess) {
    return (
      <div className="pr-10">
        <h1 className="font-semibold">Create Store</h1>
        <p className="text-xs mt-1">
          Upgrade your plan to manage stores.
        </p>

        <ItemSeparator className="bg-foreground/5 mt-4 mb-6" />

        <Button asChild className="w-full">
          <Link href="/pricing">Upgrade Plan</Link>
        </Button>
      </div>
    );
  }

  /* ---------- No stores ---------- */

  if (storeCount === 0) {
    return (
      <div className="pr-10">
        <h1 className="font-semibold">Manage Your Store</h1>
        <p className="text-xs mt-1">
          {storeLimit} store slot(s) available
        </p>

        <ItemSeparator className="bg-foreground/5 mt-4 mb-6" />

        <Button
          onClick={handleCreateStore}
          disabled={!canCreateStore || isPending}
          className="w-full"
        >
          Create Store
        </Button>
      </div>
    );
  }

  /* ---------- Main UI ---------- */

  return (
    <div className="pr-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold">Manage Your Stores</h1>
          <p className="text-xs">
            {storeCount} / {storeLimit} used • {remainingStores} remaining
          </p>
        </div>

        <Button
          size="sm"
          onClick={handleCreateStore}
          disabled={!canCreateStore || isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </Button>
      </div>

      <ItemSeparator className="bg-foreground/5 mt-4 mb-6" />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as StoreTab)}>
        <TabsContent value="list">
          <ItemGroup>
            {userStores.map((store) => (
              <StoreListItem
                key={store._id}
                store={store}
                onSelect={(id) => {
                  setActiveStoreId(id);
                  setActiveTab("edit");
                }}
              />
            ))}
          </ItemGroup>
        </TabsContent>

        <TabsContent value="edit">
          {activeStoreId ? (
            <CreateStorePage
              params={Promise.resolve({ id: activeStoreId })}
              onBack={() => {
                setActiveTab("list");
                setActiveStoreId(null);
              }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              Select a store to edit or create a new one.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}