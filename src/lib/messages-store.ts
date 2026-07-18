import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ContactMessage, MessageStatus } from "@/types";
import { seedMessages } from "@/data/seed";

interface MessagesState {
  items: ContactMessage[];
  setStatus: (id: string, status: MessageStatus) => void;
  remove: (id: string) => void;
}

export const useMessagesStore = create<MessagesState>()(
  persist(
    (set, get) => ({
      items: seedMessages,
      setStatus: (id, status) =>
        set({ items: get().items.map((m) => (m.id === id ? { ...m, status } : m)) }),
      remove: (id) => set({ items: get().items.filter((m) => m.id !== id) }),
    }),
    { name: "aurelia-admin-messages" }
  )
);
