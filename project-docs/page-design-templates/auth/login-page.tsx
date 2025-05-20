'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye, EyeSlash, LockKey, Envelope, ArrowLeft } from 'phosphor-react';
import { TextInput, Checkbox } from 'keep-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuthStore } from '@/store/authStore';

// Import our new components
import AuthFormLayout from '@/components/auth/AuthFormLayout';
import GlassCard from '@/components/auth/GlassCard';
import ErrorMessage from '@/components/auth/ErrorMessage';
import AuthButton from '@/components/auth/AuthButton';

// Define form validation schema with Zod
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const supabase = createClientComponentClient();
  const setUser = useAuthStore((state) => state.setUser);

  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
    
    try {
      // Supabase authentication
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;
      
      if (authData?.user) {
        // Update global auth state
        setUser(authData.user);
        
        // Redirect to role-specific dashboard
        router.push('/app/dashboard');
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
      title="Welcome back" 
      subtitle="Sign in to access your Permisoria account"
    >
      {/* Error message */}
      {error && <ErrorMessage message={error} />}

      {/* Login form */}
      <GlassCard className="mb-6" animate>
        <form onSubmit={handleSubmit(onSubmit)}>
          <motion.div className="space-y-5" variants={itemVariants}>
            {/* Email field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
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

            {/* Password field */}
            <div>
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
              <TextInput
                id="password"
                placeholder="••••••••"
                {...register('password')}
                type={showPassword ? "text" : "password"}
                sizing="lg"
                className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200"
                icon={<LockKey size={20} className="text-gray-400" />}
                iconPosition="left"
                error={!!errors.password}
                helperText={errors.password?.message}
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
              />
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                {...register('rememberMe')}
                label="Remember me"
                className="text-gray-300"
              />
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
          </motion.div>
        </form>
      </GlassCard>

      {/* Registration link */}
      <motion.div 
        className="mt-6 text-center text-gray-400 text-sm"
        variants={itemVariants}
      >
        Don't have an account?{' '}
        <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
          Register
        </Link>
      </motion.div>

      {/* Public permits link */}
      <motion.div 
        className="mt-3 text-center text-gray-400 text-sm"
        variants={itemVariants}
      >
        <Link href="/public-permits" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
          View public permits
        </Link>
      </motion.div>
    </AuthFormLayout>
  );
}