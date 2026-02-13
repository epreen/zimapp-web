"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface SearchModalHeaderProps {
  isMac?: boolean;
  className?: string;
}

export function SearchModalHeader({ isMac = false, className }: SearchModalHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 p-4 sm:p-6",
        "bg-muted/50 dark:bg-muted/30 border-b border-border",
        className
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-lg",
            "bg-primary/10 text-primary border border-border"
          )}
        >
          <Search className="size-5" />
        </div>
        <DialogTitle className="text-lg font-semibold text-foreground truncate">
          Search products
        </DialogTitle>
        <div className="hidden sm:flex items-center gap-1">
          <Kbd className="bg-background/80 text-muted-foreground border border-border">
            {isMac ? "⌘" : "Ctrl"} + K
          </Kbd>
        </div>
      </div>
      <DialogClose asChild>
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-lg text-muted-foreground hover:text-foreground hover:bg-background/80"
          aria-label="Close search"
        >
          <span className="sr-only">Close</span>
          <X className="size-4" />
        </Button>
      </DialogClose>
    </div>
  );
}
