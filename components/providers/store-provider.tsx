// components/providers/store-provider.tsx
"use client";

import { createContext, useContext } from "react";

export type Store = {
  _id: string;
  name: string;
  slug: string;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({
  store = null,
  children,
}: {
  store?: Store | null;
  children: React.ReactNode;
}) {
  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}