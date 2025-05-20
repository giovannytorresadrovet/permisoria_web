'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { 
  ArrowLeft, 
  EnvelopeSimple,
  Warning,
  CheckCircle,
  Clock,
  Envelope,
  Lightning
} from 'phosphor-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuthStore } from '@/stores/authStore';

// Import our auth components
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import GlassCard from '@/components/auth/GlassCard';
import ErrorMessage from '@/components/auth/ErrorMessage';
import AuthButton from '@/components/auth/AuthButton';
import VerificationTimeline from '@/components/auth/VerificationTimeline';
import { Input } from '@/components/common/Input';

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUserSession = useAuthStore((state) => state.setUserSession);
  
  // Get email from URL
  const [email, setEmail] = useState(() => {
    return searchParams?.get('email') || '';
  });
  
  // State to track the verification steps
  const [verificationStatus, setVerificationStatus] = useState('loading'); // 'pending', 'verified', 'expired', 'loading'
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const supabase = createClientComponentClient();
  
  // Check verification status on load
  useEffect(() => {
    const verifyTokenFromURL = async () => {
      try {
        // First check URL for code parameter (direct link from email)
        const code = searchParams?.get('code');
        
        // Check for hash parameters (Supabase redirect flow)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = searchParams?.get('type');
        
        // Collect debug info
        const debugData = {
          code,
          hashParams: Object.fromEntries(hashParams.entries()),
          type,
          url: window.location.href,
          timestamp: new Date().toISOString()
        };
        setDebugInfo(debugData);
        
        console.log('Debug data:', debugData);
        
        // If no verification parameters are present, show the pending state
        if (!code && !accessToken) {
          console.log('No verification parameters found, showing pending state');
          setVerificationStatus('pending');
          return;
        }
        
        if (code) {
          console.log('Verifying with code:', code);
          
          // Use our server-side API to verify the email
          try {
            const response = await fetch('/api/auth/verify-email', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ code, type }),
            });
            
            const result = await response.json();
            setApiResponse(result);
            
            // If verification was successful
            if (response.ok && result.success) {
              console.log('Email verification successful via API');
              
              // If the API returned a user and session, use them
              if (result.user && result.session) {
                setUserSession(result.user, result.session);
              } else {
                // Otherwise, get the current session from Supabase
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                  setUserSession(session.user, session);
                }
              }
              
              setVerificationStatus('verified');
              return;
            } else {
              console.error('API verification failed:', result.error);
              throw new Error(result.error || 'Email verification failed');
            }
          } catch (apiError: any) {
            console.error('Error calling verify-email API:', apiError);
            
            // Fall back to client-side methods if API fails
            try {
              // Try to verify using client-side methods
              console.log('Falling back to client-side verification methods');
              
              // Try various verification types
              const verificationTypes = ['signup', 'email', 'email_change', 'recovery', 'magiclink'];
              
              for (const vType of verificationTypes) {
                try {
                  console.log(`Trying client verification with type: ${vType}`);
                  
                  const { data, error: verifyError } = await supabase.auth.verifyOtp({
                    token_hash: code,
                    type: vType as any
                  });
                  
                  if (verifyError) {
                    console.log(`Client verification error with ${vType}:`, verifyError);
                    continue;
                  }
                  
                  if (data?.session && data?.user) {
                    console.log(`Client verification successful with ${vType}`);
                    setUserSession(data.user, data.session);
                    setVerificationStatus('verified');
                    return;
                  }
                } catch (err) {
                  console.error(`Error with ${vType} verification:`, err);
                }
              }
              
              // If we got here, all verification methods failed
              throw new Error('All verification methods failed');
            } catch (clientError) {
              console.error('Client verification also failed:', clientError);
              throw clientError;
            }
          }
        } else if (accessToken) {
          console.log('Verifying with access token from URL hash');
          
          // Set session with token from URL hash
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });
          
          if (error) {
            console.error('Error setting session:', error);
            throw error;
          }
          
          if (data?.session && data?.user) {
            console.log('Email successfully verified via token');
            setUserSession(data.user, data.session);
            setVerificationStatus('verified');
          } else {
            console.log('Session data:', data);
            throw new Error('Unable to verify email. Please try again.');
          }
        }
      } catch (err: any) {
        console.error('Verification failed:', err);
        setError(err.message || 'Error verifying email. Please try again.');
        setVerificationStatus('expired');
      }
    };
    
    verifyTokenFromURL();
  }, [searchParams, setUserSession, supabase.auth]);
  
  // Handle resend verification email
  const handleResendEmail = async () => {
    if (countdown > 0 || !email) return;
    
    setIsResending(true);
    setError('');
    
    try {
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verification`
        }
      });
      
      if (resendError) throw resendError;
      
      // Start countdown for resend cooldown
      setCountdown(60);
    } catch (err: any) {
      setError(err.message || 'Failed to resend verification email. Please try again.');
      console.error('Resend error:', err);
    } finally {
      setIsResending(false);
    }
  };
  
  // Countdown timer for resend cooldown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);
  
  // Format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };
  
  const handleGotoDashboard = async () => {
    try {
      // Ensure we have the latest session data before navigating
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Make sure the global auth state is updated with latest session
        setUserSession(session.user, session);
        console.log('Session confirmed before dashboard navigation:', session.user.id);
        
        // Add a small delay to ensure auth state is fully updated
        setTimeout(() => {
          router.push('/dashboard');
        }, 300);
      } else {
        // No valid session found, redirect to login
        console.error('No valid session found when trying to navigate to dashboard');
        setError('Session expired. Please login again.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 1000);
      }
    } catch (err) {
      console.error('Error getting session before dashboard navigation:', err);
      router.push('/auth/login');
    }
  };
  
  // Define timeline steps based on status
  const getPendingSteps = () => [
    { title: 'Verification email sent', subtitle: 'Just now', completed: true, active: false },
    { title: 'Click verification link', subtitle: 'Waiting for you to verify', completed: false, active: true },
    { title: 'Account activated', subtitle: 'Ready to use Permisoria', completed: false, active: false }
  ];
  
  const getVerifiedSteps = () => [
    { title: 'Verification email sent', subtitle: 'Complete', completed: true, active: false },
    { title: 'Email verification', subtitle: 'Complete', completed: true, active: false },
    { title: 'Account activated', subtitle: 'Your account is now active', completed: true, active: true }
  ];
  
  // Pulse animation for the pending state icon
  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "mirror"
      }
    }
  };
  
  // Add a direct verification handler
  const handleDirectVerification = async () => {
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    
    setIsResending(true);
    setError('');
    
    try {
      // Call direct-verify API
      const response = await fetch('/api/auth/direct-verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email,
          via: 'verification_page'
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Could not verify email directly');
      }
      
      // Show success message and update status
      setVerificationStatus('verified');
    } catch (err: any) {
      setError(err.message || 'Failed to verify email directly');
      console.error('Direct verification error:', err);
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <AuthFormLayout 
      title={
        verificationStatus === 'verified' ? "Email Verified!" :
        verificationStatus === 'expired' ? "Verification Link Expired" :
        verificationStatus === 'loading' ? "Verifying your email" :
        "Verify your email"
      }
      subtitle={
        verificationStatus === 'pending' ? 
          "Please check your inbox and click the verification link" : 
          undefined
      }
    >
      {verificationStatus === 'pending' && (
        <GlassCard animate>
          <motion.div 
            className="mb-6 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400"
            variants={pulseVariants}
            animate="pulse"
          >
            <EnvelopeSimple size={42} weight="bold" />
          </motion.div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              {email ? (
                <>
                  We've sent a verification link to <span className="text-blue-400 font-medium">{email}</span>
                </>
              ) : (
                <>
                  We've sent a verification link to your email address
                </>
              )}
            </p>
            
            <p className="text-gray-400 text-sm">
              Please check your inbox and click the verification link to activate your account.
              If you don't see the email, please check your spam folder.
            </p>
            
            {/* Email verification steps */}
            <VerificationTimeline steps={getPendingSteps()} />
            
            {/* Error message */}
            {error && <ErrorMessage message={error} title="Verification Error" />}
            
            {/* Email input if needed */}
            {!email && (
              <div className="py-2">
                <Input
                  label="Email Address"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  type="email"
                  icon={<Envelope size={20} className="text-gray-400" />}
                />
              </div>
            )}
            
            {/* Actions */}
            <div className="flex flex-col space-y-3 mt-2">
              <AuthButton
                onClick={handleResendEmail}
                disabled={isResending || countdown > 0 || !email}
                variant="secondary"
                size="lg"
                icon={countdown > 0 ? <Clock size={18} /> : <Envelope size={18} />}
                className={`${(countdown > 0 || !email) ? 'opacity-50 cursor-not-allowed' : ''}`}
                isLoading={isResending}
              >
                {countdown > 0 
                  ? `Resend available in ${formatTime(countdown)}`
                  : "Resend verification email"
                }
              </AuthButton>
              
              {email && (
                <p className="text-gray-400 text-xs">
                  Need to use a different email?{' '}
                  <button 
                    onClick={() => setEmail('')}
                    className="text-blue-400 hover:text-blue-300 hover:underline focus:outline-none focus:underline"
                  >
                    Update email address
                  </button>
                </p>
              )}
              
              <AuthButton
                onClick={handleBackToLogin}
                variant="outline"
                size="lg"
                icon={<ArrowLeft size={18} />}
              >
                Back to Sign In
              </AuthButton>
            </div>
          </div>
        </GlassCard>
      )}
      
      {verificationStatus === 'loading' && (
        <GlassCard animate className="py-16 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative h-24 w-24 mb-5 mx-auto">
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-blue-500/30"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-b-transparent border-l-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <motion.h3 
              className="text-white text-xl font-medium mb-2 text-center"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Verifying your email
            </motion.h3>
            <p className="text-gray-400 text-center">This will only take a moment...</p>
          </div>
        </GlassCard>
      )}
      
      {verificationStatus === 'verified' && (
        <GlassCard variant="success" animate>
          <div className="mb-6 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
            <CheckCircle size={42} weight="bold" />
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              Your email address has been successfully verified.
              You now have full access to the Permisoria platform.
            </p>
            
            <VerificationTimeline steps={getVerifiedSteps()} />
            
            <div className="flex flex-col space-y-3 mt-2">
              <AuthButton
                onClick={handleGotoDashboard}
                variant="primary"
                size="lg"
                icon={<Lightning size={18} />}
              >
                Continue to Dashboard
              </AuthButton>
            </div>
          </div>
        </GlassCard>
      )}
      
      {verificationStatus === 'expired' && (
        <GlassCard variant="warning" animate>
          <div className="mb-6 mx-auto w-20 h-20 flex items-center justify-center rounded-full bg-orange-500/20 text-orange-500">
            <Warning size={42} weight="bold" />
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-300">
              The verification link has expired or is invalid. For security reasons, verification links are only valid for 24 hours.
            </p>
            
            {/* Debug information */}
            <div className="bg-gray-800/50 p-3 rounded-md text-xs mt-2 mb-4">
              <details>
                <summary className="cursor-pointer text-blue-400">Debug Information</summary>
                <pre className="mt-2 overflow-auto text-gray-400">
                  {JSON.stringify({
                    requestInfo: debugInfo,
                    apiResponse,
                    error: error || null
                  }, null, 2)}
                </pre>
              </details>
            </div>
            
            <div className="flex flex-col space-y-3 mt-2">
              <AuthButton
                onClick={handleResendEmail}
                disabled={isResending || countdown > 0 || !email}
                variant="primary"
                size="lg"
                isLoading={isResending}
                className={`${(countdown > 0 || !email) ? 'opacity-50 cursor-not-allowed' : ''}`}
                icon={countdown > 0 ? <Clock size={18} /> : undefined}
              >
                {countdown > 0 
                  ? `Resend available in ${formatTime(countdown)}`
                  : "Send New Verification Link"
                }
              </AuthButton>
              
              <AuthButton
                onClick={handleDirectVerification}
                disabled={isResending || !email}
                variant="secondary"
                size="lg"
                isLoading={isResending}
              >
                Try Direct Verification
              </AuthButton>
              
              <AuthButton
                onClick={handleBackToLogin}
                variant="outline"
                size="lg"
                icon={<ArrowLeft size={18} />}
              >
                Back to Sign In
              </AuthButton>
            </div>
          </div>
        </GlassCard>
      )}
      
      {/* Help text */}
      <motion.div 
        className="mt-6 text-center text-gray-400 text-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Need help? <Link href="/contact" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">Contact support</Link>
      </motion.div>
    </AuthFormLayout>
  );
} 