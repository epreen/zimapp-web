"use client";

import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import {
  createSearchStore,
  type SearchStore,
  type SearchState,
  defaultSearchState,
} from "@/lib/store/search-store";

export type SearchStoreApi = ReturnType<typeof createSearchStore>;

const SearchStoreContext = createContext<SearchStoreApi | null>(null);

interface SearchStoreProviderProps {
  children: ReactNode;
  initialState?: SearchState;
}

export function SearchStoreProvider({
  children,
  initialState,
}: SearchStoreProviderProps) {
  const storeRef = useRef<SearchStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createSearchStore(initialState ?? defaultSearchState);
  }

  return (
    <SearchStoreContext.Provider value={storeRef.current}>
      {children}
    </SearchStoreContext.Provider>
  );
}

export function useSearchStore<T>(selector: (state: SearchStore) => T): T {
  const ctx = useContext(SearchStoreContext);
  if (!ctx) {
    throw new Error("useSearchStore must be used within SearchStoreProvider");
  }
  return useStore(ctx, selector);
}

export const useIsSearchOpen = () => useSearchStore((s) => s.isOpen);
export const useSearchQuery = () => useSearchStore((s) => s.query);
export const useSearchActions = () => {
  const open = useSearchStore((s) => s.open);
  const close = useSearchStore((s) => s.close);
  const toggle = useSearchStore((s) => s.toggle);
  const setQuery = useSearchStore((s) => s.setQuery);
  const reset = useSearchStore((s) => s.reset);
  return { open, close, toggle, setQuery, reset };
};
