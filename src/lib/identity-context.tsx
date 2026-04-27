import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'
import { clientLogout } from './auth'

interface IdentityContextValue {
  user: User | null
  ready: boolean
  logout: () => Promise<void>
  isAdmin: boolean
}

const IdentityContext = createContext<IdentityContextValue | null>(null)

export function IdentityProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setReady(true)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await clientLogout()
    setUser(null)
  }

  const isAdmin = user?.user_metadata?.role === 'admin' || false

  const value: IdentityContextValue = {
    user,
    ready,
    logout: handleLogout,
    isAdmin,
  }

  return (
    <IdentityContext.Provider value={value}>
      {children}
    </IdentityContext.Provider>
  )
}

export function useIdentity() {
  const context = useContext(IdentityContext)
  if (!context) {
    throw new Error('useIdentity must be used within IdentityProvider')
  }
  return context
}
