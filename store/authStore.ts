import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  email: string
  token: string
  role: string
  userId?: string
}

interface AuthStore {
  user: User | null

  setUser: (user: User) => void

  logout: () => void

  getToken: () => string | null
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,

      setUser: user => {
        set({ user })
      },

      logout: () => {
        set({ user: null })
        // Clear the persisted storage
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth-storage')
        }
      },

      getToken: () => {
        return get().user?.token || null
      },
    }),
    {
      name: 'auth-storage',
    }
  )
)