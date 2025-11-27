export interface Product {
    id: string
    name: string
    description: string
    mrp: number
    price: number
    images: (string | any)[]
    category: string
    storeId: string
    inStock: boolean
    store?: any
    rating: Array<{ rating: number }>
    createdAt: string
    updatedAt: string
}

export interface Rating {
    id: string
    rating: number
    review: string
    user: {
        name: string
        image: any
    }
    productId: string
    orderId?: string
    createdAt: string
    updatedAt: string
    product?: {
        name: string
        category: string
        id: string
    }
}

export interface Address {
    id: string
    userId: string
    name: string
    email: string
    street: string
    city: string
    zip: string
    country: string
    phone: string
    createdAt: string
}