import { formatPrice } from "@/lib/utils";
import { twMerge } from "tailwind-merge";

interface PriceViewProps {
    price: number | undefined;
    rate: number | undefined;
    className?: string;
}

const PriceView = ({
    price,
    rate,
    className
}: PriceViewProps) => {
    const productPrice = price || 0;
    const discountRate = rate || 0;
    const discountAmount = discountRate && productPrice ? (discountRate * productPrice) / 100 : 0;
    const currentPrice = productPrice - discountAmount;

    return (
        <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-2">
                <p className={twMerge(
                    `shrink-0`,
                    className
                )}>
                    {formatPrice(currentPrice)}
                </p>
                {discountRate && discountAmount > 0 && (
                    <div className="flex items-center gap-1">
                        <p className={twMerge(
                            `shrink-0 font-normal text-foreground/40 line-through block sm:hidden`,
                            className
                        )}>
                            {formatPrice(productPrice)}
                        </p>
                        <span className="text-xs bg-red-600/10 text-red-600 px-1.5 py-0.5 rounded font-medium">
                            -{discountRate}%
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PriceView