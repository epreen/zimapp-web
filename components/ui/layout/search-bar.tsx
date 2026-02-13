"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchActions } from "@/components/providers/search-store-provider";
import { Button } from "../button";

export default function SearchBar() {
  const { open } = useSearchActions();
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  return (
    <div className="flex flex-1">
      
      {/* Desktop Version - Full Input Style */}
      <button
        type="button"
        onClick={open}
        className="group hidden sm:flex items-center w-full gap-3 rounded-full border border-border bg-input/40 px-3 py-2 transition-colors hover:border-primary/40 hover:bg-background min-w-50 md:min-w-60 cursor-pointer"
        aria-label={`Open search (${isMac ? "Cmd" : "Ctrl"}+K)`}
      >
        <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary/80" />
        <span className="flex-1 text-left text-foreground/70 transition-colors group-hover:text-foreground/90 sm:text-xs md:text-sm">
          Search <span className="hidden md:inline">products…</span>
        </span>
        <kbd className="hidden sm:inline-flex h-6 items-center gap-0.5 rounded border border-border bg-background/80 px-1.5 font-mono text-xs text-muted-foreground">
          {isMac ? "⌘" : "Ctrl"} K
        </kbd>
      </button>

      {/* Mobile Version - Icon Only */}
      <Button
        size="icon"
        variant="outline"
        onClick={open}
        className="flex sm:hidden"
      >
        <Search className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary/80" />
      </Button>
    </div>
  );
}
