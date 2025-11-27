'use client'

import { Provider } from 'react-redux'
import { makeStore } from '@/lib/store'
import {ReactNode, useState} from 'react'

export default function StoreProvider({ children }: { children: ReactNode }) {
    // Lazy initialize store using useState
    const [store] = useState(() => makeStore())

    return <Provider store={store}>{children}</Provider>
}