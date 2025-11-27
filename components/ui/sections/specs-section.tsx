"use client";

import { useRef } from "react";
import Title from "@/components/ui/title";
import {Spec, SpecItem} from "@/components/ui/items/spec-item";

export default function SpecsSection({
                                         data,
                                     }: {
    data: Spec[];
}) {
    const itemsRef = useRef<HTMLDivElement[]>([]);

    return (
        <section className="px-6 my-24 max-w-6xl mx-auto">
            <Title
                visibleButton={false}
                title="Our Specifications"
                description="We offer top-tier service and convenience to ensure your shopping experience is smooth, secure and completely hassle-free."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 gap-y-10 mt-26">
                {data.map((spec, index) => (
                    <SpecItem
                        key={index}
                        spec={spec}
                        ref={(el) => { itemsRef.current[index] = el! }}
                    />
                ))}
            </div>
        </section>
    );
}