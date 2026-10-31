'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Input, Select } from '@/components/ui';
import { getDraft, saveDraft } from '@/lib/draftStorage';
import { destinations } from '@/lib/destinations';

interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  countryPreference: string;
}

// Starts the existing application with these answers filled in. The student
// account is created at the final Submit step, when a password is set.
export function RegisterForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    const draft = await getDraft();
    await saveDraft({
      profile: { ...draft?.profile, ...data },
      payment: draft?.payment || {},
      currentStep: 1,
    });
    router.push('/apply/profile');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid sm:grid-cols-2 gap-5">
      <Input
        id="reg-first-name"
        label="First name"
        autoComplete="given-name"
        error={errors.firstName?.message}
        {...register('firstName', { required: 'Enter your first name' })}
      />
      <Input
        id="reg-last-name"
        label="Last name"
        autoComplete="family-name"
        error={errors.lastName?.message}
        {...register('lastName', { required: 'Enter your last name' })}
      />
      <Input
        id="reg-email"
        label="Email"
        type="email"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email', {
          required: 'Enter your email address',
          pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
        })}
      />
      <Input
        id="reg-phone"
        label="Phone"
        type="tel"
        autoComplete="tel"
        placeholder="+251911111111"
        error={errors.phone?.message}
        {...register('phone', { required: 'Enter your phone number' })}
      />
      <Input
        id="reg-country"
        label="Country you live in"
        autoComplete="country-name"
        error={errors.country?.message}
        {...register('country', { required: 'Enter the country you live in' })}
      />
      <Select
        id="reg-destination"
        label="Preferred destination"
        error={errors.countryPreference?.message}
        options={[
          { value: '', label: 'Select a country' },
          ...destinations.map((d) => ({ value: d.value, label: d.name })),
        ]}
        {...register('countryPreference', { required: 'Choose a destination' })}
      />
      <div className="sm:col-span-2 flex flex-col sm:flex-row sm:items-center gap-4 mt-1">
        <button type="submit" disabled={isSubmitting} className="btn-accent px-7 py-3.5 text-base font-semibold">
          Continue your registration
        </button>
        <p className="text-sm text-dim-grey">Next, you&apos;ll add your academic details and set a password.</p>
      </div>
    </form>
  );
}
