'use client'

import {ArrowLeft} from "lucide-react"
import Link from "next/link"
import {FC} from "react"
import { Product } from "@/lib/types"

interface ProductDescriptionInterface {
    product: Product
}

const ProductDescription: FC<ProductDescriptionInterface> = ({ product }) => {
    return (
        <div className="text-sm text-foreground/80">
            <p className="max-w-xl">{product.description}</p>
            {/* Store Page */}
            <div className="flex gap-3 mt-14">
                <div>
                    <Link href={`/store`} className="flex items-center gap-1.5 text-primary dark:text-secondary"> <ArrowLeft size={14} /> Back to the dashboard </Link>
                </div>
            </div>
        </div>
    )
}

export default ProductDescription