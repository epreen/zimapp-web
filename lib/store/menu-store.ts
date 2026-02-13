import { createStore } from "zustand/vanilla";

/* ================================
   Types
================================ */

export interface MenuState {
    isOpen: boolean;
}

export interface MenuActions {
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
}

export type MenuStore = MenuState & MenuActions;

/* ================================
   Default Initial State
================================ */

export const defaultInitState: MenuState = {
    isOpen: false,
};

/* ================================
   Store Factory
================================ */

/**
 * Menu store factory
 * Creates a new isolated store instance per provider
 * UI-only state (no persistence needed)
 */
export const createMenuStore = (
    initState: MenuState = defaultInitState,
) => {
    return createStore<MenuStore>()((set) => ({
        ...initState,

        openMenu: () => set({ isOpen: true }),

        closeMenu: () => set({ isOpen: false }),

        toggleMenu: () =>
        set((state) => ({ isOpen: !state.isOpen })),
    }));
};