import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.ComponentProps<"input"> {
  variant?: "default" | "silent";
}

function Input({
  className,
  type,
  variant = "default",
  ...props
}: InputProps) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "w-full bg-background min-w-0 text-sm transition-colors outline-none cursor-pointer",
        variant === "default" && [
          "h-9 rounded-md border focus:border-primary/40 border-input bg-transparent px-3 py-1 shadow-xs",
          "file:text-foreground placeholder:text-muted-foreground",
          "selection:bg-primary selection:text-background",
          "dark:bg-input/30",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        ],
        variant === "silent" && [
          "h-auto border-none bg-transparent px-0 py-0 shadow-none",
          "focus-visible:ring-0 focus-visible:border-none",
          "placeholder:text-muted-foreground",
          "disabled:pointer-events-none disabled:opacity-50",
        ],
        className
      )}
      {...props}
    />
  );
}

export { Input };