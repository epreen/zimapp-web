"use client";

import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Returns true if the viewport is at or below the mobile breakpoint (768px).
 * Safe for SSR: returns false during server render, then updates on mount.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(
    undefined
  );

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const handleChange = () => {
      setIsMobile(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isMobile ?? false;
}
