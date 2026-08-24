'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Card } from '@/components/ui';
import { Eye, EyeOff } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🎓</span>
            <span className="font-display font-bold text-xl sm:text-2xl text-carbon">GLORY</span>
          </Link>
        </div>

        <Card>
          <h1 className="text-xl sm:text-2xl font-semibold text-carbon text-center mb-5 sm:mb-6">
            Welcome Back
          </h1>

          {error && (
            <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-lg text-sm mb-4">
              {error}
              <button onClick={clearError} className="ml-2 font-bold">×</button>
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
                className="absolute right-3 top-[38px] text-dim-grey hover:text-carbon"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" loading={isLoading} className="w-full">
              Login
            </Button>
          </form>

          <p className="text-center text-sm text-dim-grey mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-ocean font-medium hover:underline">
              Register now
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
