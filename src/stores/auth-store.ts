import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"
import type { User as FirebaseUser } from "firebase/auth"
import type { User } from "@/schemas"

import { auth } from "@/lib/firebase/firebase-config"

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

const transformFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email || "",
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
})

export const useAuthStore = create<AuthStore>()(
  subscribeWithSelector((set) => ({
    // State
    currentUser: null,
    loading: true,
    isInitialized: false,

    // Actions
    setCurrentUser: (user) => set({ currentUser: user }),
    setLoading: (loading) => set({ loading }),
    setInitialized: (initialized) => set({ isInitialized: initialized }),

    signIn: async (email: string, password: string) => {
      await signInWithEmailAndPassword(auth, email, password)
    },

    signUp: async (email: string, password: string) => {
      await createUserWithEmailAndPassword(auth, email, password)
    },

    signInWithGoogle: async () => {
      const provider = new GoogleAuthProvider()
      await signInWithPopup(auth, provider)
    },

    logout: async () => {
      await signOut(auth)
    },
  }))
)

let authUnsubscribe: (() => void) | null = null

export const initializeAuth = () => {
  if (authUnsubscribe) return

  const { setCurrentUser, setLoading, setInitialized } = useAuthStore.getState()

  authUnsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user ? transformFirebaseUser(user) : null)
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
