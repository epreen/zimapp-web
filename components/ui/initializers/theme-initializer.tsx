"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/lib/store/theme-store";

export default function ThemeInitializer() {
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    const initialTheme = saved || (systemPrefersDark ? "dark" : "light");

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);

    setTheme(initialTheme);
  }, [setTheme]);

  return null;
}