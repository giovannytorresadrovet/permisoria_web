import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const serviceClient = getServiceSupabase();
    
    // Test queries that specifically require service role permissions
    // First, try to access system tables which are only accessible with service role
    const result = await Promise.allSettled([
      // Try to access system schemas - only service role can do this
      serviceClient.from('_prisma_migrations').select('*', { count: 'exact', head: true }),
      serviceClient.rpc('get_schema_version'), // This may not exist in all projects
      serviceClient.from('auth.users').select('id, email', { count: 'exact', head: true }), // Service role can access auth.users directly
    ]);
    
    // Process results
    const processedResults = result.map((res, index) => {
      if (res.status === 'fulfilled') {
        return {
          test: index === 0 ? 'prisma_migrations' : index === 1 ? 'schema_version' : 'auth_users',
          status: res.value.error ? 'error' : 'success',
          error: res.value.error ? res.value.error.message : null
        };
      } else {
        return {
          test: index === 0 ? 'prisma_migrations' : index === 1 ? 'schema_version' : 'auth_users',
          status: 'error',
          error: res.reason ? (res.reason instanceof Error ? res.reason.message : String(res.reason)) : 'Unknown error'
        };
      }
    });
    
    // Check if any test succeeded
    const anySuccess = processedResults.some(r => r.status === 'success');
    
    return NextResponse.json({
      status: anySuccess ? 'success' : 'error',
      message: anySuccess ? 'Service role client has appropriate permissions' : 'Service role client does not have expected permissions',
      results: processedResults,
      timestamp: new Date().toISOString()
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache',
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Service role client test failed',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 