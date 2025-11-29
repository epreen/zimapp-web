import { StaticImageData } from "next/image"

export interface Store {
    id: string;
    name: string;
    username: string;
    description: string;
    email: string;
    contact: string;
    address: string;
    logo: string | StaticImageData;
    type: string;
    category: string;
}

export interface Product {
    id: string
    name: string
    description: string
    mrp: number
    price: number
    images: (string | StaticImageData)[]
    category: string
    storeId: string
    inStock: boolean
    store: Store
    rating: Rating[]
    createdAt: string
    updatedAt: string
}

export interface Rating {
    id: string
    rating: number
    review: string
    user: {
        name: string
        image: string | StaticImageData
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

export interface Order {
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

export interface StoreFormData {
    name: string
    username: string
    description: string
    email: string
    contact: string
    address: string
    image: File | null
    type: string
    category: string
}