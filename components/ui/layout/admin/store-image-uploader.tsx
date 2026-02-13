"use client";

import { useState, useRef, Suspense } from "react";
import Image from "next/image";
import {
  useDocument,
  useEditDocument,
  useClient,
  type DocumentHandle,
} from "@sanity/sdk-react";
import {
  Upload,
  X,
  Loader2,
  ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/* ------------------------------------------------ */
/* Types                                            */
/* ------------------------------------------------ */

interface SanityImage {
  _type: "image";
  asset: {
    _type: "reference";
    _ref: string;
  };
}

interface ImageWithAsset {
  _type: "image";
  asset?: {
    _ref: string;
    url?: string;
  };
}

/* ------------------------------------------------ */
/* Main Content                                     */
/* ------------------------------------------------ */

function StoreImageUploaderContent(handle: DocumentHandle) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const client = useClient({ apiVersion: "2024-01-01" });
  const { data: logo } = useDocument<ImageWithAsset | null>({
    ...handle,
    path: "logo",
  });

  const editLogo = useEditDocument({
    ...handle,
    path: "logo",
  });

  /* ---------- Upload ---------- */

  const handleFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const asset = await client.assets.upload("image", file, {
        filename: file.name,
      });

      const newLogo: SanityImage = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };

      // 🔒 Single-logo integrity: REPLACE
      editLogo(newLogo);
    } catch (err) {
      console.error("Logo upload failed:", err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  /* ---------- Remove ---------- */

  const handleRemove = () => {
    editLogo(null);
  };

  /* ---------- Build CDN URL ---------- */

  let imageUrl: string | null = null;

  if (logo?.asset?._ref) {
    const match = logo.asset._ref.match(
      /^image-([a-zA-Z0-9]+)-(\d+x\d+)-(\w+)$/,
    );

    if (match) {
      const [, id, size, format] = match;
      imageUrl = `https://cdn.sanity.io/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/${process.env.NEXT_PUBLIC_SANITY_DATASET}/${id}-${size}.${format}`;
    }
  }

  /* ---------- UI ---------- */

  return (
    <div className="space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={isUploading}
      />

      <Button
        type="button"
        variant="outline"
        className="w-full"
        disabled={isUploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading…
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Logo
          </>
        )}
      </Button>

      {imageUrl ? (
        <div className="relative aspect-square overflow-hidden rounded-lg border">
          <Image
            src={imageUrl}
            alt="Store logo"
            fill
            className="object-cover"
            sizes="1280px"
          />

          <div className="absolute right-2 top-2">
            <Button
              type="button"
              size="icon"
              variant="destructive"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-10 text-foreground/60">
          <ImageIcon className="mb-2 h-10 w-10" />
          <p className="text-sm">No logo uploaded</p>
          <p className="text-xs">Upload a single store logo</p>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* Skeleton                                         */
/* ------------------------------------------------ */

function StoreImageUploaderSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="aspect-square rounded-lg" />
    </div>
  );
}

/* ------------------------------------------------ */
/* Export                                           */
/* ------------------------------------------------ */

export function StoreImageUploader(props: DocumentHandle) {
  return (
    <Suspense fallback={<StoreImageUploaderSkeleton />}>
      <StoreImageUploaderContent {...props} />
    </Suspense>
  );
}