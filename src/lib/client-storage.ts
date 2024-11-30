const STORAGE_KEY = 'pdf_markdown_';

export const clientStorage = {
  store: (markdown: string): string => {
    const id = Math.random().toString(36).substring(2, 15);
    const key = STORAGE_KEY + id;
    localStorage.setItem(key, markdown);
    return id;
  },

  get: (id: string): string | null => {
    const key = STORAGE_KEY + id;
    return localStorage.getItem(key);
  },

  remove: (id: string): void => {
    const key = STORAGE_KEY + id;
    localStorage.removeItem(key);
  },
};
