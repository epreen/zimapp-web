import { configureStore } from '@reduxjs/toolkit'
import productReducer from '@/utils/slices/product'
import cartReducer from '@/utils/slices/cart'
import addressReducer from '@/utils/slices/address'
import ratingReducer from '@/utils/slices/rating'

export const makeStore = () => {
    return configureStore({
        reducer: {
            product: productReducer,
            cart: cartReducer,
            address: addressReducer,
            rating: ratingReducer,
        },
    })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']

