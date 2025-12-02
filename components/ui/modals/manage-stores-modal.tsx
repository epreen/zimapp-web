"use client";

import * as React from "react";
import { ItemGroup, Item, ItemMedia, ItemContent, ItemTitle, ItemDescription, ItemActions, ItemSeparator } from "@/components/ui/item";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Id } from "@/convex/_generated/dataModel";

interface Store {
  _id: Id<"stores">;
  name: string;
  description: string;
  logo?: string;
  category: string;
}

export function ManageStoresInline() {
  const { user } = useUser();

  const userId = user?.id;

  // useQuery returns stores or undefined while loading
  const stores = useQuery(
    api.store.retrieveByUser,
    userId ? { userId } : "skip"
  );

  if (!userId) {
    return <p className="mt-4 text-center">Please sign in to manage stores</p>;
  }

  if (!stores) {
    // loading state
    return <p className="mt-4 text-center">Loading stores...</p>;
  }

  if (stores.length === 0) {
    return <p className="mt-4 text-center">No stores found</p>;
  }

  return (
    <div className="mt-4">
      <ItemGroup>
        {stores.map((store, index) => (
          <React.Fragment key={store._id}>
            <Item>
              <ItemMedia>
                <Avatar>
                  {store.logo ? (
                    <AvatarImage src={store.logo} />
                  ) : (
                    <AvatarFallback>{store.name.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
              </ItemMedia>
              <ItemContent className="gap-1">
                <ItemTitle>{store.name}</ItemTitle>
                <ItemDescription>{store.category}</ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button variant="ghost" size="icon">
                  <PlusIcon />
                </Button>
              </ItemActions>
            </Item>
            {index !== stores.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  );
}