import { create } from "zustand";
import { useShallow } from "zustand/react/shallow";

/* ================================
   Types
================================ */

export interface ShopFilterState {
  selectedCategory: string | null;
  selectedBrand: string | null;
  selectedPrice: string | null;
}

export interface ShopFilterUIState {
  mobileFiltersOpen: boolean;
  sidebarCollapsed: boolean;
}

export interface ShopFilterActions {
  setSelectedCategory: (category: string | null) => void;
  setSelectedBrand: (brand: string | null) => void;
  setSelectedPrice: (price: string | null) => void;
  clearFilters: () => void;
  openMobileFilters: () => void;
  closeMobileFilters: () => void;
  toggleMobileFilters: () => void;
  toggleSidebar: () => void;
  hydrateFromSearchParams: (brand?: string | null) => void;
}

export type ShopFilterStore = ShopFilterState &
  ShopFilterUIState &
  ShopFilterActions;

/* ================================
   Default State
================================ */

const defaultFilterState: ShopFilterState = {
  selectedCategory: null,
  selectedBrand: null,
  selectedPrice: null,
};

const defaultUIState: ShopFilterUIState = {
  mobileFiltersOpen: false,
  sidebarCollapsed: false,
};

/* ================================
   Store
================================ */

export const useShopFilterStore = create<ShopFilterStore>((set) => ({
  ...defaultFilterState,
  ...defaultUIState,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),
  setSelectedPrice: (price) => set({ selectedPrice: price }),

  clearFilters: () =>
    set({
      selectedCategory: null,
      selectedBrand: null,
      selectedPrice: null,
    }),

  openMobileFilters: () => set({ mobileFiltersOpen: true }),
  closeMobileFilters: () => set({ mobileFiltersOpen: false }),
  toggleMobileFilters: () =>
    set((s) => ({ mobileFiltersOpen: !s.mobileFiltersOpen })),
  toggleSidebar: () =>
    set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),

  hydrateFromSearchParams: (brand) => {
    if (brand) {
      set({ selectedBrand: brand });
    }
  },
}));

/* ================================
   Derived state via selectors
================================ */

export const useShopFilters = () =>
  useShopFilterStore(
    useShallow((s) => ({
      selectedCategory: s.selectedCategory,
      selectedBrand: s.selectedBrand,
      selectedPrice: s.selectedPrice,
    }))
  );

export const useShopFilterActions = () =>
  useShopFilterStore(
    useShallow((s) => ({
      setSelectedCategory: s.setSelectedCategory,
      setSelectedBrand: s.setSelectedBrand,
      setSelectedPrice: s.setSelectedPrice,
      clearFilters: s.clearFilters,
      openMobileFilters: s.openMobileFilters,
      closeMobileFilters: s.closeMobileFilters,
      toggleMobileFilters: s.toggleMobileFilters,
      toggleSidebar: s.toggleSidebar,
    }))
  );

export const useShopFilterUI = () =>
  useShopFilterStore(
    useShallow((s) => ({
      mobileFiltersOpen: s.mobileFiltersOpen,
      sidebarCollapsed: s.sidebarCollapsed,
      hasActiveFilters:
        !!(s.selectedCategory || s.selectedBrand || s.selectedPrice),
      activeFilterCount: [
        s.selectedCategory,
        s.selectedBrand,
        s.selectedPrice,
      ].filter(Boolean).length,
    }))
  );
