import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Store } from "lucide-react";

// Type definition based on PRODUCT_BY_SLUG_QUERY
type ProductBySlug = {
  _id: string;
  name: string | null;
  slug: string;
  description: string | null;
  price: number;
  stock: number | null;
  featured: boolean | null;
  images: Array<{
    _key: string;
    asset?: { _id: string; url: string } | null;
    hotspot?: unknown;
  }> | null;
  category?: {
    _id: string;
    title: string;
    slug: string;
  } | null;
  store?: {
    _id: string;
    name: string;
    username: string;
    logo?: {
      asset?: { _id: string; url: string } | null;
    } | null;
  } | null;
  electronics?: unknown;
  clothing?: unknown;
  consumable?: unknown;
  profile?: unknown;
};

interface ProductInfoProps {
  product: ProductBySlug;
}

export function ProductStoreInfo({ product }: ProductInfoProps) {
  const imageUrl = product.store?.logo?.asset?.url;

  return (
    <div className="flex items-center gap-4 mt-14">
      {/* Logo / Fallback */}
      <div className="relative w-[44px] h-[44px] shrink-0 overflow-hidden rounded-lg border border-foreground/10 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.store?.name ?? "Store"}
            width={200}
            height={200}
            className="object-cover w-full h-full"
          />
        ) : (
          <Store
            size={20}
            className="text-foreground/50"
            aria-hidden
          />
        )}
      </div>

      {/* Store Info */}
      <div className="leading-tight">
        <p className="font-medium text-foreground">
          Product by {product.store?.name ?? "Unknown Store"}
        </p>

        <Link
          href={`/shops/${product.store?.username ?? ""}`}
          className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
        >
          View store <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}