"use client";

import Image from "next/image";
import { ChevronRightIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PromoCard } from "@/components/ui/cards/promo-card";
import CategoriesMarquee from "@/components/ui/marquee/categories-marquee";
import { assets } from "@/data/assets";

export default function HeroSection() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "MWK";

    return (
        <div className="mx-6">
            <div className="flex max-xl:flex-col gap-8 max-w-7xl mx-auto my-10 px-6">

                {/* LEFT SIDE HERO */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative flex-1 flex flex-col rounded-3xl overflow-hidden
                     bg-primary/10 dark:bg-secondary/10 xl:min-h-100"
                >
                    <div className="p-5">
                        <Badge className="hidden sm:inline-flex items-center gap-3
                              bg-primary/20 dark:bg-secondary/20
                              text-primary dark:text-secondary
                              pr-4 py-1 rounded-full">
              <span className="bg-primary dark:bg-secondary px-3 py-1
                               rounded-full text-secondary dark:text-black text-xs">
                NEWS
              </span>
                            Free Shipping on Orders Above {currency}83,000!
                            <ChevronRightIcon
                                size={16}
                                className="group-hover:translate-x-1 transition-transform duration-300"
                            />
                        </Badge>

                        <h2 className="text-3xl sm:text-5xl font-medium my-4
                           text-transparent bg-clip-text
                           bg-gradient-to-r from-primary dark:from-secondary
                           to-black dark:to-white max-w-md">
                            Products you&#39;ll love. Prices you&#39;ll trust.
                        </h2>

                        <div className="text-sm font-medium mt-6">
                            <p>Starts from</p>
                            <p className="text-3xl font-bold">{currency} 6,700</p>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.95 }}
                            className="mt-8 px-10 py-3 rounded-md
                         bg-primary dark:bg-secondary
                         text-background
                         font-medium text-sm transition-colors duration-300"
                        >
                            LEARN MORE
                        </motion.button>
                    </div>

                    <Image
                        src={assets.hero_model_img}
                        alt="Hero Model"
                        className="sm:absolute bottom-0 right-0 md:right-10 w-full sm:max-w-sm"
                    />
                </motion.div>

                {/* RIGHT SIDE PROMOS */}
                <div className="flex flex-col md:flex-row xl:flex-col gap-5 w-full xl:max-w-sm text-sm">
                    <PromoCard
                        title="Best products"
                        subtitle="View more"
                        image={assets.hero_product_img1}
                        gradient="from-background to-blue-300 dark:from-orange-900 dark:to-background"
                    />
                    <PromoCard
                        title="20% discounts"
                        subtitle="View more"
                        image={assets.hero_product_img2}
                        gradient="from-orange-200 to-background dark:from-background dark:to-blue-700"
                        delay={0.1}
                    />
                </div>
            </div>

            <CategoriesMarquee />
        </div>
    );
}