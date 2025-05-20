'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeSlash, LockKey, Envelope, Info, CheckCircle } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuthStore } from '@/stores/authStore';

// Import our auth components
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import GlassCard from '@/components/auth/GlassCard';
import ErrorMessage from '@/components/auth/ErrorMessage';
import AuthButton from '@/components/auth/AuthButton';
import { Input } from '@/components/common/Input';

// Define form validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect_to') || '/dashboard';
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [emailForVerification, setEmailForVerification] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const supabase = createClientComponentClient();
  const setUserSession = useAuthStore((state) => state.setUserSession);
  
  // Clear session and check if already logged in
  useEffect(() => {
    // Check if there's a session and redirect if needed
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Already logged in, redirect to dashboard
          setUserSession(session.user, session);
          router.push('/dashboard');
        }
      } catch (err) {
        console.error('Session check error:', err);
        // Don't set error here to keep login form clean
      }
    };
    
    checkSession();
  }, [router, setUserSession, supabase.auth]);

  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    getValues,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  // Watch form values for UI updates
  const rememberMe = watch('rememberMe');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');
    setNeedsVerification(false);
    setVerificationSuccess(false);
    
    try {
      console.log('Attempting login for email:', data.email);
      
      // Use Supabase Auth for login
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) {
        // Handle specific auth errors
        if (authError.message.includes('Email not confirmed')) {
          setNeedsVerification(true);
          setEmailForVerification(data.email);
          throw new Error('Please verify your email address before logging in.');
        }
        throw authError;
      }
      
      if (authData?.user) {
        console.log('Login successful, user:', authData.user.id);
        
        // Update global auth state
        setUserSession(authData.user, authData.session);
        
        // Force a session refresh to ensure cookies are properly set
        try {
          // We'll manually save the session to localStorage to ensure it persists
          if (typeof window !== 'undefined') {
            localStorage.setItem('sb:session', JSON.stringify({
              user: authData.user,
              session: authData.session
            }));
          }
          
          // Double check that session is established
          const { data: sessionData } = await supabase.auth.getSession();
          if (sessionData?.session) {
            console.log('Session successfully established');
          } else {
            console.warn('Session not found after login - attempting refresh');
            await supabase.auth.refreshSession();
          }
        } catch (refreshErr) {
          console.error('Error managing session:', refreshErr);
        }
        
        // Explicitly log the redirect target
        console.log(`Redirecting to: ${redirectTo}`);
        
        // Redirect to the intended URL or dashboard with a short delay
        // This allows time for the session to be properly stored
        setTimeout(() => {
          window.location.href = redirectTo; // Use direct window navigation to force a full page load
        }, 500);
      } else {
        throw new Error('Login successful but no user data returned');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push('/auth/forgot-password');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError('');
    setVerificationSuccess(false);
    
    try {
      const email = emailForVerification || getValues('email');
      
      if (!email) {
        throw new Error('Please enter your email address');
      }
      
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verification`
        }
      });
      
      if (resendError) throw resendError;
      
      // Redirect to verification page
      router.push(`/auth/verification?email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email. Please try again.');
      console.error('Resend verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // New function to directly verify email when users can't verify through normal flow
  const handleDirectVerification = async () => {
    setIsLoading(true);
    setError('');
    setVerificationSuccess(false);
    
    try {
      const email = emailForVerification || getValues('email');
      
      if (!email) {
        throw new Error('Please enter your email address');
      }
      
      // Call our special API route that will try to verify this user's email
      const response = await fetch('/api/auth/direct-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          password: getValues('password') || '',
          via: 'login_page'
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Could not verify email directly. Please try again or contact support.');
      }
      
      // Show success message
      setVerificationSuccess(true);
      setNeedsVerification(false);
    } catch (err: any) {
      setError(err.message || 'Failed to verify email. Please try again.');
      console.error('Direct verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthFormLayout 
      title="Welcome back" 
      subtitle="Sign in to access your Permisoria account"
    >
      {/* Error message */}
      {error && <ErrorMessage message={error} />}
      
      {/* Email verification success */}
      {verificationSuccess && (
        <GlassCard variant="success" className="mb-6" animate>
          <div className="flex items-start">
            <CheckCircle size={24} className="mr-3 text-green-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-2 text-green-100">Email Verified Successfully</h3>
              <p className="text-sm text-green-200 mb-4">
                Your email has been successfully verified. You can now log in to your account.
              </p>
              <AuthButton
                onClick={() => setVerificationSuccess(false)}
                variant="secondary"
                size="sm"
              >
                Continue to Login
              </AuthButton>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Email verification notice */}
      {needsVerification && !verificationSuccess && (
        <GlassCard variant="info" className="mb-6" animate>
          <div className="flex items-start">
            <Info size={24} className="mr-3 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium mb-2 text-blue-100">Verification Required</h3>
              <p className="text-sm text-blue-200 mb-4">
                Your email address needs to be verified before you can log in.
                Please check your inbox for the verification email or click the button below to resend it.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <AuthButton
                  onClick={handleResendVerification}
                  variant="secondary"
                  size="sm"
                  isLoading={isLoading}
                >
                  Resend Verification Email
                </AuthButton>
                <AuthButton
                  onClick={handleDirectVerification}
                  variant="outline"
                  size="sm"
                  isLoading={isLoading}
                >
                  Verify Email Directly
                </AuthButton>
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      {/* Login form */}
      <GlassCard className="mb-6" animate>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            {/* Email field */}
            <Input
              label="Email Address"
              id="email"
              placeholder="Enter your email"
              registration={register('email')}
              type="email"
              icon={<Envelope size={20} className="text-gray-400" />}
              error={errors.email?.message}
            />

            {/* Password field */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm text-blue-400 hover:text-blue-300 focus:outline-none focus:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  placeholder="••••••••"
                  registration={register('password')}
                  type={showPassword ? "text" : "password"}
                  icon={<LockKey size={20} className="text-gray-400" />}
                  error={errors.password?.message}
                />
                <button 
                  type="button"
                  onClick={handleTogglePassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 focus:outline-none"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeSlash size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center mb-4">
              <input
                id="rememberMe"
                type="checkbox"
                {...register('rememberMe')}
                className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600"
              />
              <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-300">
                Remember me
              </label>
            </div>

            {/* Submit button */}
            <AuthButton
              type="submit"
              isLoading={isLoading}
              variant="primary"
              size="lg"
            >
              Sign In
            </AuthButton>
          </div>
        </form>
      </GlassCard>

      {/* Registration link */}
      <div className="mt-6 text-center text-gray-400 text-sm">
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
          Register
        </Link>
      </div>

      {/* Public permits link */}
      <div className="mt-3 text-center text-gray-400 text-sm">
        <Link href="/public-permits" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
          View public permits
        </Link>
      </div>
    </AuthFormLayout>
  );
} 