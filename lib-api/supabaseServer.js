// =====================================================
// SUPABASE SERVER CLIENT
// Cliente para uso no backend (service role)
// =====================================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase server environment variables');
}

// Cliente com service_role (bypass RLS para operações admin)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Cliente para operações que respeitam RLS
export const supabase = createClient(supabaseUrl, process.env.VITE_SUPABASE_ANON_KEY);
