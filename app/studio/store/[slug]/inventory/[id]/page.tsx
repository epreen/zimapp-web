"use client";

import { Suspense, use } from "react";
import Link from "next/link";
import {
  useDocument,
  useEditDocument,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { ArrowLeft, ExternalLink } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";

import {
  PublishButton,
  RevertButton,
  DeleteButton,
  ProductImageUploader,
} from "@/components/ui/layout/admin";
import { useStore } from "@/components/providers/store-provider";

/* ------------------------------------------------------------------ */
/* Field editors (1 field = 1 responsibility)                          */
/* ------------------------------------------------------------------ */

function TextField({
  handle,
  path,
  placeholder,
}: {
  handle: DocumentHandle;
  path: string;
  placeholder?: string;
}) {
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });

  return (
    <Input
      value={(data as string) ?? ""}
      placeholder={placeholder}
      onChange={(e) => edit(e.target.value)}
    />
  );
}

function NumberField({
  handle,
  path,
  min = 0,
}: {
  handle: DocumentHandle;
  path: string;
  min?: number;
}) {
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });

  return (
    <Input
      type="number"
      min={min}
      value={(data as number) ?? min}
      onChange={(e) => edit(Number(e.target.value) || min)}
    />
  );
}

function BooleanField({
  handle,
  path,
}: {
  handle: DocumentHandle;
  path: string;
}) {
  const { data } = useDocument({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });

  return (
    <Switch
      checked={(data as boolean) ?? false}
      onCheckedChange={(v) => edit(v)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Storefront preview link                                             */
/* ------------------------------------------------------------------ */

function ProductStoreLink(handle: DocumentHandle) {
  const { data } = useDocumentProjection<{
    slug?: { current?: string };
  }>({
    ...handle,
    projection: `{ slug }`,
  });

  if (!data?.slug?.current) return null;

  return (
    <Link
      href={`/products/${data.slug.current}`}
      target="_blank"
      className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      View on store
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Page content                                                        */
/* ------------------------------------------------------------------ */

function ProductEditor({ handle }: { handle: DocumentHandle }) {
  const { data: name } = useDocument({ ...handle, path: "name" });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {(name as string) || "New Product"}
          </h1>
          <p className="text-sm text-zinc-500">
            Manage product content
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DeleteButton handle={handle} />
          <RevertButton {...handle} />
          <PublishButton {...handle} />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-6 lg:col-span-2">
          <Section title="Basic information">
            <Field label="Name">
              <TextField handle={handle} path="name" />
            </Field>

            <Field label="Slug">
              <SlugEditor handle={handle} />
            </Field>

            <Field label="Description">
              <DescriptionEditor handle={handle} />
            </Field>
          </Section>

          <Section title="Pricing & stock">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Price (MWK)">
                <NumberField handle={handle} path="price" />
              </Field>

              <Field label="Stock">
                <NumberField handle={handle} path="stock" />
              </Field>
            </div>
          </Section>

          <Section title="Visibility">
            <ToggleRow
              label="Featured product"
              description="Show on homepage"
            >
              <BooleanField handle={handle} path="featured" />
            </ToggleRow>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Section title="Images">
            <ProductImageUploader {...handle} />
            <div className="pt-3">
              <ProductStoreLink {...handle} />
            </div>
          </Section>

          <Section title="Advanced">
            <p className="text-sm text-zinc-500">
              Edit categories, AI fields, and conditional details in
              Sanity Studio.
            </p>

            <Link
              href={`/studio/structure/product;${handle.documentId}`}
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
            >
              Open in Studio
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small UI helpers                                                    */
/* ------------------------------------------------------------------ */

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border p-4 sm:p-6">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Slug + Description (special handling)                               */
/* ------------------------------------------------------------------ */

function SlugEditor({ handle }: { handle: DocumentHandle }) {
  const { data } = useDocument({ ...handle, path: "slug" });
  const edit = useEditDocument({ ...handle, path: "slug" });

  return (
    <Input
      value={(data as any)?.current ?? ""}
      onChange={(e) =>
        edit({ _type: "slug", current: e.target.value })
      }
    />
  );
}

function DescriptionEditor({ handle }: { handle: DocumentHandle }) {
  const { data } = useDocument({ ...handle, path: "description" });
  const edit = useEditDocument({ ...handle, path: "description" });

  return (
    <Textarea
      rows={4}
      value={(data as string) ?? ""}
      onChange={(e) => edit(e.target.value)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Page wrapper                                                        */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  const { id } = use(params);

  const store = useStore();

  const handle: DocumentHandle = {
    documentId: id,
    documentType: "product",
  };

  return (
    <div className="space-y-6">
      <Link
        href={`/studio/store/${store.slug}/inventory`}
        className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to inventory
      </Link>

      <Suspense fallback={<Skeleton className="h-[600px]" />}>
        <ProductEditor handle={handle} />
      </Suspense>
    </div>
  );
}