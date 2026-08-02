/**
 * Decoupled in-memory binary file store.
 * Prevents DOM File/Blob objects from being stored in React Hook Form state tree,
 * eliminating RHF deep-cloning and Zod validation performance bottlenecks.
 */
const fileMap = new Map<string, File>();

export const fileRegistry = {
  set(key: string, file: File): void {
    fileMap.set(key, file);
  },
  get(key: string): File | undefined {
    return fileMap.get(key);
  },
  has(key: string): boolean {
    return fileMap.has(key);
  },
  delete(key: string): void {
    fileMap.delete(key);
  },
  clear(): void {
    fileMap.clear();
  },
};
