import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CartState {
    [productId: string]: number
}

interface CartSliceState {
    cartItems: CartState
}

const initialState: CartSliceState = {
    cartItems: {},
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<{ productId: string }>) => {
            const { productId } = action.payload
            if (state.cartItems[productId]) {
                state.cartItems[productId] += 1
            } else {
                state.cartItems[productId] = 1
            }
        },
        removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
            const { productId } = action.payload
            if (state.cartItems[productId] && state.cartItems[productId] > 1) {
                state.cartItems[productId] -= 1
            } else {
                delete state.cartItems[productId]
            }
        },
        setCartItemQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
            const { productId, quantity } = action.payload
            if (quantity <= 0) {
                delete state.cartItems[productId]
            } else {
                state.cartItems[productId] = quantity
            }
        },
        clearCart: (state) => {
            state.cartItems = {}
        },
    },
})

export const { addToCart, removeFromCart, setCartItemQuantity, clearCart } = cartSlice.actions

// Selector to calculate total items in cart
export const selectCartTotal = (state: { cart: CartSliceState }): number => {
    return Object.values(state.cart.cartItems).reduce((sum, quantity) => sum + quantity, 0)
}

export default cartSlice.reducer

