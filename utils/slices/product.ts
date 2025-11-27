import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { dummyProductsData } from '@/data/dummy/products'
import { Product } from '@/lib/types'

interface ProductState {
    list: Product[]
}

const initialState: ProductState = {
    list: dummyProductsData as Product[],
}

const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        setProducts: (state, action: PayloadAction<Product[]>) => {
            state.list = action.payload
        },
        addProduct: (state, action: PayloadAction<Product>) => {
            state.list.push(action.payload)
        },
        updateProduct: (state, action: PayloadAction<Product>) => {
            const index = state.list.findIndex(p => p.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        },
        removeProduct: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(p => p.id !== action.payload)
        },
    },
})

export const { setProducts, addProduct, updateProduct, removeProduct } = productSlice.actions
export default productSlice.reducer

