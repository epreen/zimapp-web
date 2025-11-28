"use client";

import Title from "@/components/ui/title";
import { PricingTable } from "@clerk/nextjs";

interface PricingSectionInterface {
    compact?: boolean;
}

export function PricingSection({ compact = false }: PricingSectionInterface) {
    return (
        <section className="relative px-6 my-24 max-w-6xl mx-auto">
            <div className="absolute inset-0 mesh-background-primary dark:mesh-background-secondary"></div>

            <Title
                visibleButton={false}
                title="Simple, Transparent Pricing"
                description="Choose a plan that fits your needs. Upgrade, downgrade, or cancel anytime."
            />

            <div className="flex justify-center w-full mt-10">
                <div className={compact ? "max-w-4xl w-full" : "max-w-6xl w-full"}>
                    <div className={`zim-pricing ${compact ? "compact" : ""}`}>
                        <PricingTable
                            appearance={{
                                variables: {
                                    colorPrimary: "var(--billing-primary)",
                                    colorPrimaryForeground: "var(--background)",
                                    colorBackground: "var(--card)",
                                    colorInputBackground: "var(--input)",
                                    colorInputText: "var(--foreground)",
                                    colorText: "var(--foreground)",
                                    colorTextSecondary: "var(--muted-foreground)",
                                    colorShimmer: "var(--billing-primary)",
                                    borderRadius: "var(--radius-sm)",
                                    fontFamily: "var(--font-poppins)"
                                },
                                elements: {
                                    //
                                    // Pricing card container
                                    //
                                    pricingCard: {
                                        backgroundColor: "var(--card)",
                                        borderRadius: "calc(var(--radius) + 2px)",
                                        transition: "transform .25s ease, box-shadow .25s ease",
                                        color: "var(--card-foreground)"
                                    },
                                    pricingCard__hover: {
                                        transform: "translateY(-4px)"
                                    },

                                    //
                                    // Card Header
                                    //
                                    pricingCardHeader: {
                                        color: "var(--billing-primary)",
                                        padding: "1.75rem",
                                        borderBottom: "1px solid var(--border)"
                                    },

                                    //
                                    // Title + Description
                                    //
                                    pricingCardTitle: {
                                        fontSize: "2.35rem",
                                        fontWeight: "700",
                                        marginBottom: "3.35rem"
                                    },
                                    pricingCardDescription: {
                                        fontSize: ".9rem",
                                        opacity: "0.8"
                                    },

                                    //
                                    // Price
                                    //
                                    pricingCardPrice: {
                                        color: "var(--billing-primary)",
                                        fontWeight: "700"
                                    },
                                    pricingCardPricePeriod: {
                                        color: "var(--billing-primary)",
                                        fontWeight: "700"
                                    },

                                    //
                                    // Body
                                    //
                                    pricingCardBody: {
                                        padding: "2rem",
                                        backgroundColor: "var(--card)",
                                        color: "var(--card-foreground)"
                                    },

                                    //
                                    // Feature List
                                    //
                                    pricingCardFeatures: {
                                        marginTop: "1.5rem",
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: ".75rem"
                                    },
                                    pricingCardFeature: {
                                        fontSize: ".95rem",
                                        fontWeight: "500",
                                        opacity: "0.95"
                                    },

                                    //
                                    // Button
                                    //
                                    pricingCardButton: {
                                        marginTop: "1.75rem",
                                        backgroundColor: "var(--billing-primary)",
                                        color: "var(--background)",
                                        padding: ".9rem 2rem",
                                        borderRadius: "var(--radius)",
                                        fontWeight: "600",
                                        border: "none",
                                        transition: "background .25s ease, transform .2s ease"
                                    }
                                }
                            }}
                            fallback={
                                <div className="flex items-center justify-center py-20">
                                    <div className="text-center space-y-4 p-12 rounded-2xl">
                                        <p className="text-lg font-medium opacity-80">
                                            Loading pricing options...
                                        </p>
                                    </div>
                                </div>
                            }
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}