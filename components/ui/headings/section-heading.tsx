"use client";

import React from "react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {Filter, ChevronDown, ArrowDownUp} from "lucide-react";
import { PiMarkerCircleThin } from "react-icons/pi";
import { cn } from "@/lib/utils";
import Title from "@/components/ui/title";

export type SortOption =
    | "popular"
    | "newest"
    | "price-asc"
    | "price-desc"
    | "reviews"
    | "discount";

interface SectionHeadingProps {
    title?: string;
    description?: string;
    onDisplay?: boolean;
    onOpenFilter?: () => void;
    onSortChange?: (option: SortOption) => void;
}

const SectionHeading: React.FC<SectionHeadingProps> = ({
                                                           title = "Products",
                                                           description = "Showing products",
                                                           onDisplay = false,
                                                           onOpenFilter,
                                                           onSortChange,
                                                       }) => {    return (
        <div
            className={cn(
                "space-y-4 sm:flex sm:space-y-0 md:mb-8",
                onDisplay ? "justify-between" : "justify-center text-center",
            )}
        >
            {/* LEFT */}
            <div className="w-full">
                {onDisplay && (
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink
                                    href="/marketplace"
                                    className="flex items-center gap-1 text-primary dark:text-secondary"
                                >
                                    <PiMarkerCircleThin className="h-3.5 w-3.5" />
                                    Market Place
                                </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbSeparator />

                            <BreadcrumbItem>
                                <BreadcrumbPage>{title}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                )}

                <Title
                    visibleButton={true}
                    title={title}
                    description={description}
                />
            </div>

            {/* RIGHT */}
            {onDisplay && (
                <div className="flex items-center space-x-3">
                    <Button
                        onClick={onOpenFilter}
                        variant="outline"
                        className="flex items-center gap-2 text-sm font-medium
            border-gray-200 bg-white hover:bg-gray-100 hover:text-[#23224E]
            dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                        <ChevronDown className="w-4 h-4" />
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="flex items-center gap-2 text-sm font-medium
                border-gray-200 bg-white hover:bg-gray-100 hover:text-[#23224E]
                dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            >
                                <ArrowDownUp className="w-4 h-4" />
                                Sort
                                <ChevronDown className="w-4 h-4" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-52">
                            <DropdownMenuLabel>Sort by</DropdownMenuLabel>

                            <DropdownMenuItem onClick={() => onSortChange?.("popular")}>
                                Most popular
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.("newest")}>
                                Newest
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.("price-asc")}>
                                Increasing price
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.("price-desc")}>
                                Decreasing price
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.("reviews")}>
                                Number of reviews
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSortChange?.("discount")}>
                                Discount %
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )}
        </div>
    );
};

export default SectionHeading;