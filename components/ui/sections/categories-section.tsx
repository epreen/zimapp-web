"use client";

import React from "react";
import Link from "next/link";
import { categories } from "@/data/dummy/categories";
import CategoryCard from "@/components/ui/cards/category-card";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/virtual";

const CategoriesSection = () => {
    return (
        <section className="py-8 md:py-16 w-full">
            <div className="mx-auto px-4 2xl:px-0">
                <div className="mb-8 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-light text-gray-900 dark:text-white sm:text-2xl">
                        Shop by category
                    </h2>
                    <Link
                        href="/marketplace/categories"
                        className="flex items-center text-base font-medium text-primary-700 hover:underline dark:text-primary-400"
                    >
                        See more categories
                    </Link>
                </div>

                <Swiper
                    spaceBetween={16}
                    slidesPerView={2}
                    breakpoints={{
                        640: { slidesPerView: 3 },
                        768: { slidesPerView: 4 },
                        1024: { slidesPerView: 5 },
                    }}
                >
                    {categories.map((cat, index) => (
                        <SwiperSlide key={cat.slug} virtualIndex={index}>
                            <CategoryCard
                                name={cat.name}
                                slug={cat.slug}
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default CategoriesSection;