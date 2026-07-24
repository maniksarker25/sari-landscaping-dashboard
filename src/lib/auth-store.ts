import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AdminUser } from "@/types";

interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  password?: string;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const DEMO_EMAIL = "admin@aureliaoutdoor.com";
const DEMO_PASSWORD = "admin123";

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      password: DEMO_PASSWORD,
      login: async (email, password) => {
        // Simulated network latency for a realistic loading state.
        await new Promise((resolve) => setTimeout(resolve, 500));

        const activePassword = get().password || DEMO_PASSWORD;

        if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== activePassword) {
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
      changePassword: async (currentPassword, newPassword) => {
        await new Promise((resolve) => setTimeout(resolve, 400));
        const activePassword = get().password || DEMO_PASSWORD;
        if (currentPassword !== activePassword) {
          return { success: false, error: "Current password is incorrect." };
        }
        set({ password: newPassword });
        return { success: true };
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    { name: "aurelia-admin-auth" }
  )
);

export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
