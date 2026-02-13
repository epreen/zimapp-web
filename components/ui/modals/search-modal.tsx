"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  useIsSearchOpen,
  useSearchActions,
  useSearchQuery,
  useSearchStore,
} from "@/components/providers/search-store-provider";
import { useSearchModalData } from "./search/use-search-modal-data";
import {
  SearchModalHeader,
  SearchModalInput,
  SearchModalResults,
} from "./search";
import { cn } from "@/lib/utils";

function SearchModalInner() {
  const isOpen = useIsSearchOpen();
  const query = useSearchQuery();
  const { open, close, setQuery, reset } = useSearchActions();
  const { products, saleProducts, loading } = useSearchModalData(query, isOpen);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(typeof navigator !== "undefined" && navigator.platform.toUpperCase().indexOf("MAC") >= 0);
  }, []);

  useEffect(() => {
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        close();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) return;
        reset();
        open();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [isOpen, open, close, reset]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-4xl translate-x-[-50%] translate-y-[-50%]",
          "max-h-[90vh] flex flex-col overflow-hidden p-0",
          "bg-background text-foreground",
          "border border-border shadow-lg",
          "rounded-xl sm:rounded-xl"
        )}
        onPointerDownOutside={close}
        onEscapeKeyDown={close}
      >
        <SearchModalHeader isMac={isMac} />
        <SearchModalInput
          value={query}
          onChange={setQuery}
          autoFocus
        />
        <SearchModalResults
          query={query}
          products={products}
          loading={loading}
          saleProducts={saleProducts}
          onClose={close}
          onClearSearch={reset}
          onSearchThis={setQuery}
          className="border-t border-border overflow-y-auto max-h-[calc(100vh-200px)]"
        />
      </DialogContent>
    </Dialog>
  );
}

export default function SearchModal() {
  return <SearchModalInner />;
}
