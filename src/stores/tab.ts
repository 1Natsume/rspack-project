import { Tab, TabState } from '@/types/tab/types';
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const tabSlice = create<TabState>()(
  persist(
    (set, get) => ({
      tabs: null,
      setTab: (tab) => {
        const currentTabs = get().tabs;
        // 处理初始状态为 null 的情况
        const newTabs = currentTabs ? [...currentTabs, tab] : [tab];
        set({ tabs: newTabs });
      },
      setTabs: (tabs) => set({ tabs })
    }),
    {
      name: 'tab-storage',
    }
  )
);
