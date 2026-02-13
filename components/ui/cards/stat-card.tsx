"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useDocuments } from "@sanity/sdk-react";
import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  documentType: string;
  storeId: string;
  filter?: string;
  valueFormatter?: (count: number) => string;
  href?: string;
}

function StatCardContent({
  title,
  icon: Icon,
  documentType,
  storeId,
  filter,
  valueFormatter = (count) => count.toString(),
  href,
}: StatCardProps) {
  const { data } = useDocuments({
    documentType,
    filter: `_type == "product" && store._ref == "${storeId}" ${
      filter ? `&& ${filter}` : ""
    }`,
  });  

  const count = data?.length ?? 0;

  const content = (
    <div
      className={cn(
        "rounded-xl border border-foreground/10 p-6",
        href &&
          "cursor-pointer transition-colors",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground/60">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">
            {valueFormatter(count)}
          </p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
          <Icon className="h-6 w-6 text-foreground/60" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}

function StatCardSkeleton({
  title,
  icon: Icon,
}: Pick<StatCardProps, "title" | "icon">) {
  return (
    <div className="rounded-xl border border-foreground/10 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground/60">
            {title}
          </p>
          <Skeleton className="mt-2 h-9 w-20" />
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background">
          <Icon className="h-6 w-6 text-foreground/60" />
        </div>
      </div>
    </div>
  );
}

export function StatCard(props: StatCardProps) {
  return (
    <Suspense
      fallback={<StatCardSkeleton title={props.title} icon={props.icon} />}
    >
      <StatCardContent {...props} />
    </Suspense>
  );
}
