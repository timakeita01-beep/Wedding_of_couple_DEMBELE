import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  import.meta.env.local.VITE_SUPABASE_URL,
  import.meta.env.local.VITE_SUPABASE_ANON_KEY
)