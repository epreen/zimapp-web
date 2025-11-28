"use client";

import HeroSection from "@/components/ui/sections/hero-section";
import {BestSelling, LatestProducts} from "@/components/ui/sections/products-section";
import SpecsSection from "@/components/ui/sections/specs-section";
import {ourSpecsData} from "@/data/dummy/specs";
import NewsletterSection from "@/components/ui/sections/newsletter-section";
import { PricingSection } from "@/components/ui/sections/pricing-section";

const HomePage =  () => {
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