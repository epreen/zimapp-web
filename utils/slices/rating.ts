import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { dummyRatingsData } from '@/data/dummy/ratings'
import { Rating } from '@/lib/types'

interface RatingState {
    ratings: Rating[]
}

const initialState: RatingState = {
    ratings: dummyRatingsData as Rating[],
}

const ratingSlice = createSlice({
    name: 'rating',
    initialState,
    reducers: {
        setRatings: (state, action: PayloadAction<Rating[]>) => {
            state.ratings = action.payload
        },
        addRating: (state, action: PayloadAction<Rating>) => {
            state.ratings.push(action.payload)
        },
        updateRating: (state, action: PayloadAction<Rating>) => {
            const index = state.ratings.findIndex(r => r.id === action.payload.id)
            if (index !== -1) {
                state.ratings[index] = action.payload
            }
        },
        removeRating: (state, action: PayloadAction<string>) => {
            state.ratings = state.ratings.filter(r => r.id !== action.payload)
        },
    },
})

export const { setRatings, addRating, updateRating, removeRating } = ratingSlice.actions
export default ratingSlice.reducer

