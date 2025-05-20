'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Eye, 
  EyeSlash, 
  LockKey, 
  Envelope, 
  Buildings, 
  User, 
  CheckCircle, 
  Warning, 
  ArrowLeft,
  Info
} from 'phosphor-react';
import { TextInput } from 'keep-react';
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

// Define validation schema with Zod
const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  // Role is now fixed as permit_manager, no longer user-selectable
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const supabase = createClientComponentClient();
  const setUser = useAuthStore((state) => state.setUser);
  
  // Set up react-hook-form with zod validation
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    watch
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    }
  });
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Use Supabase Auth for registration - always as permit_manager
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: 'permit_manager' // Fixed role
          },
          emailRedirectTo: `${window.location.origin}/auth/verification`
        }
      });
      
      if (authError) throw authError;
      
      // Show success message/step
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again later.');
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBackToLogin = () => {
    router.push('/auth/login');
  };
  
  const handleGotoDashboard = () => {
    router.push('/app/dashboard');
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
      title={step === 1 ? "Create a Permit Manager Account" : "Registration Successful!"}
      subtitle={step === 1 ? "Join Permisoria to streamline your permit management" : undefined}
      maxWidth="lg"
    >
      {step === 1 ? (
        <>
          {/* Business Owner notice */}
          <motion.div 
            className="mb-6"
            variants={itemVariants}
          >
            <GlassCard variant="info" animate>
              <div className="flex items-start">
                <Info size={24} className="mr-3 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1 text-blue-100">Business Owner Registration</h3>
                  <p className="text-sm text-blue-200">
                    Business Owners can only register through an invitation from a Permit Manager. 
                    Once registered, Permit Managers can invite Business Owners to join the platform.
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
          
          {/* Form error message */}
          {error && <ErrorMessage message={error} />}
          
          {/* Registration form */}
          <GlassCard animate>
            <form onSubmit={handleSubmit(onSubmit)}>
              <motion.div className="space-y-5" variants={itemVariants}>
                {/* Name fields - side by side on larger screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* First Name field */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <TextInput
                      id="firstName"
                      placeholder="Enter your first name"
                      {...register('firstName')}
                      sizing="lg"
                      className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200"
                      icon={<User size={20} className="text-gray-400" />}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </div>
                  
                  {/* Last Name field */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <TextInput
                      id="lastName"
                      placeholder="Enter your last name"
                      {...register('lastName')}
                      sizing="lg"
                      className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-3 focus:ring-blue-600/40 focus:border-blue-500 transition-all duration-200"
                      icon={<User size={20} className="text-gray-400" />}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </div>
                </div>
                
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
                
                {/* Password field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    id="password"
                    placeholder="Create a password"
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
                </div>
                
                {/* Confirm Password field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <TextInput
                    id="confirmPassword"
                    placeholder="Confirm your password"
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
                  {watch('password') && watch('confirmPassword') && watch('password') === watch('confirmPassword') && (
                    <div className="mt-2 flex items-center">
                      <span className="text-green-400 text-sm flex items-center">
                        <CheckCircle size={16} className="mr-1" weight="fill" />
                        Passwords match
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Account type information - static, no longer selectable */}
                <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 hover:bg-gray-800/80 transition-colors duration-200">
                  <div className="flex items-center">
                    <div className="mr-3 p-2 bg-blue-600/20 rounded-full">
                      <Buildings size={20} className="text-blue-500" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Permit Manager Account</p>
                      <p className="text-gray-400 text-sm">You'll be able to oversee multiple businesses and manage their permits</p>
                    </div>
                  </div>
                </div>
                
                {/* Terms of service disclaimer */}
                <div className="mt-4">
                  <p className="text-gray-400 text-sm text-center">
                    By creating an account, you agree to our{' '}
                    <Link href="/terms" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                      Privacy Policy
                    </Link>
                  </p>
                </div>
                
                {/* Submit button */}
                <AuthButton
                  type="submit"
                  isLoading={isLoading}
                  variant="primary"
                  size="lg"
                >
                  Create Permit Manager Account
                </AuthButton>
              </motion.div>
            </form>
          </GlassCard>
          
          {/* Sign in link */}
          <motion.div 
            className="mt-6 text-center text-gray-400 text-sm"
            variants={itemVariants}
          >
            Already have an account?{' '}
            <Link href="/auth/login" className="text-blue-400 hover:text-blue-300 hover:underline transition-colors">
              Sign in
            </Link>
          </motion.div>
        </>
      ) : (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={successVariants}
          className="text-center"
        >
          {/* Success message */}
          <GlassCard variant="success" className="text-center" animate>
            <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-green-500/20 text-green-500">
              <CheckCircle size={40} weight="bold" />
            </div>
            
            <p className="text-gray-300 mb-6">
              Your Permit Manager account has been created successfully. 
              You're now ready to start managing businesses and permits.
            </p>
            <p className="text-gray-400 mb-8">
              A confirmation email has been sent to <span className="text-blue-400">{getValues('email')}</span>. 
              Please verify your email to activate all features.
            </p>
            
            <div className="space-y-3">
              <AuthButton
                onClick={handleGotoDashboard}
                variant="primary"
                size="lg"
              >
                Go to Dashboard
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
          </GlassCard>
        </motion.div>
      )}
    </AuthFormLayout>
  );
}