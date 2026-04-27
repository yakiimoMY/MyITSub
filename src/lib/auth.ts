import { createServerFn } from '@tanstack/react-start'
import { User } from '@supabase/supabase-js'
import { supabase } from './supabase'

export type { User as IdentityUser }

/**
 * Get the currently authenticated user from the server.
 * Returns null if not authenticated.
 */
export const getServerUser = createServerFn({ method: 'GET' }).handler(
  async () => {
    // Note: For Supabase, server-side auth needs JWT handling
    // For now, returning null; adapt for Cloudflare Workers if needed
    return null
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
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Client-side signup function
 */
export async function clientSignup(email: string, password: string) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Client-side update user metadata
 */
export async function updateUserMetadata(metadata: Record<string, any>) {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: metadata,
    })
    if (error) throw error
    return { success: true, user: data.user }
  } catch (error) {
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Client-side logout function
 */
export async function clientLogout() {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Logout error:', error)
}
