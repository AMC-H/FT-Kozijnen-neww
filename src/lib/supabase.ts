import { createClient } from '@supabase/supabase-js'

// Load environment variables with fallback to prevent build errors
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://nsmzfzdvesacindbgkdq.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Create Supabase client for browser use
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    headers: {
      'X-Client-Info': 'ft-kozijnen-app'
    }
  }
})