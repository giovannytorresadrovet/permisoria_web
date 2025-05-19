'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card } from 'keep-react';
import { ArrowLeft, Envelope, Warning, CheckCircle } from 'phosphor-react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';

// Schema for form validation
const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { resetPasswordForEmail } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    setSuccessMessage(null);

    try {
      const { error } = await resetPasswordForEmail(data.email);
      
      if (error) {
        setServerError(error.message);
      } else {
        setSuccessMessage(
          'If an account exists with this email, you will receive password reset instructions shortly.'
        );
      }
    } catch (error) {
      setServerError('An unexpected error occurred. Please try again.');
      console.error('Password reset error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-background">
      <Card className="card-glass max-w-lg w-full p-6">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-2">Reset Your Password</h1>
          <p className="text-text-secondary">Enter your email to receive password reset instructions</p>
        </div>

        {serverError && (
          <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-md flex items-center gap-2 text-danger">
            <Warning size={20} weight="fill" />
            <span>{serverError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-secondary/10 border border-secondary/20 rounded-md flex items-center gap-2 text-secondary">
            <CheckCircle size={20} weight="fill" />
            <span>{successMessage}</span>
          </div>
        )}

        {!successMessage ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              placeholder="your@email.com"
              icon={<Envelope className="text-text-secondary" size={20} />}
              error={errors.email?.message}
              registration={register('email')}
            />

            <Button 
              type="submit" 
              variant="primary" 
              fullWidth 
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Send Reset Instructions
            </Button>

            <div className="text-center mt-4">
              <Link href="/auth/login" className="text-primary hover:underline flex items-center justify-center gap-1">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <Link href="/auth/login" className="block">
              <Button 
                variant="outline" 
                fullWidth
              >
                Back to Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
} 