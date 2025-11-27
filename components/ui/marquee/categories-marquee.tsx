"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { categories } from "@/data/dummy/categories";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CategoriesMarquee() {
    const marqueeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = marqueeRef.current;
        if (!el) return;

        gsap.to(el, {
            xPercent: -50,
            ease: "none",
            repeat: -1,
            duration: 30,
        });
    }, []);

    return (
        <div className="overflow-hidden w-full relative max-w-7xl mx-auto select-none group sm:my-20">
            {/* Left gradient */}
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />

            <div className="flex min-w-[200%] animate-[marqueeScroll_10s_linear_infinite] sm:animate-[marqueeScroll_40s_linear_infinite] group-hover:[animation-play-state:paused] gap-4">
                {[...categories, ...categories, ...categories, ...categories].map((item, i) => (
                    <Badge
                        key={i}
                        asChild
                        className="px-5 py-2 text-background dark:bg-secondary dark:hover:bg-secondary rounded-lg text-xs sm:text-sm active:scale-95 transition-all duration-300"
                    >
                        <Link href={`/marketplace/shops/${item.slug}`}>
                            {item.name}
                        </Link>
                    </Badge>
                ))}
            </div>

            {/* Right gradient */}
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        </div>
    );
}