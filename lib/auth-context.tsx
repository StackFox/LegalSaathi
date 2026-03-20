'use client'

import { createContext, useContext, useMemo, ReactNode } from 'react'
import { useUser, useAuth as useClerkAuth } from '@clerk/nextjs'

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>
  signOut: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user: clerkUser } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()

  const mappedUser = useMemo<User | null>(() => {
    if (!isSignedIn || !clerkUser) return null

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses?.[0]?.emailAddress ||
      ''

    const emailLower = email.toLowerCase()
    const roleFromMetadata = (clerkUser.publicMetadata as any)?.role
    const role = roleFromMetadata === 'admin' || emailLower === 'admin@legalsaathi.in' ? 'admin' : 'user'

    const name =
      clerkUser.fullName ||
      clerkUser.username ||
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      email ||
      'User'

    return {
      id: clerkUser.id,
      email,
      name,
      role,
      avatar: clerkUser.imageUrl,
    }
  }, [clerkUser, isSignedIn])

  const signIn = async (_email: string, _password: string): Promise<{ success: boolean; error?: string }> => {
    // This app uses Clerk's prebuilt sign-in page.
    window.location.href = '/sign-in'
    return { success: false, error: 'Use Clerk sign-in page' }
  }

  const signUp = async (_email: string, _password: string, _name: string): Promise<{ success: boolean; error?: string }> => {
    // This app uses Clerk's prebuilt sign-up page.
    window.location.href = '/sign-up'
    return { success: false, error: 'Use Clerk sign-up page' }
  }

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    // Real OAuth is initiated from the custom Google button (see `components/google-signin-button.tsx`).
    window.location.href = '/sign-in'
    return { success: false, error: 'Use Google sign-in button' }
  }

  const signOut = () => {
    // Clerk signOut is async; we intentionally don't await for compatibility with existing UI handlers.
    void clerkSignOut()
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user: mappedUser,
        isLoading: !isLoaded,
        isAuthenticated: !!mappedUser,
        isAdmin: mappedUser?.role === 'admin',
        signIn, 
        signUp, 
        signInWithGoogle,
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
