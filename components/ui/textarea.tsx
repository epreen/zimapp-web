import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "w-full min-w-0 text-sm field-sizing-content min-h-16 transition-colors outline-none cursor-pointer h-9 rounded-md border focus:border-primary/40 border-input bg-transparent px-3 py-1 shadow-xs",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
