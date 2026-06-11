import { create } from 'zustand';

const STORAGE_KEY = 'theme-dark';

// 다크모드 상태를 localStorage에 영속화한다.
const useThemeStore = create((set, get) => ({
  isDark: localStorage.getItem(STORAGE_KEY) === 'true',

  toggle: () => {
    const next = !get().isDark;
    localStorage.setItem(STORAGE_KEY, String(next));
    set({ isDark: next });
  },
}));

export default useThemeStore;
