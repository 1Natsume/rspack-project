
import { UserState } from '@/hooks/use-auth/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout:() =>{
        set({})
      }
    }),
    {
      name: 'user-storage',
    }
  )
)