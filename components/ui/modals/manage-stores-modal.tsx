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
import { getStoreLimit, canCreateStore } from "@/lib/store-limit";
import { PlanName } from "@/lib/tier-config";

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
  // Fetch user plan from profiles table
  const userPlanQuery = useQuery(api.profiles.retrievePlan, { userId });
  const storesQuery = useQuery(api.store.retrieveByUser, { userId });

  if (!userId)
    return <p className="mt-4 text-center">Please sign in to manage stores</p>;

  if (!userPlanQuery || !storesQuery)
    return <p className="mt-4 text-center">Loading...</p>;

  const userPlan: PlanName = (userPlanQuery.plan || "free") as PlanName;
  const stores: Store[] = storesQuery || [];

  const storeLimit = getStoreLimit(userPlan);
  const hasAccess = storeLimit > 0;
  const userCanCreate = canCreateStore(stores.length, storeLimit);

  // ---- STATE 1: No subscription / restricted ----
  if (!hasAccess) {
    return (
      <Card className="border-none p-0 m-0">
        <CardHeader>
          <CardTitle>Create a Store</CardTitle>
          <Separator className="bg-foreground/3 mb-10" />
          <CardDescription className="text-xs">
            Your current plan does not allow creating a store.
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

  // ---- STATE 2: Has access but owns zero stores ----
  if (stores.length === 0) {
    return (
      <Card className="border-none p-0 m-0">
        <CardHeader>
          <CardTitle className="flex gap-2">
            Manage Your Store{" "}
            <span className="text-primary/10 dark:text-secondary/10 font-light">
              --- {stores.length}
            </span>
          </CardTitle>
          <Separator className="bg-foreground/3 mb-10" />
          <CardDescription className="text-xs">
            You haven’t created any stores yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {userCanCreate ? (
            <Button asChild className="text-xs w-full">
              <Link href="/dashboard/store/create">Create your first store</Link>
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

  // ---- STATE 3: User has stores ----
  return (
    <div className="p-0 m-0">
      <ItemGroup>
        {stores.map((store: Store, index: number) => (
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

              <ItemContent>
                <ItemTitle>{store.name}</ItemTitle>
                <ItemDescription>{store.category}</ItemDescription>
              </ItemContent>

              <ItemActions>
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/store/${store._id}`}>Manage</Link>
                </Button>
              </ItemActions>
            </Item>

            {index !== stores.length - 1 && <ItemSeparator />}
          </React.Fragment>
        ))}
      </ItemGroup>

      {userCanCreate && (
        <Button className="mt-4 w-full" asChild>
          <Link href="/dashboard/store/create">Create another store</Link>
        </Button>
      )}
    </div>
  );
}