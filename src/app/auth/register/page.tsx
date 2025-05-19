'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, Select } from 'keep-react';
import { ArrowRight, Envelope, LockKey, IdentificationCard, Warning, CaretDown } from 'phosphor-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// Schema for form validation
const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  role: z.enum(['Permit Manager', 'Business Owner'], { 
    required_error: 'Please select a role' 
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signUp, user, isLoading } = useAuth();

  // Redirect if user is already logged in
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Business Owner',
    }
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const { error } = await signUp(data.email, data.password, {
        data: {
          role: data.role,
        },
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
          setServerError('This email is already registered. Please use a different email or try logging in.');
        } else {
          setServerError(error.message);
        }
      } else {
        setSuccessMessage('Registration successful! Please check your email to verify your account.');
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-background">
      <Card className="card-glass max-w-lg w-full p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Create your Permisoria Account</h1>
          <p className="text-text-secondary">Sign up to start managing your permits</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-md flex items-center gap-2 text-danger">
            <Warning size={20} weight="fill" />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-md flex items-center gap-2 text-secondary">
            <Warning size={20} weight="fill" />
            <span>{successMessage}</span>
          </div>
        )}

        {!successMessage && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              icon={<Envelope className="text-text-secondary" size={20} />}
              error={errors.email?.message}
              registration={register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="********"
              icon={<LockKey className="text-text-secondary" size={20} />}
              error={errors.password?.message}
              registration={register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="********"
              icon={<LockKey className="text-text-secondary" size={20} />}
              error={errors.confirmPassword?.message}
              registration={register('confirmPassword')}
            />

            <div className="space-y-1">
              <label className="block text-sm font-medium text-text-secondary mb-1">
                Select Your Role
              </label>
              <select
                {...register('role')}
                className="w-full rounded-md border border-white/10 bg-surface p-2.5 text-text-primary focus:ring-2 focus:ring-primary focus:outline-none"
              >
                <option value="Business Owner">Business Owner</option>
                <option value="Permit Manager">Permit Manager</option>
              </select>
              {errors.role?.message && (
                <p className="mt-1 text-xs text-danger">{errors.role.message}</p>
              )}
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Create Account
              <ArrowRight size={20} className="ml-2" />
            </Button>

            <div className="text-center mt-4">
              <p className="text-text-secondary">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-primary hover:underline">
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        )}

        {successMessage && (
          <div className="space-y-4">
            <Button 
              variant="outline" 
              fullWidth 
              onClick={() => router.push('/auth/login')}
            >
              Go to Login
              <ArrowRight size={20} className="ml-2" />
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
} 