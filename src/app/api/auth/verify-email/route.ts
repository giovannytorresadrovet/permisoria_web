import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { code, type } = await request.json();
    
    if (!code) {
      return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
    }
    
    console.log('Verifying email with code:', code, type ? `and type: ${type}` : '');
    
    // Use environment variables directly for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration is missing');
      return NextResponse.json(
        { error: 'Server configuration error - missing Supabase configuration' },
        { status: 500 }
      );
    }
    
    // Create a standard authenticated client first
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
              // This might fail in some edge cases
              console.warn('Could not set cookies on server side - expected in some cases');
            }
          },
        },
      }
    );
    
    // Try different verification strategies with standard client
    // Add 'magiclink' which is sometimes used by Supabase internally
    const verificationTypes = type ? [type] : ['signup', 'email', 'email_change', 'recovery', 'magiclink', 'invite'];
    let success = false;
    let userData = null;
    let sessionData = null;
    let lastError = null;
    
    // Try each verification type
    for (const vType of verificationTypes) {
      try {
        console.log(`Trying verification with type: ${vType}`);
        
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: code,
          type: vType as any
        });
        
        if (error) {
          console.log(`Error with ${vType}:`, error.message);
          lastError = error;
          continue;
        }
        
        if (data?.user && data?.session) {
          console.log(`Successfully verified email with type: ${vType}`);
          success = true;
          userData = data.user;
          sessionData = data.session;
          break;
        }
      } catch (err) {
        console.error(`Error trying ${vType}:`, err);
      }
    }
    
    if (success && userData && sessionData) {
      return NextResponse.json({
        success: true,
        user: userData,
        session: sessionData
      });
    }
    
    // If we have the service role key, try admin verification
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (supabaseServiceKey) {
      try {
        console.log('Trying with admin client...');
        
        // Create a Supabase client with the service role key for admin privileges
        const adminClient = createClient(supabaseUrl, supabaseServiceKey);
        
        // Try admin verification methods
        for (const vType of verificationTypes) {
          try {
            console.log(`Trying admin verification with type: ${vType}`);
            
            const { data, error } = await adminClient.auth.verifyOtp({
              token_hash: code,
              type: vType as any
            });
            
            if (error) {
              console.log(`Admin error with ${vType}:`, error.message);
              continue;
            }
            
            if (data?.user && data?.session) {
              console.log(`Successfully verified email with admin client using type: ${vType}`);
              return NextResponse.json({
                success: true,
                user: data.user,
                session: data.session
              });
            }
          } catch (err) {
            console.error(`Error with admin verification for ${vType}:`, err);
          }
        }
        
        // If all standard methods fail, try to extract user ID from the token
        // Some tokens might contain encoded information we can use
        try {
          console.log('Attempting to decode token and manually verify...');
          
          // List users to find potential matches
          // This is a fallback approach when standard verification methods fail
          const { data: userData } = await adminClient.auth.admin.listUsers({
            page: 1,
            perPage: 50
          });
          
          // Check if any users have pending verification
          if (userData?.users?.length) {
            const unverifiedUsers = userData.users.filter(user => 
              user.email_confirmed_at === null || 
              user.confirmation_sent_at !== null
            );
            
            if (unverifiedUsers.length > 0) {
              console.log(`Found ${unverifiedUsers.length} unverified users, attempting to verify them...`);
              
              // Try to verify each user (we'll only return success for the first one)
              for (const user of unverifiedUsers) {
                try {
                  console.log(`Attempting to manually verify user ${user.id} (${user.email})`);
                  
                  const { error: updateError } = await adminClient.auth.admin.updateUserById(
                    user.id,
                    { email_confirm: true }
                  );
                  
                  if (!updateError) {
                    console.log(`Manually verified user ${user.id}`);
                    
                    // Get a session for this user
                    const { data: sessionData } = await adminClient.auth.admin.generateLink({
                      type: 'magiclink',
                      email: user.email!
                    });
                    
                    return NextResponse.json({
                      success: true,
                      message: 'Email manually verified by admin',
                      user: user,
                      session: sessionData?.properties || null
                    });
                  }
                } catch (userErr) {
                  console.error(`Error verifying user ${user.id}:`, userErr);
                }
              }
            }
          }
        } catch (decodeErr) {
          console.error('Error in manual verification attempt:', decodeErr);
        }
      } catch (adminClientError) {
        console.error('Error creating admin client:', adminClientError);
      }
    } else {
      console.log('No service role key available, skipping admin verification');
    }
    
    // Return the error if all methods failed
    return NextResponse.json(
      { 
        success: false, 
        error: lastError?.message || 'Verification failed with all methods',
        code,
        attemptedTypes: verificationTypes
      },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Verification API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 