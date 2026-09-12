'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { authAPI } from '@/lib/api';
import { Button, Input, Card, Logo } from '@/components/ui';
import { Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordForm>();

  const newPassword = watch('newPassword');

  useEffect(() => {
    if (!token) {
      setMessage({ type: 'error', text: 'Invalid or missing reset token' });
    }
  }, [token]);

  const onSubmit = async (data: ResetPasswordForm) => {
    if (!token) return;

    setIsLoading(true);
    setMessage(null);

    try {
      await authAPI.resetPassword({
        token,
        newPassword: data.newPassword,
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Password reset successful! Redirecting to login...' 
      });
      
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to reset password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg border-charcoal/15">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-carbon">
          Create New Password
        </h1>
        <p className="text-xs text-dim-grey mt-1">
          Enter your new password below to complete the reset process
        </p>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-xl text-xs font-semibold mb-4 flex items-center gap-2 ${
          message.type === 'success' 
            ? 'bg-green-bg border border-green/30 text-green-text' 
            : 'bg-red-bg border border-red/30 text-red-text'
        }`}>
          {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {!token ? (
        <div className="text-center py-6">
          <p className="text-dim-grey mb-4">Invalid reset link</p>
          <Link href="/login">
            <Button variant="secondary">Return to Login</Button>
          </Link>
        </div>
      ) : message?.type !== 'success' ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="relative">
            <Input
              label="New Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.newPassword?.message}
              className="pr-11"
              {...register('newPassword', {
                required: 'Password is required',
                minLength: { 
                  value: 6, 
                  message: 'Password must be at least 6 characters' 
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-[38px] text-dim-grey hover:text-carbon cursor-pointer"
              title={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              className="pr-11"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => 
                  value === newPassword || 'Passwords do not match',
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3.5 top-[38px] text-dim-grey hover:text-carbon cursor-pointer"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button 
            type="submit" 
            loading={isLoading} 
            className="w-full shadow-glow-ocean font-bold"
          >
            Reset Password
          </Button>
        </form>
      ) : (
        <div className="text-center py-6">
          <CheckCircle size={48} className="mx-auto text-green mb-4" />
          <p className="text-green font-semibold mb-2">Password Reset Complete!</p>
          <p className="text-xs text-dim-grey">You will be redirected to the login page shortly.</p>
        </div>
      )}

      <p className="text-center text-xs text-dim-grey mt-6">
        Remember your password?{' '}
        <Link href="/login" className="text-ocean font-bold hover:underline">
          Sign in now
        </Link>
      </p>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-porcelain flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-ocean/10 blur-3xl -z-10 rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-gold/10 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Logo href="/" size="lg" subtitle="Admissions Portal" priority />
        </div>

        <Suspense fallback={
          <Card className="shadow-lg border-charcoal/15">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-ocean mx-auto"></div>
              <p className="text-dim-grey mt-2">Loading...</p>
            </div>
          </Card>
        }>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}