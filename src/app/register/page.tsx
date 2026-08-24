'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/stores/authStore';
import { Button, Input, Select, Card } from '@/components/ui';
import { Eye, EyeOff } from 'lucide-react';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  educationLevel: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        educationLevel: data.educationLevel,
      });
      router.push('/dashboard');
    } catch {
      // Error handled by store
    }
  };

  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center px-4 py-8 sm:py-12">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">🎓</span>
            <span className="font-display font-bold text-xl sm:text-2xl text-carbon">GLORY</span>
          </Link>
        </div>

        <Card>
          <h1 className="text-xl sm:text-2xl font-semibold text-carbon text-center mb-5 sm:mb-6">
            Create Your Account
          </h1>

          {error && (
            <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-lg text-sm mb-4">
              {error}
              <button onClick={clearError} className="ml-2 font-bold">×</button>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="Almaz"
                error={errors.firstName?.message}
                {...register('firstName', { required: 'Required' })}
              />
              <Input
                label="Last Name"
                placeholder="Tadesse"
                error={errors.lastName?.message}
                {...register('lastName', { required: 'Required' })}
              />
            </div>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Phone Number"
                placeholder="+251911111111"
                error={errors.phone?.message}
                {...register('phone', { required: 'Phone is required' })}
              />
              <Select
                label="Education Level"
                options={[
                  { value: '', label: 'Select...' },
                  { value: 'high_school', label: 'High School' },
                  { value: 'diploma', label: 'Diploma' },
                  { value: 'bachelor', label: "Bachelor's Degree" },
                  { value: 'master', label: "Master's Degree" },
                ]}
                error={errors.educationLevel?.message}
                {...register('educationLevel', { required: 'Required' })}
              />
            </div>

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
              <p className="text-xs text-dim-grey mt-1">Min 6 characters</p>
            </div>

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', {
                required: 'Please confirm password',
                validate: (val) => val === password || 'Passwords do not match',
              })}
            />

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 accent-gold rounded mt-0.5"
                {...register('agreeTerms', {
                  required: 'You must agree to the terms',
                })}
              />
              <span className="text-sm text-dim-grey">
                I agree to the Terms and Conditions
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-sm text-red">{errors.agreeTerms.message}</p>
            )}

            <Button type="submit" loading={isLoading} className="w-full">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-dim-grey mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-ocean font-medium hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
