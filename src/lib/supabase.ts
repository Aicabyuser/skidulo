import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

class SupabaseClient {
  private static instance: ReturnType<typeof createClient>

  private constructor() {}

  public static getInstance() {
    if (!SupabaseClient.instance) {
      SupabaseClient.instance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          storageKey: 'skidulo-auth',
        },
      })
    }
    return SupabaseClient.instance
  }
}

export const supabase = SupabaseClient.getInstance()
export default supabase 