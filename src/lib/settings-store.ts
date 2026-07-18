import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SiteSettings } from "@/types";

const defaultSettings: SiteSettings = {
  siteName: "Aurelia Outdoor",
  tagline: "Pools & Landscapes, Considered",
  description:
    "Bespoke pool construction and landscape design for residential and commercial properties across the Emirates.",
  phone: "+971 4 000 0000",
  email: "studio@aureliaoutdoor.example",
  address: "Al Quoz Industrial Area 3, Dubai, UAE",
  socials: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
};

interface SettingsState {
  settings: SiteSettings;
  update: (patch: Partial<SiteSettings>) => void;
  reset: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: defaultSettings,
      update: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
      reset: () => set({ settings: defaultSettings }),
    }),
    { name: "aurelia-admin-settings" }
  )
);
