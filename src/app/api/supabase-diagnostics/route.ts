import { NextResponse } from 'next/server';
import { supabase, getServiceSupabase } from '@/lib/supabase';

type ErrorEntry = {
  source: string;
  message: string;
};

// IMPORTANT: Disable all caching for this route
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET() {
  const diagnostics = {
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Configured' : 'Missing',
      supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Configured' : 'Missing',
      supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Configured' : 'Missing',
      databaseUrl: process.env.DATABASE_URL ? 'Configured' : 'Missing',
      nodeEnv: process.env.NODE_ENV || 'Not set'
    },
    authClientStatus: 'Not tested',
    serviceClientStatus: 'Not tested',
    errors: [] as ErrorEntry[],
    summary: 'Not tested',
    timestamp: new Date().toISOString()
  };
  
  // Test standard client with timeout
  try {
    const authPromise = supabase.auth.getSession();
    const authTimeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error("Auth client connection timed out after 5 seconds")), 5000);
    });
    
    try {
      const { data: authData, error: authError } = await Promise.race([authPromise, authTimeoutPromise]) as any;
      
      if (authError) {
        diagnostics.authClientStatus = 'Error';
        diagnostics.errors.push({
          source: 'auth_client',
          message: authError.message || 'Unknown auth client error'
        });
      } else {
        diagnostics.authClientStatus = 'Connected';
      }
    } catch (error) {
      // This will catch timeout errors or any other errors that might occur
      diagnostics.authClientStatus = 'Error';
      diagnostics.errors.push({
        source: 'auth_client_timeout',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  } catch (error) {
    diagnostics.authClientStatus = 'Exception';
    diagnostics.errors.push({
      source: 'auth_client_exception',
      message: error instanceof Error ? error.message : String(error)
    });
  }
  
  // Test service role client
  try {
    // Creating a service client may throw if environment variables are missing
    const serviceClient = getServiceSupabase();
    
    try {
      // Instead of getUser, use a simpler operation that doesn't require auth
      // For example, fetching just one row from a system table with limit=1
      const servicePromise = serviceClient.from('_prisma_migrations').select('*', { count: 'exact', head: true });
      
      // Fallback in case _prisma_migrations doesn't exist
      const fallbackPromise = async () => {
        const { data, error } = await serviceClient.from('auth').select('id', { count: 'exact', head: true });
        if (error) {
          throw error;
        }
        return { data, error: null };
      };
      
      const serviceTimeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error("Service client connection timed out after 5 seconds")), 5000);
      });
      
      try {
        // Try the main query first
        let result;
        try {
          result = await Promise.race([servicePromise, serviceTimeoutPromise]) as any;
        } catch (e) {
          // If that fails, try the fallback
          result = await Promise.race([fallbackPromise(), serviceTimeoutPromise]) as any;
        }
        
        const { error } = result;
        
        if (error) {
          diagnostics.serviceClientStatus = 'Error';
          diagnostics.errors.push({
            source: 'service_client',
            message: error.message || 'Unknown service client error'
          });
        } else {
          diagnostics.serviceClientStatus = 'Connected';
        }
      } catch (error) {
        // This will catch timeout errors
        diagnostics.serviceClientStatus = 'Timeout';
        diagnostics.errors.push({
          source: 'service_client_timeout',
          message: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      diagnostics.serviceClientStatus = 'API Exception';
      diagnostics.errors.push({
        source: 'service_client_api',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  } catch (error) {
    diagnostics.serviceClientStatus = 'Creation Exception';
    diagnostics.errors.push({
      source: 'service_client_creation',
      message: error instanceof Error ? error.message : String(error)
    });
  }
  
  // Generate a summary
  if (diagnostics.authClientStatus === 'Connected' && diagnostics.serviceClientStatus === 'Connected') {
    diagnostics.summary = 'SUCCESS: All Supabase connections are working properly';
  } else if (diagnostics.authClientStatus === 'Connected') {
    diagnostics.summary = 'PARTIAL: Anonymous client is working, but service role client has issues';
  } else if (diagnostics.serviceClientStatus === 'Connected') {
    diagnostics.summary = 'PARTIAL: Service role client is working, but anonymous client has issues';
  } else {
    diagnostics.summary = 'FAILURE: Supabase connection issues detected';
  }
  
  // Format with indentation for readability
  return NextResponse.json(diagnostics, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
} 