import { client } from "@/sanity/lib/client";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { PRODUCTS_BY_STORE_QUERY } from "@/sanity/queries/products";

interface StoreInventoryProps {
  storeId: string;
}

type StoreProduct = {
  _id: string;
  name: string;
  price: number;
  slug: string;
  images?: {
    asset?: {
      url: string;
    } | null;
  } | null;
};

export async function StoreInventory({ storeId }: StoreInventoryProps) {
  const products = await client.fetch<StoreProduct[]>(PRODUCTS_BY_STORE_QUERY, { storeId });

  if (products.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
        No products yet. Add your first product to start selling.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product: StoreProduct) => (
        <Card key={product._id}>
          <CardContent className="p-3 space-y-3">
            <div className="relative aspect-square overflow-hidden rounded-md bg-foreground/5">
              {product.images?.asset?.url && (
                <Image
                  src={product.images.asset.url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  MWK {product.price}
                </p>
              </div>

              <Button asChild size="icon" variant="ghost">
                <Link
                  href={`/studio/store/${storeId}/products/${product.slug}`}
                >
                  <Pencil size={16} />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}