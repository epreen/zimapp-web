import { Star } from "lucide-react";

interface RatingProps {
    value?: number;
}

const Rating = ({ value = 4 }: RatingProps) => {
    const clampedValue = Math.max(0, Math.min(5, value));

    return (
        <div className="flex items-center">
            {Array.from({ length: 5 }, (_, i) => (
                <Star
                    key={i}
                    className={`shrink-0 size-4 fill-current ${clampedValue > i ? "text-green-400" : "text-gray-300"}`}
                />
            ))}
        </div>
    );
};

export default Rating;