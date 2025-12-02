"use client";

import Title from "@/components/ui/title";
import { PricingTable } from "@clerk/nextjs";

interface PricingSectionInterface {
    compact?: boolean;
}

export function PricingSection({ compact = false }: PricingSectionInterface) {
    return (
        <section className="relative py-4 md:py-10 overflow-hidden max-w-6xl mx-auto">
            <div className="absolute inset-0"></div>

            <Title
                visibleButton={false}
                title="Simple, Transparent Pricing"
                description="Choose a plan that fits your needs. Upgrade, downgrade, or cancel anytime."
            />

            <div className="container mx-auto relative mt-10">
                <div className={compact ? "max-w-4xl w-full" : "max-w-6xl w-full"}>
                    <PricingTable
                        appearance={{
                        elements: {
                            pricingTableCardHeader: {
                                background: "var(--billing-primary)",
                                color: "var(--background)",
                                padding: compact ? "1rem" : "1.5rem",
                            },
                            pricingTableCardTitle: {
                                fontSize: compact ? "1.25rem" : "1.5rem",
                                fontWeight: "800",
                                color: "var(--background)",
                                marginBottom: "0.5rem",
                            },
                            pricingTableCardFeatures: {
                                background: "transparent"
                            },
                            pricingTableCardFeePeriodNotice: {
                                color: "var(--card)",
                            },
                            pricingTableCardDescription: {
                                color: "var(--card)",
                                fontWeight: "200",
                            },
                            pricingTableCardFee: {
                                color: "var(--background)",
                                fontSize: compact ? "2.5rem" : "3rem",
                            },
                            pricingTableCardFeePeriod: {
                                color: "var(--card)",
                                fontSize: "1.1rem",
                            },
                            pricingTableCard: {
                                border: "1px solid var(--billing-primary)",
                                transition: "all 0.3s ease",
                                overflow: "hidden",
                            },
                            pricingTableCardBody: {
                                padding: compact ? "2rem" : "2.5rem",
                            },
                            pricingCard: {
                                backgroundColor: "var(--card)",
                                transition: "transform .25s ease, box-shadow .25s ease",
                                color: "var(--card-foreground)"
                            },
                        },
                        }}
                        fallback={
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center space-y-4 glass-card p-12 rounded-2xl">
                                <p className="text-foreground/40 text-lg font-medium">Loading pricing options...</p>
                            </div>
                        </div>
                        }
                    />
                </div>
            </div>
        </section>
    );
}