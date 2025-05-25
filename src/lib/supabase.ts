
import { createClient } from '@supabase/supabase-js'
import { env } from '@/config/env'
import type { Database } from '@/integrations/supabase/types'

export const supabase = createClient<Database>(env.supabase.url, env.supabase.anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage,
  },
})
