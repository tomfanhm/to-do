import type { User } from "@/features/auth/schemas"
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth"
import type { User as FirebaseUser } from "firebase/auth"

import { auth } from "@/lib/firebase/firebase-config"

function transformFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email || "",
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  }
}

export const authService = {
  async signIn(email: string, password: string): Promise<User> {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    return transformFirebaseUser(credential.user)
  },

  async signUp(email: string, password: string): Promise<User> {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    return transformFirebaseUser(credential.user)
  },

  async signInWithGoogle(): Promise<User> {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    return transformFirebaseUser(credential.user)
  },

  async logout(): Promise<void> {
    await signOut(auth)
  },

  onAuthStateChanged(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, (firebaseUser) => {
      callback(firebaseUser ? transformFirebaseUser(firebaseUser) : null)
    })
  },
}
