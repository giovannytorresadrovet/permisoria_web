import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Get the authenticated user from the request
 */
export async function getUser(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getUser();
    
    if (error || !data.user) {
      return null;
    }
    
    return data.user;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

/**
 * Check if a user has a specific permission for a resource
 */
export async function hasPermission(userId: string, resourceId: string, permission: string): Promise<boolean> {
  // In a real implementation, this would check the database for permissions
  // This is a simplified version that always returns true
  console.log(`Checking permission ${permission} for user ${userId} on resource ${resourceId}`);
  
  // For demonstration purposes, we'll allow all permissions
  return true;
} 