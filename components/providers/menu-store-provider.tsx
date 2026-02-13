"use client";

import {
  createContext,
  useContext,
  useRef,
  ReactNode,
} from "react";
import { useStore } from "zustand";
import {
  createMenuStore,
  type MenuStore,
  type MenuState,
  defaultInitState,
} from "@/lib/store/menu-store";

/* ================================
   Store Context
================================ */

// Store API type
export type MenuStoreApi = ReturnType<typeof createMenuStore>;

// Context
const MenuStoreContext = createContext<MenuStoreApi | null>(null);

/* ================================
   Provider
================================ */

// Provider props
interface MenuStoreProviderProps {
    children: ReactNode;
    initialState?: MenuState;
  }

export const MenuStoreProvider = ({
  children,
  initialState,
}: MenuStoreProviderProps) => {
  const storeRef = useRef<MenuStoreApi | null>(null);

  if (!storeRef.current) {
    storeRef.current = createMenuStore(initialState ?? defaultInitState);
  }

  return (
    <MenuStoreContext.Provider value={storeRef.current}>
      {children}
    </MenuStoreContext.Provider>
  );
}

/* ================================
   Base Hook
================================ */

export const useMenuStore = <T,>(selector: (state: MenuStore) => T): T => {
  const menuStoreContext = useContext(MenuStoreContext);

  if (!menuStoreContext) {
    throw new Error(
      "useMenuStore must be used within MenuStoreProvider",
    );
  }

  return useStore(menuStoreContext, selector);
};

/* ================================
   Public Hooks
================================ */

export const useIsMenuOpen = () =>
  useMenuStore((state) => state.isOpen);

export const useMenuActions = () => {
    const openMenu = useMenuStore((state) => state.openMenu);
    const closeMenu = useMenuStore((state) => state.closeMenu);
    const toggleMenu = useMenuStore((state) => state.toggleMenu);
    
    return {
        openMenu,
        closeMenu,
        toggleMenu,
    };
};
