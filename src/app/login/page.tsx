'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import { authAPI } from '@/lib/api';
import { Button, Input, GoogleButton } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, loginWithGoogle, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>();

  const onGoogle = async (credential: string) => {
    try {
      await loginWithGoogle(credential);
      router.push('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  const onSubmit = async (data: LoginForm) => {
    try {
      await login(data.email, data.password);
      const user = useAuthStore.getState().user;
      if (user?.role === 'student') {
        router.push('/dashboard');
      } else if (user?.role === 'admin') {
        router.push('/admin/analytics');
      } else if (user?.role === 'university_rep') {
        router.push('/rep/assigned');
      } else {
        router.push('/admin/analytics');
      }
    } catch {
      // Error handled by store
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotPasswordLoading(true);
    setForgotPasswordMessage('');
    
    try {
      await authAPI.forgotPassword({ email: forgotPasswordEmail });
      setForgotPasswordMessage('Password reset link sent to your email. Please check your inbox.');
    } catch {
      setForgotPasswordMessage('Failed to send reset email. Please try again.');
    } finally {
      setForgotPasswordLoading(false);
    }
  };

  return (
    <AuthShell
      title={showForgotPassword ? 'Reset your password' : 'Sign in to your portal'}
      intro={showForgotPassword
        ? 'Enter your email address and we will send you a reset link.'
        : 'Enter your email and password to access your account.'}
    >
          {error && !showForgotPassword && (
            <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-[10px] text-xs font-semibold mb-4 flex items-center justify-between animate-fade-in">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-text hover:text-black font-bold text-base cursor-pointer p-1"
              >
                ×
              </button>
            </div>
          )}

          {forgotPasswordMessage && showForgotPassword && (
            <div className="bg-ocean-light/20 border border-ocean/30 text-ocean px-4 py-3 rounded-[10px] text-xs font-semibold mb-4">
              {forgotPasswordMessage}
            </div>
          )}

          {showForgotPassword ? (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="example@email.com"
                value={forgotPasswordEmail}
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                required
              />

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotPasswordMessage('');
                    setForgotPasswordEmail('');
                  }}
                  className="flex-1"
                >
                  <ArrowLeft size={16} /> Back to Login
                </Button>
                <Button 
                  type="submit" 
                  loading={forgotPasswordLoading} 
                  className="flex-1"
                >
                  Send Reset Link
                </Button>
              </div>
            </form>
          ) : (
            <div>
              <GoogleButton onCredential={onGoogle} />
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email address"
                type="email"
                placeholder="example@email.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                })}
              />

              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  error={errors.password?.message}
                  className="pr-11"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Min 6 characters' },
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

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs text-ocean hover:underline font-semibold"
                >
                  Forgot your password?
                </button>
              </div>

              <Button type="submit" loading={isLoading} variant="accent" className="w-full">
                Sign in
              </Button>
            </form>
            </div>
          )}


          <p className="text-sm text-dim-grey mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/apply/profile" className="text-ocean font-bold hover:underline">
              Register now
            </Link>
          </p>
          <p className="text-xs text-dim-grey mt-3">
            By continuing you agree to our{' '}
            <Link href="/terms" className="text-ocean underline">Terms of Service</Link> and{' '}
            <Link href="/privacy" className="text-ocean underline">Privacy Policy</Link>.
          </p>
    </AuthShell>
  );
}
