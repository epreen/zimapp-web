"use client";

import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
    name: string;
    slug: string;
    className?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug, className }) => {
    return (
        <Link href={`/marketplace/shops/${slug}`} className="w-full">
            <Card
                className={cn(
                    "flex flex-col items-center gap-2 p-2 cursor-pointer overflow-hidden hover:border-none",
                    className
                )}
            >
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{name}</span>
            </Card>
        </Link>
    );
};

export default CategoryCard;
