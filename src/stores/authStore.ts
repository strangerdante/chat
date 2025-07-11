import { defineStore } from 'pinia'
import { ref, computed, type Ref, type ComputedRef } from 'vue'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

interface UserProfile {
  uid: string
  email: string | null
  displayName?: string
  createdAt?: any
  isOnline?: boolean
  lastSeen?: any
}

interface AuthStore {
  user: Ref<UserProfile | null>
  loading: Ref<boolean>
  error: Ref<string | null>
  isAuthenticated: ComputedRef<boolean>
  userProfile: ComputedRef<UserProfile | null>
  initializeAuthListener: () => void
  register: (email: string, password: string, displayName: string) => Promise<boolean>
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  clearError: () => void
}

export const useAuthStore = defineStore('auth', (): AuthStore => {
  const user = ref<UserProfile | null>(null)
  const loading = ref<boolean>(true)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => !!user.value)
  const userProfile = computed(() => user.value)

  // Initialize auth state listener
  const initializeAuthListener = () => {
    onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get additional user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          if (userDoc.exists()) {
            user.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              ...userDoc.data()
            }
            
            // Update online status
            await updateDoc(doc(db, 'users', firebaseUser.uid), {
              isOnline: true,
              lastSeen: serverTimestamp()
            })
          }
        } catch (err) {
          console.error('Error loading user data:', err)
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || undefined
          }
        }
      } else {
        user.value = null
      }
      loading.value = false
    })
  }

  const register = async (email: string, password: string, displayName: string): Promise<boolean> => {
    try {
      error.value = null
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      
      // Update profile with display name
      await updateProfile(firebaseUser, { displayName })
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        displayName,
        email,
        createdAt: serverTimestamp(),
        isOnline: true,
        lastSeen: serverTimestamp()
      })
      
      return true
    } catch (err: any) {
      console.error('Registration error:', err)
      error.value = getErrorMessage(err.code)
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      error.value = null
      loading.value = true
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      
      // Esperar a que el listener de onAuthStateChanged procese el usuario
      await new Promise<void>((resolve) => {
        const checkAuth = () => {
          if (user.value && user.value.uid === userCredential.user.uid) {
            resolve()
          } else {
            setTimeout(checkAuth, 50)
          }
        }
        checkAuth()
      })
      
      return true
    } catch (err: any) {
      console.error('Login error:', err)
      error.value = getErrorMessage(err.code)
      return false
    } finally {
      loading.value = false
    }
  }

  const logout = async (): Promise<void> => {
    try {
      if (user.value) {
        // Update offline status before signing out
        try {
          await updateDoc(doc(db, 'users', user.value.uid), {
            isOnline: false,
            lastSeen: serverTimestamp()
          })
        } catch (updateError) {
          console.warn('Could not update offline status:', updateError)
          // Continue with logout even if status update fails
        }
      }
      
      await signOut(auth)
      user.value = null
      error.value = null // Clear any previous errors
    } catch (err: any) {
      console.error('Logout error:', err)
      error.value = 'Error al cerrar sesión'
      // Force user to null even if there's an error
      user.value = null
      throw err // Re-throw to let the calling component handle it
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Helper function to translate Firebase error codes to Spanish
  const getErrorMessage = (errorCode: string): string => {
    const errorMessages: Record<string, string> = {
      'auth/user-not-found': 'No existe una cuenta con este correo electrónico',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Ya existe una cuenta con este correo electrónico',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email': 'Correo electrónico inválido',
      'auth/too-many-requests': 'Demasiados intentos fallidos. Intenta más tarde',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/invalid-credential': 'Credenciales inválidas. Verifica tu correo y contraseña'
    }
    
    return errorMessages[errorCode] || 'Error de autenticación. Intenta nuevamente'
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    userProfile,
    initializeAuthListener,
    register,
    login,
    logout,
    clearError
  }
}) 