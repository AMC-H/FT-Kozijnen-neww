import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  initialized: boolean
  signUp: (email: string, password: string, userData: any) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    let mounted = true

    const initializeAuth = async () => {
      try {
        // Get initial session from Supabase
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (mounted) {
          if (error) {
            console.error('Error getting initial session:', error)
          }
          
          setSession(session)
          setUser(session?.user ?? null)
          setInitialized(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
        if (mounted) {
          setSession(null)
          setUser(null)
          setInitialized(true)
          setLoading(false)
        }
      }
    }

    // Initialize auth state
    initializeAuth()

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        
        if (!initialized) {
          setInitialized(true)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [initialized])

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: undefined // Disable email confirmation
        }
      })
      
      // If signup successful, create profile
      if (data.user && !error) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              full_name: `${userData.first_name} ${userData.last_name}`.trim(),
              phone: userData.phone || null,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ])
        
        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
      
      setLoading(false)
      return { data, error }
    } catch (error) {
      setLoading(false)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      // Update last login time if successful
      if (data.user && !error) {
        const { error: updateError } = await supabase
          .from('profiles')
          .upsert([
            {
              id: data.user.id,
              updated_at: new Date().toISOString()
            }
          ])
        
        if (updateError) {
          console.error('Error updating profile:', updateError)
        }
      }
      
      setLoading(false)
      return { data, error }
    } catch (error) {
      setLoading(false)
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (!error) {
        setSession(null)
        setUser(null)
      }
      return { error }
    } catch (error) {
      return { error }
    }
  }

  const value = {
    user,
    session,
    loading,
    initialized,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}