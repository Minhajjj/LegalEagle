import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  // Browser Supabase client for auth state + client-side reads (e.g. documents/profile pages).
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}