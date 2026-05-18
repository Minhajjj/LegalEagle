import { createBrowserClient } from '@supabase/ssr'
import { getSupabaseUrl, getSupabaseAnonKey } from '@/lib/env'

export function createClient() {
  // Browser Supabase client for auth state + client-side reads (e.g. documents/profile pages).
  return createBrowserClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
  )
}