import { ConfigState } from '@/types/config/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useconfigStore = create<ConfigState>()(
  persist(
    (set, get) => ({
      collapsed: false,
      bg: '',
      fontSize: '16',
      fontColor: '#fff',
      darkMode: false,
      lang: 'zh',
      token: '',
      refreshToken: '',
      setCollapsed: (collapsed) => set({ collapsed }),
      setDarkMode: (darkMode) => set({
        darkMode,
      }),
      setLang: (lang) => set({
        lang,
      }),
      setToken: (token) => set({
        token,
      }),
      setRefreshToken: (refreshToken) => set({
        refreshToken,
      }),
    }),
    {
      name: 'config-storage',
    }
  )
);
