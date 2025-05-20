'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Envelope, 
  ArrowLeft, 
  EnvelopeSimple
} from 'phosphor-react';
import { TextInput } from 'keep-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Import our new components
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import GlassCard from '@/components/auth/GlassCard';
import ErrorMessage from '@/components/auth/ErrorMessage';
import AuthButton from '@/components/auth/AuthButton';

// Define validation schema with Zod
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address')
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const supabase = createClientComponentClient();
  
  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });
  
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use Supabase Auth to send password reset email
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        data.email,
        {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        }
      );
      
      if (resetError) throw resetError;
      
      // Show success step
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Password reset request failed. Please try again later.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };
  
  const successVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  return (
    <AuthFormLayout 
      title={step === 1 ? "Reset your password" : "Check your email"}
      subtitle={step === 1 ? "Enter your email address and we'll send you instructions to reset your password" : undefined}
    >
      {step === 1 ? (
        <>
          {/* Back to login */}
          <motion.div className="mb-6" variants={itemVariants}>
            <AuthButton
              onClick={handleBackToLogin}
              variant="outline"
              size="sm"
              icon={<ArrowLeft size={16} />}
              className="bg-transparent border border-gray-700 hover:bg-gray-800 
                      text-gray-300 w-auto inline-flex"
            >
              Back to Sign In
            </AuthButton>
          </motion.div>
          
          {/* Error message */}
          {error && <ErrorMessage message={error} />}
          
          {/* Password reset form */}
          <GlassCard animate>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="space-y-5" variants={itemVariants}>
                {/* Email field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    id="email"
                    placeholder="Enter your email"
                    {...register('email')}
                    type="email"
                    sizing="lg"
                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200"
                    icon={<Envelope size={20} className="text-gray-400" />}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                </div>
                
                {/* Submit button */}
                <AuthButton
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                  size="lg"
                >
                  Send Reset Instructions
                </AuthButton>
              </motion.div>
            </form>
          </GlassCard>
          
          {/* Help text */}
          <motion.div 
            className="mt-6 text-center text-gray-400 text-sm"
            variants={itemVariants}
          >
            Remember your password?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
              Sign in
            </Link>
          </motion.div>
        </>
      ) : (
        <motion.div 
          className="text-center"
          initial="hidden"
          animate="visible"
          variants={successVariants}
        >
          {/* Success message */}
          <GlassCard variant="info" animate>
            <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
              <EnvelopeSimple size={36} weight="bold" />
            </div>
            
            <p className="text-gray-300 mb-6">
              We've sent password reset instructions to{' '}
              <span className="text-blue-400 font-medium">{getValues('email')}</span>
            </p>
            <p className="text-gray-400 mb-8">
              If you don't see the email in your inbox, please check your spam folder or contact support.
            </p>
            
            <div className="space-y-3">
              <AuthButton
                onClick={handleBackToLogin}
                variant="primary"
                size="lg"
                icon={<ArrowLeft size={18} />}
              >
                Back to Sign In
              </AuthButton>
              
              <AuthButton
                onClick={() => setStep(1)}
                variant="secondary"
                size="lg"
              >
                Try a different email
              </AuthButton>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AuthFormLayout>
  );
}