import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Use the service role client
    const serviceClient = getServiceSupabase();
    
    // Just check if we can access existing tables and metadata
    const { data: schemas, error: schemasError } = await serviceClient
      .from('information_schema.schemata')
      .select('schema_name')
      .limit(5);
    
    if (schemasError) {
      return NextResponse.json({ 
        status: 'error', 
        message: 'Could not access database schema information',
        error: schemasError.message 
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Successfully connected to Supabase with service role access',
      schemas: schemas
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to test Supabase service role access',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 