"use client";

import dynamic from "next/dynamic";
import SpecsSection from "@/components/ui/sections/specs-section";
import NewsletterSection from "@/components/ui/sections/newsletter-section";
import {BestSelling, LatestProducts} from "@/components/ui/sections/products-section";
import {ourSpecsData} from "@/data/dummy/specs";
import { PricingSection } from "@/components/ui/sections/pricing-section";

const HomePage =  () => {
    const HeroSection = dynamic(() => import("@/components/ui/sections/hero-section"), {
        ssr: false
    });

    return (
        <div>
            <HeroSection />
            <LatestProducts />
            <BestSelling />
            <SpecsSection data={ourSpecsData} />
            <PricingSection />
            <NewsletterSection />
        </div>
    )
}

export default HomePage;