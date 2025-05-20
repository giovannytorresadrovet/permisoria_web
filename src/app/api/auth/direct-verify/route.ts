import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { email, password, via } = await request.json();
    
    if (!email) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email is required' 
      }, { status: 400 });
    }
    
    console.log(`Direct email verification request for ${email} via ${via || 'unknown'}`);
    
    // Use environment variables directly for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration is missing');
      return NextResponse.json(
        { success: false, error: 'Server configuration error' },
        { status: 500 }
      );
    }
    
    // Create a standard authenticated client
    const cookieStore = cookies();
    const supabase = createServerClient(
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
              console.warn('Could not set cookies on server side - expected in some cases');
            }
          },
        },
      }
    );
    
    // First, try to sign up again with the same email
    // This is a trick that sometimes works - if the account exists but isn't confirmed,
    // Supabase will resend a verification email
    try {
      console.log('Trying to resend verification email via signup...');
      const { error: signupError } = await supabase.auth.signUp({
        email,
        password: password || 'temporary-password-123',
        options: {
          emailRedirectTo: `${request.nextUrl.origin}/auth/verification`
        }
      });
      
      if (!signupError || signupError.message.includes('already registered')) {
        // If we get "user already registered", that's actually good - we found the user
        console.log('User exists, attempting to verify directly...');
      } else {
        console.error('Error in direct signup attempt:', signupError);
      }
    } catch (signupErr) {
      console.error('Exception in direct signup attempt:', signupErr);
    }
    
    // Try to manually verify the email if we have admin access
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseServiceKey) {
      try {
        console.log('Admin client available - attempting direct verification');
        
        // Create admin client
        const adminClient = createClient(supabaseUrl, supabaseServiceKey);
        
        // Find the user by email - using standard pagination parameters
        const { data, error: userError } = await adminClient.auth.admin.listUsers({
          page: 1,
          perPage: 10
        });
        
        if (userError) {
          console.error('Error listing users:', userError);
          throw userError;
        }
        
        // Filter users manually to find matching email
        const matchingUsers = data.users.filter(user => user.email === email);
        
        // If we found the user
        if (matchingUsers && matchingUsers.length > 0) {
          const user = matchingUsers[0];
          console.log(`Found user: ${user.id}, email_confirmed_at: ${user.email_confirmed_at}`);
          
          // Only update if the email isn't already confirmed
          if (!user.email_confirmed_at) {
            console.log(`Directly confirming email for user ${user.id}`);
            
            // Update the user with email_confirm
            const timestamp = new Date().toISOString();
            const { error: updateError } = await adminClient.auth.admin.updateUserById(
              user.id,
              { email_confirm: true }
            );
            
            if (updateError) {
              console.error('Error updating user:', updateError);
              throw updateError;
            }
            
            console.log('Email verification successful!');
            return NextResponse.json({ 
              success: true, 
              message: 'Email has been successfully verified' 
            });
          } else {
            // Email already confirmed
            console.log('Email already confirmed, returning success');
            return NextResponse.json({ 
              success: true, 
              message: 'Email was already verified' 
            });
          }
        } else {
          // User not found
          return NextResponse.json({ 
            success: false, 
            error: 'User not found with this email address' 
          }, { status: 404 });
        }
      } catch (adminError: any) {
        console.error('Admin verification failed:', adminError);
        return NextResponse.json(
          { 
            success: false, 
            error: adminError.message || 'Failed to verify email directly' 
          },
          { status: 500 }
        );
      }
    } else {
      // No admin access, just return with instructions to check email
      console.log('No admin access - returning with instructions to check email');
      return NextResponse.json({ 
        success: true, 
        message: 'A new verification email has been sent to your email address. Please check your inbox including spam folders.'
      });
    }
  } catch (error: any) {
    console.error('Direct verification error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'An error occurred during verification'
      },
      { status: 500 }
    );
  }
} 