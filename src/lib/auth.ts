import { createServerFn } from '@tanstack/react-start'
import { getUser, login, logout, signup, type User } from '@netlify/identity'

export type { User as IdentityUser }

/**
 * Get the currently authenticated user from the server.
 * Returns null if not authenticated.
 */
export const getServerUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    const user = await getUser()
    return (user ?? null) as any
  }
)

/**
 * Check if user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  return user?.user_metadata?.role === role || false
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return hasRole(user, 'admin')
}

/**
 * Client-side login function
 */
export async function clientLogin(email: string, password: string) {
  try {
    const user = await login(email, password, true)
    return { success: true, user }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Client-side signup function
 */
export async function clientSignup(email: string, password: string) {
  try {
    const user = await signup(email, password)
    return { success: true, user }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Client-side update user metadata
 */
export async function updateUserMetadata(metadata: Record<string, any>) {
  // Note: @netlify/identity does not support updating user metadata client-side.
  // This requires server-side API calls or admin access.
  // For Cloudflare deployment, replace with appropriate auth provider.
  throw new Error('User metadata update not supported in current setup')
}
