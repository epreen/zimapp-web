"use client";

import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemSeparator,
} from "@/components/ui/item";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { Separator } from "../separator";
import { useAuth } from "@clerk/nextjs";
import { getStoreLimit } from "@/lib/store-limit";
import { Plans } from "@/lib/tier-config";

interface Store {
  _id: string;
  name: string;
  category: string;
  logo?: string;
}

interface ManageStoresInlineProps {
  userId: string;
}

export function ManageStoresInline({ userId }: ManageStoresInlineProps) {
  const { has, isLoaded } = useAuth();

  const storesQuery = useQuery(api.store.retrieveByUser, { userId });

  if (!userId) {
    return <p className="mt-4 text-center">Please sign in to manage stores</p>;
  }

  if (!isLoaded || !storesQuery) {
    return <p className="mt-4 text-center">Loading...</p>;
  }

  const stores: Store[] = storesQuery ?? [];

  // ---- PLAN ACCESS (via Clerk) ----
  let currentPlan: Plans = "free"; // default

  const planAccess = {
    free: has({ plan: "free" }),
    standard: has({ plan: "standard" }),
    premium: has({ plan: "premium" }),
    business: has({ plan: "business" }),
    enterprise: has({ plan: "enterprise" }),
  };  

  if (planAccess.standard) currentPlan = "standard";
  else if (planAccess.premium) currentPlan = "premium";
  else if (planAccess.business) currentPlan = "business";
  else if (planAccess.enterprise) currentPlan = "enterprise";

  const storeLimit = getStoreLimit(currentPlan);

  const hasAccess = storeLimit > 0;
  const userCanCreate = stores.length < storeLimit;

  // ---- STATE 1: No access ----
  if (!hasAccess) {
    return (
      <Card className="border-none p-0 m-0">
        <CardHeader>
          <CardTitle>Create a Store</CardTitle>
          <Separator className="bg-foreground/3 mb-10" />
          <CardDescription className="text-xs">
            You're currently using a free plan, please upgrade your plan to have access to the store management inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="w-full">
            <Link href="/pricing">Upgrade Plan</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  // ---- STATE 2: No stores yet ----
  if (stores.length === 0) {
    return (
      <Card className="border-none p-0 m-0">
        <CardHeader>
          <CardTitle>Manage Your Store</CardTitle>
          <Separator className="bg-foreground/3 mb-10" />
          <CardDescription className="text-xs">
            You have up to {storeLimit} slot for store limits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userCanCreate ? (
            <Button asChild className="text-xs opacity-[0.1]" disabled>
              <Link href="#">
                Create store
              </Link>
            </Button>
          ) : (
            <p className="text-xs text-red-500 opacity-70 text-center">
              Store limit reached
            </p>
          )}
        </CardContent>
      </Card>
    );
  }

  // ---- STATE 3: Has stores ----
  return (
    <div className="p-0 m-0">
      <ItemGroup>
        {stores.map((store, index) => (
          <React.Fragment key={store._id}>
            <Item>
              <ItemMedia>
                <Avatar>
                  {store.logo ? (
                    <AvatarImage src={store.logo} />
                  ) : (
                    <AvatarFallback>
                      {store.name.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
              </ItemMedia>

              <ItemContent>
                <ItemTitle>{store.name}</ItemTitle>
                <ItemDescription>{store.category}</ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/store/${store._id}`}>
                    Manage
                  </Link>
                </Button>
              </ItemActions>
            </Item>

            {index !== stores.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>

      {userCanCreate && (
        <Button className="mt-4 w-full" asChild>
          <Link href="/dashboard/stores/create">
            Create another store
          </Link>
        </Button>
      )}
    </div>
  );
}