"use client";

import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { StarIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface RatingItem {
    rating: number;
}

interface Product {
    id: string | number;
    name: string;
    price: number | string;
    images: (string | StaticImageData)[];
    rating?: RatingItem[];
}

interface ProductCardProps {
    product: Product;
    className?: string;
}

export default function ProductCard({ product, className }: ProductCardProps) {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "MWK";

    const avgRating = product.rating?.length
        ? Math.round(
            product.rating.reduce((acc, curr) => acc + curr.rating, 0) /
            product.rating.length
        )
        : 0;

    return (
        <Link
            href={`/marketplace/products/${product.id}`}
        >
            <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <Card
                    className={`bg-background border-none shadow-none group max-xl:mx-auto overflow-hidden ${className}`}
                >
                    <CardHeader className="bg-foreground/5 h-40 sm:w-60 sm:h-68 rounded-lg flex items-center justify-center">
                        <Image
                            src={product.images?.[0]}
                            alt={product.name}
                            width={500}
                            height={500}
                            className="max-h-30 sm:max-h-40 w-auto group-hover:scale-115 transition duration-300"
                        />
                    </CardHeader>

                    <CardContent className="flex justify-between text-sm p-0 max-w-60 w-full">
                        <div className='w-full overflow-hidden'>
                            <p className='truncate'>{product.name}</p>
                            <div className="flex mt-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <StarIcon
                                        key={i}
                                        size={16}
                                        className="text-transparent"
                                        fill={avgRating >= i + 1 ? "#79F018" : "#D1D5DB"}
                                    />
                                ))}
                            </div>

                        </div>
                        <p className="w-full text-end">
                            {currency}
                            {product.price}
                        </p>
                    </CardContent>
                </Card>
            </motion.div>
        </Link>
    );
}