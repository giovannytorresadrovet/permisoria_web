import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is missing. Please check your environment variables.');
    throw new Error('Missing Supabase environment variables');
  }
  
  try {
    const cookieStore = cookies();
    
    return createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch (error) {
              // The `setAll` method might be called from a Server Component where setting cookies is not allowed
              // This can be ignored if you have middleware refreshing user sessions
              console.log('Warning: Could not set cookies in a Server Component. This is expected if you have middleware.');
            }
          },
        },
      }
    );
  } catch (error) {
    console.error('Error creating Supabase server client:', error);
    throw error;
  }
} 