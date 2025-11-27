import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { Address } from '@/lib/types'
import { addressDummyData } from '@/data/dummy/address'

interface AddressState {
    list: Address[]
}

const initialState: AddressState = {
    list: [addressDummyData],
}

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        addAddress: (state, action: PayloadAction<Address>) => {
            state.list.push(action.payload)
        },
        updateAddress: (state, action: PayloadAction<Address>) => {
            const index = state.list.findIndex(address => address.id === action.payload.id)
            if (index !== -1) {
                state.list[index] = action.payload
            }
        },
        removeAddress: (state, action: PayloadAction<string>) => {
            state.list = state.list.filter(address => address.id !== action.payload)
        },
    },
})

export const { addAddress, updateAddress, removeAddress } = addressSlice.actions
export default addressSlice.reducer
