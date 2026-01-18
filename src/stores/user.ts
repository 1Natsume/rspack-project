
import { UserState } from '@/types/auth/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setUser: (currentUser) => set({ currentUser }),
      logout:() =>{
        set({})
      }
    }),
    {
      name: 'user-storage',
    }
  )
)