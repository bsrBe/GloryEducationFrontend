'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { saveDraft, getDraft } from '@/lib/draftStorage';
import { destinationOptions } from '@/lib/destinations';
import { Button, Input, Select } from '@/components/ui';
import { ApplyHeading, ApplySection } from '@/components/apply/ApplyParts';
import { ArrowRight } from 'lucide-react';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dateOfBirth: string;
  gender: string;
  educationLevel: string;
  institution: string;
  gpa: string;
  programInterest: string;
  countryPreference: string;
  englishProficiency: string;
  englishScore: string;
  // financialBudget: string; // [Budget removed]
  additionalNotes: string;
}

export default function ApplyProfilePage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<ProfileForm>();

  // Load draft from IndexedDB on mount
  useEffect(() => {
    getDraft().then((draft) => {
      if (draft?.profile) {
        const p = draft.profile as Record<string, string>;
        reset({
          firstName: p.firstName || '',
          lastName: p.lastName || '',
          email: p.email || '',
          phone: p.phone || '',
          country: p.country || '',
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          educationLevel: p.educationLevel || '',
          institution: p.institution || '',
          gpa: p.gpa || '',
          programInterest: p.programInterest || '',
          countryPreference: p.countryPreference || '',
          englishProficiency: p.englishProficiency || '',
          englishScore: p.englishScore || '',
          // financialBudget: p.financialBudget || '', // [Budget removed]
          additionalNotes: p.additionalNotes || '',
        });
      }
    });
  }, [reset]);

  // Auto-save on change (debounced via subscription)
  useEffect(() => {
    let saveTimeout: NodeJS.Timeout;
    const subscription = watch((value) => {
      clearTimeout(saveTimeout);
      saveTimeout = setTimeout(() => {
        saveDraft({ profile: value as unknown as Record<string, unknown>, payment: {}, currentStep: 1 });
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
      }, 800);
    });
    return () => {
      subscription.unsubscribe();
      clearTimeout(saveTimeout);
    };
  }, [watch]);

  const onSubmit = async (data: ProfileForm) => {
    // Leaving the page cancels the debounced auto-save, so save the latest values first
    await saveDraft({ profile: data as unknown as Record<string, unknown>, payment: {}, currentStep: 1 });
    router.push('/apply/documents');
  };

  return (
    <div className="space-y-8">
      <ApplyHeading title="Your profile">
        <p>Tell us about your academic background. Your progress is saved automatically.</p>
        <p aria-live="polite" className="text-sm text-green-text mt-1 min-h-5">{saved && 'Draft saved'}</p>
      </ApplyHeading>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
        {/* Personal Info */}
        <ApplySection title="Personal information" hint="So we can contact you about webinars and your application.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First name *" placeholder="Almaz" error={errors.firstName?.message}
              {...register('firstName', { required: 'Required' })} />
            <Input label="Last name *" placeholder="Tadesse" error={errors.lastName?.message}
              {...register('lastName', { required: 'Required' })} />
            <Input label="Email *" type="email" placeholder="you@email.com" error={errors.email?.message}
              {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            <Input label="Phone *" placeholder="+251911111111" error={errors.phone?.message}
              {...register('phone', { required: 'Required' })} />
            <Input label="Country you live in" placeholder="e.g. Kenya" {...register('country')} />
            <Input label="Date of birth" type="date" {...register('dateOfBirth')} />
            <Select label="Gender" options={[
              { value: '', label: 'Select...' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]} {...register('gender')} />
          </div>
        </ApplySection>

        {/* Academic Info */}
        <ApplySection title="Academic information" hint="Helps us find universities that suit you.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Education level" options={[
              { value: '', label: 'Select...' },
              { value: 'High School', label: 'High School' },
              { value: 'Diploma', label: 'Diploma' },
              { value: "Bachelor's Degree", label: "Bachelor's Degree" },
              { value: "Master's Degree", label: "Master's Degree" },
            ]} {...register('educationLevel')} />
            <Input label="Institution" placeholder="Your school or university" {...register('institution')} />
            <Input label="GPA" type="number" step="0.01" min="0" max="4" placeholder="e.g. 3.5" {...register('gpa')} />
            <Input label="Program of interest" placeholder="e.g. Computer Science" {...register('programInterest')} />
            <Select label="Preferred destination" options={[
              { value: '', label: 'Select...' },
              ...destinationOptions,
              { value: 'other', label: 'Other' },
            ]} {...register('countryPreference')} />
          </div>
        </ApplySection>

        {/* English */}
        <ApplySection title="English" hint="Add a test score, or choose Medium of Instruction if your studies were in English.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Test type" options={[
              { value: '', label: 'Select...' },
              { value: 'IELTS', label: 'IELTS' },
              { value: 'TOEFL', label: 'TOEFL' },
              { value: 'Duolingo', label: 'Duolingo' },
              { value: 'Medium of Instruction', label: 'English Medium of Instruction (MOI)' },
              { value: 'No test yet', label: 'No test yet' },
            ]} {...register('englishProficiency')} />
            <Input label="Score" type="number" step="0.5" placeholder="e.g. 7.0" {...register('englishScore')} />
          </div>
        </ApplySection>

        {/* [Budget removed]
        <Card className="mb-5">
          <h3 className="font-semibold text-carbon mb-4">Budget</h3>
          <Select label="Annual Budget" options={[
            { value: '', label: 'Select...' },
            { value: 'under_10k', label: 'Under $10,000' },
            { value: '10k_20k', label: '$10,000 - $20,000' },
            { value: '20k_30k', label: '$20,000 - $30,000' },
            { value: '30k_50k', label: '$30,000 - $50,000' },
            { value: 'over_50k', label: 'Over $50,000' },
          ]} {...register('financialBudget')} />
        </Card>
        */}

        <div className="flex justify-end">
          <Button type="submit" variant="accent">
            Continue to Documents <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
