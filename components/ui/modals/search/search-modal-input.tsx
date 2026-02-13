"use client";

import { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchModalInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchModalInput({
  value,
  onChange,
  placeholder = "Type product name, category, or keyword…",
  className,
  autoFocus = true,
}: SearchModalInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus) {
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [autoFocus]);

  return (
    <div className={cn("px-4 sm:px-6 pb-4", className)}>
      <form onSubmit={(e) => e.preventDefault()} className="relative">
        <div className="relative flex items-center">
          <div
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 z-10",
              "flex size-9 items-center justify-center rounded-md",
              "bg-muted/80 text-muted-foreground"
            )}
          >
            <Search className="size-4" />
          </div>
          <Input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={cn(
              "h-12 pl-12 pr-12 rounded-lg",
              "bg-background/95 dark:bg-background/90",
              "border-border text-foreground placeholder:text-muted-foreground",
              "focus-visible:ring-primary/30"
            )}
            aria-label="Search products"
          />
          {value.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => onChange("")}
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {value.length > 0
            ? `${value.length} character${value.length === 1 ? "" : "s"} — press Enter to search`
            : "Start typing to search"}
        </p>
      </form>
    </div>
  );
}
