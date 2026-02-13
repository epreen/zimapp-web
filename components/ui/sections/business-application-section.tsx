"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Store, Sparkles } from "lucide-react";

export default function BusinessApplicationSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border bg-linear-to-br from-primary/10 via-background to-background p-6 sm:p-10">
      {/* Decorative glow */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />

      <div className="relative z-10 grid gap-6 sm:grid-cols-2 sm:items-center">
        {/* Left content */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-4 w-4" />
            ZIMAPP for Businesses
          </div>

          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Become a business owner on <span className="text-primary font-light">zim</span>app
          </h2>

          <p className="max-w-md text-xs text-foreground/60 sm:text-sm">
            Sell your products, reach more customers, and grow your business
            online. Whether you’re a market vendor, startup, or established
            company — ZIMAPP is built for you.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button asChild size="lg" className="gap-2">
              <Link href="/business/register">
                Become a Business Owner
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <Button asChild variant="outline" size="lg">
              <Link href="/learn/business" className="text-primary">
                Learn more
              </Link>
            </Button>
          </div>
        </div>

        {/* Right visual */}
        <div className="hidden flex-col sm:flex items-center justify-center">
            <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-primary/10">
                <Store className="h-16 w-16 text-primary" />
            </div>
            <h3 className="font-bold tracking-tight text-xl mt-2 mb-1">
                Business Forefront
            </h3>
            <p className="text-xs font-medium text-foreground/60">
                Create your very own digital online market store
            </p>
        </div>
      </div>
    </section>
  );
}