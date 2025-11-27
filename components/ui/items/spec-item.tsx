import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {Ref, forwardRef, ElementType} from "react";

export interface Spec {
    title: string;
    description: string;
    ref?: Ref<HTMLDivElement> | undefined;
    icon: ElementType;
    accent: string; // hex / rgb / tailwind variable
}

export const SpecItem = forwardRef<
    HTMLDivElement,
    { spec: Spec }
>(({ spec }, ref) => {
    const Icon = spec.icon;

    return (
        <Card
            ref={ref}
            className="relative h-44 px-8 flex flex-col items-center justify-center w-full text-center border rounded-lg group"
            style={{
                ["--accent" as string]: spec.accent,
                backgroundColor: spec.accent + 10,
                borderColor: spec.accent + 30
            }}
        >
            <CardHeader className="mt-8 flex items-center justify-center w-full">
                <CardTitle className="text-slate-800 font-medium dark:text-slate-100 text-center">
                    {spec.title}
                </CardTitle>
            </CardHeader>

            <CardContent className="text-sm text-slate-600 dark:text-slate-300 mt-3">
                {spec.description}
            </CardContent>

            {/* Accent Icon */}
            <div
                className="absolute -top-5 flex items-center justify-center h-12 w-12 rounded-md text-white shadow-sm transition-transform"
                style={{
                    backgroundColor: `var(--accent)`,
                }}
            >
                <Icon size={20} />
            </div>
        </Card>
    );
});

SpecItem.displayName = "SpecItem";