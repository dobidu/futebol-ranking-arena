
export const storage = {
  get: (key: string) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  },
  set: (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
};

export const createService = <T extends { id: string }>(key: string) => ({
  getAll: (): T[] => storage.get(key) || [],
  getById: (id: string): T | undefined => {
    const items: T[] = storage.get(key) || [];
    return items.find((item: any) => item.id === id);
  },
  create: (item: Omit<T, 'id'> & { id?: string }): void => {
    const items: T[] = storage.get(key) || [];
    const newItem = { ...item, id: item.id || crypto.randomUUID() } as T;
    storage.set(key, [...items, newItem]);
  },
  update: (id: string, updatedItem: Partial<T>): void => {
    const items: T[] = storage.get(key) || [];
    const updatedItems = items.map((item: any) => (item.id === id ? { ...item, ...updatedItem } : item));
    storage.set(key, updatedItems);
  },
  delete: (id: string): void => {
    const items: T[] = storage.get(key) || [];
    const filteredItems = items.filter((item: any) => item.id !== id);
    storage.set(key, filteredItems);
  },
});
