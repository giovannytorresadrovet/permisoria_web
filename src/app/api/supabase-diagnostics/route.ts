import { NextResponse } from 'next/server';
import { supabase, getServiceSupabase } from '@/lib/supabase';

type ErrorEntry = {
  source: string;
  message: string;
};

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
    summary: 'Not tested'
  };
  
  // Test standard client
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      diagnostics.authClientStatus = 'Error';
      diagnostics.errors.push({
        source: 'auth_client',
        message: authError.message
      });
    } else {
      diagnostics.authClientStatus = 'Connected';
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
      const { data, error } = await serviceClient.auth.getUser();
      
      if (error) {
        diagnostics.serviceClientStatus = 'Error';
        diagnostics.errors.push({
          source: 'service_client',
          message: error.message
        });
      } else {
        diagnostics.serviceClientStatus = 'Connected';
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
  } else {
    diagnostics.summary = 'FAILURE: Supabase connection issues detected';
  }
  
  // Format with indentation for readability
  return NextResponse.json(diagnostics, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    }
  });
} 