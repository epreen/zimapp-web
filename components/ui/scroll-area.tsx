"use client"

import * as React from "react"
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area"

import { cn } from "@/lib/utils"

function ScrollAreaNoBar({
                             className,
                             children,
                             ...props
                         }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
    return (
        <ScrollAreaPrimitive.Root
            data-slot="scroll-area"
            className={cn("relative", className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-area-viewport"
                className="focus-visible:ring-primary/50 dark:focus-visible:ring-secondary/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>

            {/* Hidden scrollbar */}
            <ScrollAreaPrimitive.Scrollbar className="hidden" />
            <ScrollAreaPrimitive.Corner className="hidden" />
        </ScrollAreaPrimitive.Root>
    )
}

export { ScrollAreaNoBar }