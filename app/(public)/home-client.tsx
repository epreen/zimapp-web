"use client";

import dynamic from "next/dynamic";
import SpecsSection from "@/components/ui/sections/specs-section";
import { BestSelling, LatestProducts } from "@/components/ui/sections/products-section";
import { ourSpecsData } from "@/data/dummy/specs";
import { PricingSection } from "@/components/ui/sections/pricing-section";
import { Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";

const HeroSection = dynamic(() => import("@/components/ui/sections/hero-section"), {
  ssr: false
});

interface HomePageClientProps {
  products: Preloaded<typeof api.products.retrieve>;
}
  
export default function HomePageClient({ products }: HomePageClientProps) {
  return (
    <div>
      <HeroSection />
      <LatestProducts products={products} />
      <BestSelling products={products} />
      <SpecsSection data={ourSpecsData} />
      <PricingSection />
    </div>
  );
}