'use client'

import { useDispatch, useSelector } from "react-redux";
import {addToCart, removeFromCart} from "@/utils/slices/cart";
import {RootState} from "@/lib/store";

interface CounterInterface {
    productId: string
}

const Counter = ({ productId }: CounterInterface) => {

    const { cartItems } = useSelector((state: RootState) => state.cart);

    const dispatch = useDispatch();

    const addToCartHandler = () => {
        dispatch(addToCart({ productId }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-foreground/20 max-sm:text-sm text-foreground/60">
            <button onClick={removeFromCartHandler} className="p-1 select-none">-</button>
            <p className="p-1">{cartItems[productId]}</p>
            <button onClick={addToCartHandler} className="p-1 select-none">+</button>
        </div>
    )
}

export default Counter