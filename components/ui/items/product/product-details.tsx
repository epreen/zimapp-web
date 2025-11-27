'use client'

import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import {FC, useState} from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import type {Product} from "@/utils/slices/product";
import {addToCart} from "@/utils/slices/cart";
import {RootState} from "@/lib/store";
import Counter from "@/components/ui/controls/counter";

interface ProductDetailsInterface {
    product: Product
}

const ProductDetails: FC<ProductDetailsInterface> = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MWK';

    const cart = useSelector((state: RootState) => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

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
                    <p className="text-xl text-foreground/40 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-foreground/40">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>
                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[productId] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-foreground/80 font-semibold">Quantity</p>
                                <Counter productId={productId} />
                            </div>
                        )
                    }
                    <button onClick={() => !cart[productId] ? addToCartHandler() : router.push('/marketplace/products/cart')} className="bg-primary dark:bg-secondary text-background px-10 py-3 text-sm font-medium rounded active:scale-95 transition cursor-pointer">
                        {!cart[productId] ? 'Add to Cart' : 'View Cart'}
                    </button>
                </div>
                <hr className="border-foreground/20 my-5" />
                <div className="flex flex-col gap-4 text-foreground/40">
                    <p className="flex gap-3"> <EarthIcon className="text-foreground/40" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-foreground/40" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-foreground/40" /> Trusted by top brands </p>
                </div>
            </div>
        </div>
    )
}

export default ProductDetails