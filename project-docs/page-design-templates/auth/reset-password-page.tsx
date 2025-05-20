'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeSlash, 
  LockKey, 
  ArrowLeft,
  ShieldCheck,
  Warning,
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
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';

// Define password validation schema
const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type ResetPasswordFormValues = z.infer<typeof passwordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const supabase = createClientComponentClient();
  
  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  // Watch password for strength calculation
  const password = watch('password');
  
  // Calculate password strength
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) strength += 25; // Uppercase
    if (/[0-9]/.test(password)) strength += 25; // Numbers
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // Special characters
    
    setPasswordStrength(strength);
  }, [password]);
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Get the reset token from URL
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get('access_token');
      
      if (!accessToken) {
        throw new Error('Invalid or missing reset token. Please request a new password reset.');
      }
      
      // Update password with Supabase Auth
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (updateError) throw updateError;
      
      // Show success step
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again later.');
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
  
  return (
    <AuthFormLayout 
      title={step === 1 ? "Reset your password" : "Password Reset Complete"}
      subtitle={step === 1 ? "Create a new secure password for your Permisoria account" : undefined}
    >
      {step === 1 ? (
        <>
          {/* Error message */}
          {error && <ErrorMessage message={error} />}
          
          {/* Password reset form */}
          <GlassCard animate>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="space-y-5" variants={itemVariants}>
                {/* New Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    id="password"
                    placeholder="Create a new password"
                    {...register('password')}
                    type={showPassword ? "text" : "password"}
                    sizing="lg"
                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200"
                    icon={<LockKey size={20} className="text-gray-400" />}
                    iconPosition="left"
                    addonRight={
                      <button 
                        type="button" 
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-300 focus:outline-none"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? (
                          <EyeSlash size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    }
                    error={!!errors.password}
                    helperText={errors.password?.message}
                  />
                  
                  {/* Password strength meter */}
                  <PasswordStrengthMeter password={password} strength={passwordStrength} />
                </div>
                
                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    id="confirmPassword"
                    placeholder="Confirm your new password"
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? "text" : "password"}
                    sizing="lg"
                    className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200"
                    icon={<LockKey size={20} className="text-gray-400" />}
                    iconPosition="left"
                    addonRight={
                      <button 
                        type="button" 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-300 focus:outline-none"
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? (
                          <EyeSlash size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    }
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                  
                  {/* Password match indicator */}
                  {password && watch('confirmPassword') && (
                    <div className="mt-2 flex items-center">
                      {password === watch('confirmPassword') ? (
                        <span className="text-green-400 text-sm flex items-center">
                          <ShieldCheck size={16} className="mr-1" weight="fill" />
                          Passwords match
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm flex items-center">
                          <Warning size={16} className="mr-1" />
                          Passwords don't match
                        </span>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Submit button */}
                <AuthButton
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                  size="lg"
                >
                  Set New Password
                </AuthButton>
                
                {/* Back to login link */}
                <div className="flex justify-center mt-4">
                  <AuthButton
                    onClick={handleBackToLogin}
                    variant="outline"
                    size="sm"
                    icon={<ArrowLeft size={16} />}
                    className="w-auto"
                  >
                    Back to Sign In
                  </AuthButton>
                </div>
              </motion.div>
            </form>
          </GlassCard>
        </>
      ) : (
        <motion.div 
          className="text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          {/* Success message */}
          <GlassCard variant="success" animate>
            <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
              <ShieldCheck size={36} weight="bold" />
            </div>
            
            <p className="text-gray-300 mb-6">
              Your password has been successfully updated. Your account is now secure with your new password.
            </p>
            
            <div className="space-y-3">
              <AuthButton
                onClick={handleBackToLogin}
                variant="primary"
                size="lg"
              >
                Sign In Now
              </AuthButton>
              
              <p className="text-gray-400 text-sm mt-4">
                If you didn't make this change or if you believe an unauthorized person has accessed your account, please <Link href="/contact" className="text-blue-400 hover:underline transition-colors">contact us</Link> immediately.
              </p>
            </div>
          </GlassCard>
        </motion.div>
      )}
    </AuthFormLayout>
  );
}