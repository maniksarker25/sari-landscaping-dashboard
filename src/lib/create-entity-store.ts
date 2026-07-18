import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WithId {
  id: string;
}

interface EntityState<T extends WithId> {
  items: T[];
  add: (item: T) => void;
  update: (id: string, patch: Partial<T>) => void;
  remove: (id: string) => void;
  removeMany: (ids: string[]) => void;
  getById: (id: string) => T | undefined;
}

/**
 * Factory that produces a typed Zustand store with standard CRUD operations
 * for a given content entity, persisted to localStorage under `storageKey`.
 *
 * This keeps every content-type store (services, projects, gallery, blog,
 * testimonials, FAQs) behaving identically — same method names, same
 * update semantics — so the UI layer (data tables, forms) can stay generic
 * too instead of re-implementing add/update/remove per page.
 */
export function createEntityStore<T extends WithId>(storageKey: string, seed: T[]) {
  return create<EntityState<T>>()(
    persist(
      (set, get) => ({
        items: seed,
        add: (item) => set({ items: [item, ...get().items] }),
        update: (id, patch) =>
          set({
            items: get().items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
          }),
        remove: (id) => set({ items: get().items.filter((item) => item.id !== id) }),
        removeMany: (ids) =>
          set({ items: get().items.filter((item) => !ids.includes(item.id)) }),
        getById: (id) => get().items.find((item) => item.id === id),
      }),
      { name: storageKey }
    )
  );
}
