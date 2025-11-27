import * as React from "react"
import { cn } from "@/lib/utils"

interface InputProps extends React.ComponentProps<"input"> {
    variant?: "default" | "ghost"
}

function Input({ className, type, variant = "default", ...props }: InputProps) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                // Default Input Styles
                variant === "default" &&
                "w-full p-2 text-sm border border-foreground/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-secondary transition",

                // GHOST Variant — placeholder only, no bg, no border, no ring
                variant === "ghost" &&
                "bg-transparent border-none outline-none ring-0 focus:ring-0 focus-visible:ring-0 focus:outline-none placeholder:text-muted-foreground px-0",

                className
            )}
            {...props}
        />
    )
}

export { Input }