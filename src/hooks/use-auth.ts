import { useAuthStore } from "@/stores/auth-store"

export const useAuth = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const loading = useAuthStore((state) => state.loading)
  const isInitialized = useAuthStore((state) => state.isInitialized)
  const signIn = useAuthStore((state) => state.signIn)
  const signUp = useAuthStore((state) => state.signUp)
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle)
  const logout = useAuthStore((state) => state.logout)

  return {
    currentUser,
    loading,
    isInitialized,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
  }
}
