'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/stores/authStore';
import { AuthError } from '@supabase/supabase-js';

export const useAuth = () => {
  const { user, session, isLoading, error } = useAuthStore();
  const { setUserSession, setLoading, setError, clearError, clearUser } = useAuthStore();

  // Create a Supabase client for the browser
  const supabase = createClient();

  // Set up the auth state listener - runs once on component mount
  useEffect(() => {
    // Check current auth state
    const checkAuthState = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          const { data: userData } = await supabase.auth.getUser();
          setUserSession(userData.user, data.session);
        } else {
          setUserSession(null, null);
        }
      } catch (err) {
        console.error('Error checking auth state:', err);
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
        setLoading(true);
        
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (newSession) {
            const { data } = await supabase.auth.getUser();
            setUserSession(data.user, newSession);
          }
        } else if (event === 'SIGNED_OUT') {
          setUserSession(null, null);
        } else if (event === 'USER_UPDATED') {
          if (newSession) {
            const { data } = await supabase.auth.getUser();
            setUserSession(data.user, newSession);
          }
        }
        
        setLoading(false);
      }
    );

    // Cleanup subscription when component unmounts
    return () => {
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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: options || {},
      });

      if (error) throw error;
      
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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      
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
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
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
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) throw error;
      
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