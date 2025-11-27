'use client'

import { StarIcon } from "lucide-react";
import {FC, useState} from "react";
import Image from "next/image";
import type {Product} from "@/utils/slices/product";

interface ProductDetailsInterface {
    product: Product
}

const ProductDetails: FC<ProductDetailsInterface> = ({ product }) => {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MWK';

    const [mainImage, setMainImage] = useState(product.images[0]);

    const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;

    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-foreground/10 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-foreground/10 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
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