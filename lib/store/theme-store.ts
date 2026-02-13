import { create } from "zustand";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: "light",

  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
      localStorage.setItem("theme", theme);
    }

    set({ theme });
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light";

      if (typeof window !== "undefined") {
        document.documentElement.classList.remove("light", "dark");
        document.documentElement.classList.add(next);
        localStorage.setItem("theme", next);
      }

      return { theme: next };
    }),
}));