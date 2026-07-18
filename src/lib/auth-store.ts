import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types";

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEMO_EMAIL = "admin@aureliaoutdoor.com";
const DEMO_PASSWORD = "admin123";

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        // Simulated network latency for a realistic loading state.
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
          return { success: false, error: "Invalid email or password." };
        }

        set({
          isAuthenticated: true,
          user: {
            id: "user_1",
            name: "Jordan Blake",
            email: DEMO_EMAIL,
            role: "owner",
            avatarInitials: "JB",
          },
        });
        return { success: true };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "aurelia-admin-auth" }
  )
);

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
