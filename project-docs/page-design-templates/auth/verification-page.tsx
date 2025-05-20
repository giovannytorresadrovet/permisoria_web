'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  EnvelopeSimple,
  Warning,
  CheckCircle,
  Clock,
  Envelope,
  Lightning
} from 'phosphor-react';
import { TextInput } from 'keep-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Import our new components
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import GlassCard from '@/components/auth/GlassCard';
import ErrorMessage from '@/components/auth/ErrorMessage';
import AuthButton from '@/components/auth/AuthButton';
import VerificationTimeline from '@/components/auth/VerificationTimeline';

export default function VerificationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get email from URL or use placeholder
  const [email, setEmail] = useState(() => {
    return searchParams?.get('email') || '';
  });
  
  // State to track the verification steps
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'verified', 'expired', 'loading'
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  
  // Check verification status on load
  useEffect(() => {
    const verifyTokenFromURL = async () => {
      // Get hash params (Supabase uses URL fragments)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      const tokenType = hashParams.get('token_type');
      
      if (accessToken && tokenType) {
        setVerificationStatus('loading');
        
        try {
          // Set session in Supabase
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: '',
          });
          
          if (error) throw error;
          
          // If successful, update status
          setVerificationStatus('verified');
        } catch (err: any) {
          console.error('Verification error:', err);
          setError(err.message || 'Error verifying email. Please try again.');
          setVerificationStatus('expired');
        }
      }
    };
    
    verifyTokenFromURL();
  }, [supabase.auth]);
  
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
  
  const handleGotoDashboard = () => {
    router.push('/app/dashboard');
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
    { title: 'Account activated', subtitle: 'Your account is now active', completed: true, active: false }
  ];
  
  // Pulse animation for the pending state icon
  const pulseVariants = {
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
                <TextInput
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200 mb-2"
                  sizing="lg"
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
        <GlassCard animate className="py-12 flex flex-col items-center">
          <div className="relative h-20 w-20 mb-5">
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
            className="text-white text-xl font-medium mb-2"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Verifying your email
          </motion.h3>
          <p className="text-gray-400">This will only take a moment...</p>
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
              The verification link has expired. For security reasons, verification links are only valid for 24 hours.
            </p>
            
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
                onClick={handleBackToLogin}
                variant="secondary"
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