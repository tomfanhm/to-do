import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

import type { User } from "@/features/auth/schemas"
import { authService } from "@/services/auth.service"

interface AuthState {
  currentUser: User | null
  loading: boolean
  isInitialized: boolean
}

interface AuthActions {
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  logout: () => Promise<void>
  setCurrentUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  setInitialized: (initialized: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    currentUser: null,
    loading: true,
    isInitialized: false,

    setCurrentUser: (user) => set({ currentUser: user }),
    setLoading: (loading) => set({ loading }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),

    signIn: async (email, password) => {
      await authService.signIn(email, password)
    },

    signUp: async (email, password) => {
      await authService.signUp(email, password)
    },

    signInWithGoogle: async () => {
      await authService.signInWithGoogle()
    },

    logout: async () => {
      await authService.logout()
    },
  }))
)

let authUnsubscribe: (() => void) | null = null

export const initializeAuth = () => {
  if (authUnsubscribe) return

  const { setCurrentUser, setLoading, setInitialized } = useAuthStore.getState()

  authUnsubscribe = authService.onAuthStateChanged((user) => {
    setCurrentUser(user)
    setLoading(false)

    if (!useAuthStore.getState().isInitialized) {
      setInitialized(true)
    }
  })
}

export const cleanupAuth = () => {
  if (authUnsubscribe) {
    authUnsubscribe()
    authUnsubscribe = null
  }
}
