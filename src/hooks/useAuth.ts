'use client';

import { useEffect } from 'react';
import { createSupabaseClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { AuthError } from '@supabase/supabase-js';

export const useAuth = () => {
  const { user, session, isLoading, error } = useAuthStore();
  const { setUserSession, setLoading, setError, clearError, clearUser } = useAuthStore();

  // Create a Supabase client for the browser
  const supabase = createSupabaseClient();

  // Set up the auth state listener - runs once on component mount
  useEffect(() => {
    // Check current auth state
    const checkAuthState = async () => {
      try {
        setLoading(true);
        console.log('🔐 [Auth] Checking current auth state...');
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('🔐 [Auth] Error getting session:', error);
          throw error;
        }

        if (data?.session) {
          console.log('🔐 [Auth] Session found:', { 
            user_id: data.session.user.id,
            email: data.session.user.email,
            role: data.session.user.user_metadata?.role,
            expires_at: data.session.expires_at ? new Date(data.session.expires_at * 1000).toISOString() : 'unknown',
          });
          const { data: userData } = await supabase.auth.getUser();
          setUserSession(userData.user, data.session);
        } else {
          console.log('🔐 [Auth] No session found, user is not authenticated');
          setUserSession(null, null);
        }
      } catch (err) {
        console.error('🔐 [Auth] Error checking auth state:', err);
        setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    // Initial auth check
    checkAuthState();

    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log(`🔐 [Auth] Auth state changed: ${event}`, { 
          session: newSession ? 'exists' : 'none',
          user_id: newSession?.user.id,
          email: newSession?.user.email,
        });
        
        setLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            const { data } = await supabase.auth.getUser();
            console.log('🔐 [Auth] User signed in:', { 
              id: data.user?.id,
              email: data.user?.email,
              role: data.user?.user_metadata?.role 
            });
            setUserSession(data.user, newSession);
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('🔐 [Auth] User signed out');
          setUserSession(null, null);
        } else if (event === 'USER_UPDATED') {
          if (newSession) {
            const { data } = await supabase.auth.getUser();
            console.log('🔐 [Auth] User updated:', { 
              id: data.user?.id, 
              email: data.user?.email,
              role: data.user?.user_metadata?.role
            });
            setUserSession(data.user, newSession);
          }
        }
        
        setLoading(false);
      }
    );

    // Cleanup subscription when component unmounts
    return () => {
      console.log('🔐 [Auth] Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [setUserSession, setLoading, setError]);

  /**
   * Sign up a new user
   */
  const signUp = async (
    email: string, 
    password: string, 
    options?: { data?: Record<string, any> }
  ) => {
    clearError();
    setLoading(true);
    console.log('🔐 [Auth] Signing up user:', { email, options });
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: options || {},
      });

      if (error) {
        console.error('🔐 [Auth] Sign up error:', error);
        throw error;
      }
      
      console.log('🔐 [Auth] Sign up successful:', { 
        id: data.user?.id,
        email: data.user?.email,
        confirmation_sent: Boolean(data.user?.identities?.length),
        role: data.user?.user_metadata?.role
      });
      
      return { data, error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign in with email and password
   */
  const signInWithPassword = async (email: string, password: string) => {
    clearError();
    setLoading(true);
    console.log('🔐 [Auth] Signing in user:', { email });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('🔐 [Auth] Sign in error:', error);
        throw error;
      }
      
      console.log('🔐 [Auth] Sign in successful:', { 
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.user_metadata?.role
      });
      
      return { data, error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sign out the current user
   */
  const signOut = async () => {
    clearError();
    setLoading(true);
    console.log('🔐 [Auth] Signing out user');
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('🔐 [Auth] Sign out error:', error);
        throw error;
      }
      
      console.log('🔐 [Auth] Sign out successful');
      clearUser();
      return { error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { error: authError };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Request password reset for email
   */
  const resetPasswordForEmail = async (email: string) => {
    clearError();
    setLoading(true);
    console.log('🔐 [Auth] Requesting password reset for:', { email });
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('🔐 [Auth] Password reset request error:', error);
        throw error;
      }
      
      console.log('🔐 [Auth] Password reset request successful');
      return { data, error: null };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      return { data: null, error: authError };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    isLoading,
    error,
    signUp,
    signInWithPassword,
    signOut,
    resetPasswordForEmail,
  };
}; 