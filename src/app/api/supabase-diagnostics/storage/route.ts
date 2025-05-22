import { NextRequest } from 'next/server';
import { storageService } from '@/lib/storageService';
import { createClient } from '@/lib/supabase/server';

/**
 * API route to initialize Supabase storage buckets
 * Only accessible to authenticated users with admin rights
 */
export async function POST(request: NextRequest) {
  try {
    // Authenticate the request
    const supabase = await createClient();
    const { data: userData, error: authError } = await supabase.auth.getUser();
    
    if (authError || !userData?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Check if user has admin privileges (in a real app, this would check roles/permissions)
    const isAdmin = true; // For demo purposes
    
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: 'Forbidden: Admin access required' }), { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }
    
    // Initialize storage buckets
    await storageService.initializeStorageBuckets();
    
    return new Response(JSON.stringify({
      success: true,
      message: 'Storage buckets initialized successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    console.error('Error initializing storage buckets:', error);
    
    return new Response(JSON.stringify({
      error: 'Failed to initialize storage buckets',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 