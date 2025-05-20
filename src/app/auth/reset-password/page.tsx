'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeSlash, LockKey, ArrowLeft, CheckCircle, Shield } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Import our auth components
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import GlassCard from '@/components/auth/GlassCard';
import ErrorMessage from '@/components/auth/ErrorMessage';
import AuthButton from '@/components/auth/AuthButton';
import PasswordStrengthMeter from '@/components/auth/PasswordStrengthMeter';
import { Input } from '@/components/common/Input';

// Define validation schema with Zod
const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const supabase = createClientComponentClient();
  
  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });
  
  const password = watch('password');
  
  // Calculate password strength when password changes
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    
    // Contains uppercase
    if (/[A-Z]/.test(password)) strength += 25;
    
    // Contains number
    if (/[0-9]/.test(password)) strength += 25;
    
    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    
    setPasswordStrength(strength);
  }, [password]);
  
  const onSubmit = async (data: ResetPasswordFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use Supabase Auth to update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password
      });
      
      if (updateError) throw updateError;
      
      // Show success message
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Password reset failed. Please try again later or request a new reset link.');
      console.error('Password reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };

  return (
    <AuthFormLayout 
      title={success ? "Password Reset Successful!" : "Create a new password"}
      subtitle={success ? undefined : "Please create a strong, secure password for your account"}
    >
      {success ? (
        <div className="text-center">
          <GlassCard variant="success" animate>
            <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
              <CheckCircle size={36} weight="bold" />
            </div>
            
            <p className="text-gray-300 mb-6">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            
            <AuthButton
              onClick={handleBackToLogin}
              variant="primary"
              size="lg"
            >
              Sign In
            </AuthButton>
          </GlassCard>
        </div>
      ) : (
        <>
          {/* Error message */}
          {error && <ErrorMessage message={error} />}
          
          {/* Password reset form */}
          <GlassCard animate>
            <div className="mb-6 flex justify-center">
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400">
                <Shield size={32} weight="duotone" />
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-5">
                {/* Password field */}
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    New Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="password"
                    placeholder="Create a password"
                    registration={register('password')}
                    type={showPassword ? "text" : "password"}
                    icon={<LockKey size={20} className="text-gray-400" />}
                    error={errors.password?.message}
                  />
                  
                  {/* Password strength meter */}
                  {password && (
                    <PasswordStrengthMeter 
                      password={password} 
                      strength={passwordStrength} 
                    />
                  )}
                </div>
                
                {/* Confirm Password field */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password <span className="text-red-500">*</span>
                  </label>
                  <Input
                    id="confirmPassword"
                    placeholder="Confirm your password"
                    registration={register('confirmPassword')}
                    type={showConfirmPassword ? "text" : "password"}
                    icon={<LockKey size={20} className="text-gray-400" />}
                    error={errors.confirmPassword?.message}
                  />
                  
                  {/* Password match indicator */}
                  {watch('password') && watch('confirmPassword') && watch('password') === watch('confirmPassword') && (
                    <div className="mt-2 flex items-center">
                      <span className="text-green-400 text-sm flex items-center">
                        <CheckCircle size={16} className="mr-1" weight="fill" />
                        Passwords match
                      </span>
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
                  Reset Password
                </AuthButton>
                
                {/* Back to sign in */}
                <div className="mt-2 text-center">
                  <button 
                    type="button"
                    onClick={handleBackToLogin}
                    className="text-blue-400 hover:text-blue-300 flex items-center justify-center mx-auto"
                  >
                    <ArrowLeft size={16} className="mr-1" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </div>
            </form>
          </GlassCard>
        </>
      )}
    </AuthFormLayout>
  );
} 