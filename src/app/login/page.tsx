'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Card, Logo } from '@/components/ui';
import { Eye, EyeOff, KeyRound, Shield, Briefcase, GraduationCap, School } from 'lucide-react';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const { login, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginForm>();

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

  const fillTestCredentials = (email: string, pass: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', pass, { shouldValidate: true });
    clearError();
  };

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

        <Card className="shadow-lg border-charcoal/15">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-carbon">
              Sign In to Your Portal
            </h1>
            <p className="text-xs text-dim-grey mt-1">
              Enter your registered email & password to access your account
            </p>
          </div>

          {error && (
            <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-xl text-xs font-semibold mb-4 flex items-center justify-between animate-fade-in">
              <span>{error}</span>
              <button
                onClick={clearError}
                className="text-red-text hover:text-black font-bold text-base cursor-pointer p-1"
              >
                ×
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email Address"
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Min 6 characters' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-[35px] text-dim-grey hover:text-carbon cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Button type="submit" loading={isLoading} className="w-full shadow-glow-ocean font-bold">
              Sign In to Account
            </Button>
          </form>

          {/* Quick Demo Fill Buttons */}
          <div className="mt-6 pt-5 border-t border-charcoal/15">
            <div className="flex items-center gap-1.5 justify-center text-xs font-bold text-dim-grey mb-3">
              <KeyRound size={13} className="text-gold-dark" />
              <span>Quick Test Logins:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillTestCredentials('admin@gloryedu.com', 'admin123456')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-charcoal/15 bg-porcelain hover:bg-ocean/10 hover:border-ocean/40 text-carbon transition-colors cursor-pointer text-left"
              >
                <Shield size={13} className="text-red shrink-0" />
                <span className="font-semibold truncate">Admin</span>
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('staff@gloryedu.com', 'staff123456')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-charcoal/15 bg-porcelain hover:bg-ocean/10 hover:border-ocean/40 text-carbon transition-colors cursor-pointer text-left"
              >
                <Briefcase size={13} className="text-ocean shrink-0" />
                <span className="font-semibold truncate">Staff</span>
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('rep@mit.edu', 'rep123456')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-charcoal/15 bg-porcelain hover:bg-ocean/10 hover:border-ocean/40 text-carbon transition-colors cursor-pointer text-left"
              >
                <School size={13} className="text-gold-dark shrink-0" />
                <span className="font-semibold truncate">Univ Rep</span>
              </button>
              <button
                type="button"
                onClick={() => fillTestCredentials('almaz@test.com', 'student123')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-charcoal/15 bg-porcelain hover:bg-ocean/10 hover:border-ocean/40 text-carbon transition-colors cursor-pointer text-left"
              >
                <GraduationCap size={13} className="text-green shrink-0" />
                <span className="font-semibold truncate">Student</span>
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-dim-grey mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-ocean font-bold hover:underline">
              Register now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
