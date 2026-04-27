import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { getUser, logout as nlLogout, onAuthChange, type User } from '@netlify/identity'

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
    // Initialize from current session
    getUser().then((u) => {
      setUser(u ?? null)
      setReady(true)
    })

    // Subscribe to auth changes
    const unsubscribe = onAuthChange((u) => {
      setUser(u ?? null)
    })

    return unsubscribe
  }, [])

  const handleLogout = async () => {
    await nlLogout()
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
