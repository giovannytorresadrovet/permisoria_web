import { createClient } from '@supabase/supabase-js';

// Standard client for most operations
export const createSupabaseClient = () => {
  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  console.log('Creating Supabase client with URL:', supabaseUrl?.substring(0, 20) + '...');
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables!');
  }
  
  // Create client with default auth configurations for browsers
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb:token',
      detectSessionInUrl: true,
      flowType: 'implicit'
    },
    global: {
      headers: {
        'X-Client-Info': 'permisoria-web-client'
      }
    }
  });
};

// Admin client for operations that need more privileges
export const createSupabaseAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  if (!serviceRoleKey) {
    console.error('SUPABASE_SERVICE_ROLE_KEY is not defined');
    throw new Error('Supabase service role key is not configured');
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    },
    global: {
      headers: {
        'X-Client-Info': 'permisoria-admin-client'
      }
    }
  });
}; 