// components/ui/profile/store/[id]/create-store.tsx
"use client";

import { Suspense, use, useEffect } from "react";
import Link from "next/link";
import {
  useDocument,
  useEditDocument,
  useDocumentProjection,
  type DocumentHandle,
} from "@sanity/sdk-react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import slugify from "slugify";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  PublishButton,
  RevertButton,
  DeleteButton,
  StoreImageUploader,
} from "@/components/ui/layout/admin";
import { Button } from "@/components/ui/button";

/* ------------------------------------------------------------------ */
/* Generic field editors                                               */
/* ------------------------------------------------------------------ */

function TextField({
  handle,
  path,
  placeholder,
  onCommit,
}: {
  handle: DocumentHandle;
  path: string;
  placeholder?: string;
  onCommit?: (value: string) => void;
}) {
  const { data } = useDocument<string>({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });

  return (
    <Input
      value={data ?? ""}
      placeholder={placeholder}
      onChange={(e) => edit(e.target.value)}
      onBlur={() => {
        if (data && onCommit) onCommit(data);
      }}
    />
  );
}

function BooleanField({
  handle,
  path,
  disabled,
}: {
  handle: DocumentHandle;
  path: string;
  disabled?: boolean;
}) {
  const { data } = useDocument<boolean>({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });

  return (
    <Switch
      checked={data ?? false}
      disabled={disabled}
      onCheckedChange={(v) => edit(v)}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Store link                                                          */
/* ------------------------------------------------------------------ */

function StoreLink(handle: DocumentHandle) {
  const { data } = useDocumentProjection<{ slug?: { current?: string } }>({
    ...handle,
    projection: `{ slug }`,
  });

  if (!data?.slug?.current) return null;

  return (
    <Link
      href={`/studio/store/${data.slug.current}`}
      target="_blank"
      className="inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900"
    >
      Visit store
      <ExternalLink className="h-4 w-4" />
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Main editor                                                         */
/* ------------------------------------------------------------------ */

function StoreEditor({ handle }: { handle: DocumentHandle }) {
  const { data: name } = useDocument<string>({ ...handle, path: "name" });
  const { data: slug } = useDocument<{ current?: string }>({
    ...handle,
    path: "slug",
  });
  const { data: status } = useDocument<string>({
    ...handle,
    path: "status",
  });

  const editSlug = useEditDocument({ ...handle, path: "slug" });
  const editStatus = useEditDocument({ ...handle, path: "status" });
  const editKeywords = useEditDocument({ ...handle, path: "keywords" });
  const editCategories = useEditDocument({ ...handle, path: "categories" });
  const editTypes = useEditDocument({ ...handle, path: "types" });

  // One-time default status
  useEffect(() => {
    if (!status) editStatus("pending");
  }, [status, editStatus]);

  async function deriveMetadata(description: string) {
    const res = await fetch("/api/derive-store-metadata", {
      method: "POST",
      body: JSON.stringify({ description }),
    });

    const { keywords, categories, types } = await res.json();

    editKeywords(keywords);
    editCategories(categories);
    editTypes(types);
  }

  const isValid =
    Boolean(name) &&
    Boolean(status) &&
    Boolean(slug?.current);

  return (
    <div className="space-y-8 flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{name || "New store"}</h1>
          <p className="text-sm text-zinc-500 capitalize">
            {status || "draft"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <DeleteButton handle={handle} />
          <RevertButton {...handle} />
          <div className={!isValid ? "pointer-events-none opacity-50" : undefined}>
            <PublishButton {...handle} />
          </div>
        </div>
      </div>

      <div className="grid gap-8">
        {/* Main */}
        <div className="space-y-6">
          <Section title="Store identity">
            <Field label="Store name">
              <TextField
                handle={handle}
                path="name"
                onCommit={(value) => {
                  if (!slug?.current) {
                    editSlug({
                      _type: "slug",
                      current: slugify(value, {
                        lower: true,
                        strict: true,
                      }),
                    });
                  }
                }}
              />
            </Field>

            <Field label="Username">
              <TextField handle={handle} path="username" placeholder="@store" />
            </Field>

            <Field label="Description">
              <TextareaEditor
                handle={handle}
                path="description"
                onCommit={deriveMetadata}
              />
            </Field>
          </Section>

          <Section title="Contact information">
            <Field label="Address">
              <TextField handle={handle} path="address" />
            </Field>

            <Field label="Contact phone">
              <TextField handle={handle} path="contact" />
            </Field>

            <Field label="Email">
              <TextField handle={handle} path="email" />
            </Field>
          </Section>

          <Section title="Visibility">
            <ToggleRow
              label="Activated"
              description="Store is visible to customers"
            >
              <BooleanField handle={handle} path="activated" />
            </ToggleRow>
          </Section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Section title="Branding">
            <StoreImageUploader {...handle} />
          </Section>

          <Section title="Advanced">
            <p className="text-sm text-zinc-500">
              Keywords, categories, and AI-derived fields are managed automatically.
            </p>
            <StoreLink {...handle} />
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border p-4 sm:p-6">
      <h2 className="mb-4 font-semibold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
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

function TextareaEditor({
  handle,
  path,
  onCommit,
}: {
  handle: DocumentHandle;
  path: string;
  onCommit?: (value: string) => void;
}) {
  const { data } = useDocument<string>({ ...handle, path });
  const edit = useEditDocument({ ...handle, path });

  return (
    <Textarea
      rows={4}
      value={data ?? ""}
      onChange={(e) => edit(e.target.value)}
      onBlur={() => {
        if (data && onCommit) onCommit(data);
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* Page wrapper                                                        */
/* ------------------------------------------------------------------ */

interface PageProps {
  params: Promise<{ id: string }>;
  onBack?: () => void;
}

export default function Page({ params, onBack }: PageProps) {
  const { id } = use(params);

  const handle: DocumentHandle = {
    documentId: id,
    documentType: "store",
  };

  const { data } = useDocumentProjection<{ slug?: { current?: string } }>({
    ...handle,
    projection: `{ slug }`,
  });

  return (
    <div className="space-y-6">
      {data?.slug?.current && onBack && (
        <Button
          onClick={onBack}
          variant="ghost"
          className="inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to stores
        </Button>
      )}

      <Suspense fallback={<Skeleton className="h-[600px]" />}>
        <StoreEditor handle={handle} />
      </Suspense>
    </div>
  );
}