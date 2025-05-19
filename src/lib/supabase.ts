import { createClient } from '@supabase/supabase-js';

// Safely get environment variables with fallbacks for development
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client in a way that won't break in development
let supabaseInstance: ReturnType<typeof createClient> | null = null;

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false, // Don't persist session in server environment
        autoRefreshToken: true,
        detectSessionInUrl: false,
      },
    });
  } else if (process.env.NODE_ENV === 'development') {
    // Provide a mock instance for development to prevent crashes
    console.warn('Missing Supabase environment variables in development');
    supabaseInstance = createClient('https://example.supabase.co', 'example-key', {
      auth: { persistSession: false },
    });
  } else {
    throw new Error('Missing required Supabase environment variables');
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Provide a mock instance that will return appropriate errors
  supabaseInstance = createClient('https://example.supabase.co', 'example-key', {
    auth: { persistSession: false },
  });
}

// Export the singleton instance
export const supabase = supabaseInstance;

// For server-side functions that need the service role
export const getServiceSupabase = () => {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  
  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL environment variable');
  }
  
  if (!supabaseServiceKey) {
    throw new Error('Missing Supabase service key environment variable');
  }
  
  try {
    // Create a client with the service role key and specific auth configuration
    return createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        // Service role clients should skip the auth process entirely
        detectSessionInUrl: false,
      },
      global: {
        // Identify this client as a service role client to Supabase
        headers: {
          'X-Client-Info': 'permisoria-service-role',
        },
      },
    });
  } catch (error) {
    console.error('Failed to initialize Supabase service client:', error);
    throw new Error('Failed to initialize Supabase service client');
  }
}; 