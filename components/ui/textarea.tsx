import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full p-2 text-sm border border-foreground/20 rounded-md focus:outline-none focus:ring-1 focus:ring-primary dark:focus:ring-secondary transition",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
