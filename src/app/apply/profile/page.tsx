'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { saveDraft, getDraft } from '@/lib/draftStorage';
import { Button, Input, Select, Card } from '@/components/ui';
import { ArrowRight } from 'lucide-react';

interface ProfileForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  educationLevel: string;
  institution: string;
  gpa: string;
  programInterest: string;
  countryPreference: string;
  englishProficiency: string;
  englishScore: string;
  financialBudget: string;
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
          dateOfBirth: p.dateOfBirth || '',
          gender: p.gender || '',
          educationLevel: p.educationLevel || '',
          institution: p.institution || '',
          gpa: p.gpa || '',
          programInterest: p.programInterest || '',
          countryPreference: p.countryPreference || '',
          englishProficiency: p.englishProficiency || '',
          englishScore: p.englishScore || '',
          financialBudget: p.financialBudget || '',
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

  const onSubmit = () => {
    router.push('/apply/documents');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Your Profile</h1>
        <p className="text-dim-grey text-sm mt-1">
          Tell us about your academic background. Your progress is saved automatically.
        </p>
        {saved && (
          <p className="text-xs text-green mt-2">✅ Draft saved</p>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Info */}
        <Card className="mb-5">
          <h3 className="font-semibold text-carbon mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="First Name *" placeholder="Almaz" error={errors.firstName?.message}
              {...register('firstName', { required: 'Required' })} />
            <Input label="Last Name *" placeholder="Tadesse" error={errors.lastName?.message}
              {...register('lastName', { required: 'Required' })} />
            <Input label="Email *" type="email" placeholder="you@email.com" error={errors.email?.message}
              {...register('email', { required: 'Required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })} />
            <Input label="Phone *" placeholder="+251911111111" error={errors.phone?.message}
              {...register('phone', { required: 'Required' })} />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
            <Select label="Gender" options={[
              { value: '', label: 'Select...' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]} {...register('gender')} />
          </div>
        </Card>

        {/* Academic Info */}
        <Card className="mb-5">
          <h3 className="font-semibold text-carbon mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Education Level" options={[
              { value: '', label: 'Select...' },
              { value: 'high_school', label: 'High School' },
              { value: 'diploma', label: 'Diploma' },
              { value: 'bachelor', label: "Bachelor's Degree" },
              { value: 'master', label: "Master's Degree" },
            ]} {...register('educationLevel')} />
            <Input label="Institution" placeholder="e.g. Addis Ababa University" {...register('institution')} />
            <Input label="GPA" type="number" step="0.01" min="0" max="4" placeholder="e.g. 3.5" {...register('gpa')} />
            <Input label="Program of Interest" placeholder="e.g. Computer Science" {...register('programInterest')} />
            <Select label="Country Preference" options={[
              { value: '', label: 'Select...' },
              { value: 'usa', label: 'USA' },
              { value: 'uk', label: 'UK' },
              { value: 'canada', label: 'Canada' },
              { value: 'germany', label: 'Germany' },
              { value: 'australia', label: 'Australia' },
              { value: 'other', label: 'Other' },
            ]} {...register('countryPreference')} />
          </div>
        </Card>

        {/* English */}
        <Card className="mb-5">
          <h3 className="font-semibold text-carbon mb-4">English Proficiency</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select label="Test Type" options={[
              { value: '', label: 'Select...' },
              { value: 'ielts', label: 'IELTS' },
              { value: 'toefl', label: 'TOEFL' },
              { value: 'duolingo', label: 'Duolingo' },
              { value: 'none', label: 'No test yet' },
            ]} {...register('englishProficiency')} />
            <Input label="Score" type="number" step="0.5" placeholder="e.g. 7.0" {...register('englishScore')} />
          </div>
        </Card>

        {/* Budget */}
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

        <div className="flex justify-end">
          <Button type="submit">
            Continue to Documents <ArrowRight size={16} />
          </Button>
        </div>
      </form>
    </div>
  );
}
