'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'keep-react';
import { ArrowRight, Envelope, LockKey, Warning } from 'phosphor-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// Schema for form validation
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required')
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { signInWithPassword, user, isLoading } = useAuth();

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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const { error } = await signInWithPassword(data.email, data.password);
      
      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('Invalid login credentials')) {
          setServerError('Invalid email or password');
        } else {
          setServerError(error.message);
        }
      } else {
        // Successful login - redirection handled by useEffect
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Login error:', error);
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
          <h1 className="text-2xl font-bold text-text-primary mb-2">Sign In to Permisoria</h1>
          <p className="text-text-secondary">Enter your credentials to access your account</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-md flex items-center gap-2 text-danger">
            <Warning size={20} weight="fill" />
            <span>{serverError}</span>
          </div>
        )}

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

          <div className="flex justify-end">
            <Link href="/auth/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            fullWidth 
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            Sign In
            <ArrowRight size={20} className="ml-2" />
          </Button>

          <div className="text-center mt-4">
            <p className="text-text-secondary">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </form>
      </Card>
    </div>
  );
} 