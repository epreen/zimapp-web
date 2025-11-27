"use client";

import HeroSection from "@/components/ui/sections/hero-section";
import {BestSelling, LatestProducts} from "@/components/ui/sections/products-section";
import SpecsSection from "@/components/ui/sections/specs-section";
import {ourSpecsData} from "@/data/dummy/specs";
import NewsletterSection from "@/components/ui/sections/newsletter-section";

const HomePage =  () => {
    return (
        <div>
            <HeroSection />
            <LatestProducts />
            <BestSelling />
            <SpecsSection data={ourSpecsData} />
            <NewsletterSection />
        </div>
    )
}

export default HomePage;