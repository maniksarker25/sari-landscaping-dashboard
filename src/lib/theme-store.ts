import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PRIMARY_HEX } from "@/lib/theme";

type ColorMode = "light" | "dark";

interface ThemeState {
  primaryColor: string;
  mode: ColorMode;
  setPrimaryColor: (hex: string) => void;
  setMode: (mode: ColorMode) => void;
  toggleMode: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      primaryColor: DEFAULT_PRIMARY_HEX,
      mode: "light",
      setPrimaryColor: (hex) => set({ primaryColor: hex }),
      setMode: (mode) => set({ mode }),
      toggleMode: () => set({ mode: get().mode === "light" ? "dark" : "light" }),
    }),
    { name: "aurelia-admin-theme" }
  )
);
