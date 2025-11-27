'use client'

import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Address } from "@/utils/slices/address";
import { RootState } from "@/lib/store";
import RatingModal from "@/components/ui/modals/rating-modal";
import {Product} from "@/utils/slices/product";
import Rating from "@/components/ui/rating";

export interface OrderItemInterface {
    order: {
        id: string;
        status: string;
        total: number;
        createdAt: string;
        address: Address;
        orderItems: {
            orderId: string;
            productId: string;
            quantity: number;
            price: number;
            product: Product;
        }[];
    };
}

const OrderItem = ({ order }: OrderItemInterface) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || 'MWK';
    const [ratingModal, setRatingModal] = useState<any>(null);

    const { ratings } = useSelector((state: RootState) => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-foreground/10 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>

                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-foreground/80 text-base">
                                        {item.product.name}
                                    </p>

                                    <p>
                                        {currency}{item.price} Qty: {item.quantity}
                                    </p>

                                    <p className="mb-1">
                                        {new Date(order.createdAt).toDateString()}
                                    </p>

                                    <div>
                                        {ratings.find(rating =>
                                            rating.orderId === order.id &&
                                            rating.productId === item.product.id
                                        )
                                            ? (
                                                <Rating
                                                    value={
                                                        ratings.find(r =>
                                                            r.orderId === order.id &&
                                                            r.productId === item.product.id
                                                        )?.rating
                                                    }
                                                />
                                            ) : (
                                                <button
                                                    onClick={() =>
                                                        setRatingModal({
                                                            orderId: order.id,
                                                            productId: item.product.id
                                                        })
                                                    }
                                                    className={`text-green-500 transition cursor-pointer
                                                    ${order.status !== "DELIVERED" && "hidden"}`}
                                                >
                                                    Rate Product
                                                </button>
                                            )}
                                    </div>

                                    {ratingModal &&
                                        <RatingModal
                                            ratingModal={ratingModal}
                                            setRatingModal={setRatingModal}
                                        />
                                    }
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">
                    {currency}{order.total}
                </td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1
                            ${order.status === 'confirmed'
                            ? 'text-yellow-500 bg-yellow-500/10'
                            : order.status === 'DELIVERED'
                                ? 'text-green-500 bg-green-500/10'
                                : 'text-foreground/60 bg-foreground/10'}
                        `}
                    >
                        <DotIcon size={10} />
                        {order.status.toLowerCase()}
                    </div>
                </td>
            </tr>

            {/* MOBILE */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.country}</p>
                    <p>{order.address.phone}</p>

                    <br />

                    <div className="flex items-center">
                        <span className="text-center mx-auto px-6 py-1.5 rounded bg-green-700/10 text-green-700">
                            {order.status.toLowerCase()}
                        </span>
                    </div>
                </td>
            </tr>

            <tr>
                <td colSpan={4}>
                    <div className="border-b border-foreground/20 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    );
};

export default OrderItem;