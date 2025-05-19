import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Test the connection with a simple health check
    const { error } = await supabase.from('_prisma_migrations').select('*', { count: 'exact', head: true });
    
    if (error) {
      // Let's try an even more basic test
      const { data: healthCheck, error: healthError } = await supabase.rpc('get_instance_health');
      
      if (healthError) {
        // Fall back to just fetching project info
        const { data: project, error: projectError } = await supabase.auth.getSession();
        
        if (projectError) {
          return NextResponse.json({ 
            status: 'error', 
            message: 'Failed to connect to Supabase',
            error: projectError.message 
          }, { status: 500 });
        }
        
        return NextResponse.json({ 
          status: 'partial', 
          message: 'Connected to Supabase Auth, but could not access database',
          auth: project ? 'active' : 'unknown'
        }, { status: 200 });
      }
      
      return NextResponse.json({ 
        status: 'partial', 
        message: 'Connected to Supabase, but could not access database tables',
        health: healthCheck
      }, { status: 200 });
    }
    
    return NextResponse.json({ 
      status: 'success', 
      message: 'Successfully connected to Supabase',
      connection: 'fully active'
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Failed to connect to Supabase',
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 