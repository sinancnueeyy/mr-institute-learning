import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

if (import.meta.env.PROD && (!import.meta.env.VITE_SUPABASE_URL || supabaseUrl.includes('placeholder'))) {
  console.error(
    "🚨 CRITICAL PRODUCTION ERROR 🚨\n" +
    "Supabase is initializing with placeholder credentials in a production build.\n" +
    "Please populate the correct VITE_SUPABASE_* environment variables before deploying."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

