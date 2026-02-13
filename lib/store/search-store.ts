import { createStore } from "zustand/vanilla";

/* ================================
   Types
================================ */

export interface SearchState {
  isOpen: boolean;
  query: string;
}

export interface SearchActions {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  reset: () => void;
}

export type SearchStore = SearchState & SearchActions;

/* ================================
   Default Initial State
================================ */

export const defaultSearchState: SearchState = {
  isOpen: false,
  query: "",
};

/* ================================
   Store Factory
================================ */

export const createSearchStore = (initState: SearchState = defaultSearchState) => {
  return createStore<SearchStore>()((set) => ({
    ...initState,

    open: () => set({ isOpen: true }),

    close: () => set({ isOpen: false, query: "" }),

    toggle: () => set((state) => ({ isOpen: !state.isOpen, query: state.isOpen ? state.query : "" })),

    setQuery: (query: string) => set({ query }),

    reset: () => set({ query: "" }),
  }));
};
