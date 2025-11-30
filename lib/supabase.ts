import { createClient } from '@supabase/supabase-js';

// Environment variables validation (only throw when actually trying to use Supabase)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function validateSupabaseConfig() {
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined');
  }

  if (!supabaseAnonKey) {
    throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined');
  }
}

// Lazy initialization of Supabase clients
let _supabase: ReturnType<typeof createClient> | null = null;

function getSupabaseClient() {
  if (!_supabase) {
    validateSupabaseConfig();
    _supabase = createClient(supabaseUrl!, supabaseAnonKey!);
  }
  return _supabase;
}

// Public client for client-side usage
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(_, prop) {
    return getSupabaseClient()[prop as keyof ReturnType<typeof createClient>];
  },
});

// Server-side client with admin privileges (for server components)
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    console.warn('SUPABASE_SERVICE_ROLE_KEY is not defined, using anon key');
    return getSupabaseClient();
  }

  validateSupabaseConfig();
  return createClient(supabaseUrl!, serviceRoleKey!, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Helper function to handle Supabase errors
export function handleSupabaseError(error: any): never {
  console.error('Supabase error:', error);
  throw new Error(error?.message || 'An unexpected error occurred');
}

// Utility to check if Supabase is properly configured
export function isSupabaseConfigured(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}