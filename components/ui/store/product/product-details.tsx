'use client'

import { StarIcon } from "lucide-react";
import { FC, useState } from "react";
import Image from "next/image";
import type { Product, Rating } from "@/lib/types";

type ProductWithRatings = Omit<Product, "rating"> & {
    rating: Rating[]
}

interface ProductDetailsInterface {
    product: ProductWithRatings
}

const ProductDetails: FC<ProductDetailsInterface> = ({ product }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MWK';

    const productImages = Array.isArray(product.images) ? product.images : [];
    const [mainImage, setMainImage] = useState<string | null>(
        productImages.length > 0 ? (productImages[0] as string) : null,
    );

    const averageRating =
        product.rating.length > 0
            ? product.rating.reduce((acc: number, item: Rating) => acc + item.rating, 0) /
              product.rating.length
            : 0;

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                {productImages.length > 0 && (
                    <div className="flex sm:flex-col gap-3">
                        {productImages.map((image, index) => (
                            <button
                                type="button"
                                key={index}
                                onClick={() => setMainImage(productImages[index] as string)}
                                className="bg-foreground/10 flex items-center justify-center size-26 rounded-lg group cursor-pointer"
                            >
                                <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                            </button>
                        ))}
                    </div>
                )}
                <div className="flex justify-center items-center h-100 sm:size-113 bg-foreground/10 rounded-lg ">
                    {mainImage ? (
                        <Image src={mainImage} alt="" width={250} height={250} />
                    ) : (
                        <p className="text-sm text-foreground/40">Image coming soon</p>
                    )}
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-foreground/80">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-foreground/60">{product.rating.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-foreground/60">
                    <p> {currency}{product.price} </p>
                </div>
                <hr className="border-foreground/20 my-5" />
            </div>
        </div>
    )
}

export default ProductDetails