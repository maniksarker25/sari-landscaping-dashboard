import * as React from "react";
import { useThemeStore } from "@/lib/theme-store";
import { applyPrimaryColor } from "@/lib/theme";

/**
 * Applies the persisted theme (primary color + light/dark mode) to
 * `document.documentElement` on load and whenever either changes.
 * Mounted once near the root of the app.
 */
export function ThemeInitializer({ children }: { children: React.ReactNode }) {
  const primaryColor = useThemeStore((s) => s.primaryColor);
  const mode = useThemeStore((s) => s.mode);

  React.useEffect(() => {
    applyPrimaryColor(primaryColor);
  }, [primaryColor]);

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode]);

  return <>{children}</>;
}
