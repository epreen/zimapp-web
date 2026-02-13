import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { client } from "@/sanity/lib/client";
import { STORE_BY_SLUG_QUERY } from "@/sanity/queries/store";
import { StoreLayoutClient } from "./store-layout-client";

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}

async function AdminLayout({ children, params }: AdminLayoutProps) {
  const { slug } = await params;
  const store = await client.fetch(STORE_BY_SLUG_QUERY, {
    slug,
  });

  if (!store) {
    notFound();
  }

  return <StoreLayoutClient store={store}>{children}</StoreLayoutClient>;
}

export default AdminLayout;
