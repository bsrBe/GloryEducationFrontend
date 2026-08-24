'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Input, Select, Button, LoadingSpinner, ErrorState } from '@/components/ui';
import { Save } from 'lucide-react';

interface ProfileForm {
  firstName: string;
  lastName: string;
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

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileForm>();

  useEffect(() => {
    studentsAPI
      .get(user?._id || '')
      .then((res) => {
        const d = res.data;
        reset({
          firstName: d.firstName || user?.firstName || '',
          lastName: d.lastName || user?.lastName || '',
          phone: d.phone || user?.phone || '',
          dateOfBirth: d.dateOfBirth?.split('T')[0] || '',
          gender: d.gender || '',
          educationLevel: d.educationLevel || '',
          institution: d.institution || '',
          gpa: d.gpa?.toString() || '',
          programInterest: d.programInterest || '',
          countryPreference: d.countryPreference || '',
          englishProficiency: d.englishProficiency || '',
          englishScore: d.englishScore?.toString() || '',
          financialBudget: d.financialBudget || '',
          additionalNotes: d.additionalNotes || '',
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load profile');
        setLoading(false);
      });
  }, [user, reset]);

  const onSubmit = async (data: ProfileForm) => {
    if (!user?._id) return;
    setSaving(true);
    setSuccess(false);
    try {
      await studentsAPI.updateProfile(user._id, {
        ...data,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
        englishScore: data.englishScore ? parseFloat(data.englishScore) : undefined,
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save profile'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading profile..." />;
  if (error && !user) return <ErrorState message={error} />;

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">My Profile</h1>
        <p className="text-dim-grey text-sm mt-1">
          Complete your academic profile for assessment
        </p>
      </div>

      {success && (
        <div className="bg-green-bg border border-green/30 text-green-text px-4 py-3 rounded-lg text-sm">
          ✅ Profile saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Info */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName', { required: true })} error={errors.firstName?.message} />
            <Input label="Last Name" {...register('lastName', { required: true })} error={errors.lastName?.message} />
            <Input label="Phone" placeholder="+251..." {...register('phone')} />
            <Input label="Date of Birth" type="date" {...register('dateOfBirth')} />
            <Select
              label="Gender"
              options={[
                { value: '', label: 'Select...' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
              {...register('gender')}
            />
          </div>
        </Card>

        {/* Academic Info */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">Academic Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Education Level"
              options={[
                { value: '', label: 'Select...' },
                { value: 'high_school', label: 'High School' },
                { value: 'diploma', label: 'Diploma' },
                { value: 'bachelor', label: "Bachelor's Degree" },
                { value: 'master', label: "Master's Degree" },
              ]}
              {...register('educationLevel')}
            />
            <Input label="Institution" placeholder="e.g. Addis Ababa University" {...register('institution')} />
            <Input label="GPA" type="number" step="0.01" min="0" max="4" placeholder="e.g. 3.5" {...register('gpa')} />
            <Input label="Program of Interest" placeholder="e.g. Computer Science" {...register('programInterest')} />
            <Select
              label="Country Preference"
              options={[
                { value: '', label: 'Select...' },
                { value: 'usa', label: 'USA' },
                { value: 'uk', label: 'UK' },
                { value: 'canada', label: 'Canada' },
                { value: 'germany', label: 'Germany' },
                { value: 'australia', label: 'Australia' },
                { value: 'other', label: 'Other' },
              ]}
              {...register('countryPreference')}
            />
          </div>
        </Card>

        {/* English Proficiency */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">English Proficiency</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Test Type"
              options={[
                { value: '', label: 'Select...' },
                { value: 'ielts', label: 'IELTS' },
                { value: 'toefl', label: 'TOEFL' },
                { value: 'duolingo', label: 'Duolingo' },
                { value: 'none', label: 'No test yet' },
              ]}
              {...register('englishProficiency')}
            />
            <Input label="Score" type="number" step="0.5" placeholder="e.g. 7.0" {...register('englishScore')} />
          </div>
        </Card>

        {/* Financial */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">Financial Information</h3>
          <Select
            label="Annual Budget"
            options={[
              { value: '', label: 'Select...' },
              { value: 'under_10k', label: 'Under $10,000' },
              { value: '10k_20k', label: '$10,000 - $20,000' },
              { value: '20k_30k', label: '$20,000 - $30,000' },
              { value: '30k_50k', label: '$30,000 - $50,000' },
              { value: 'over_50k', label: 'Over $50,000' },
            ]}
            {...register('financialBudget')}
          />
        </Card>

        {/* Notes */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">Additional Notes</h3>
          <textarea
            className="glory-input min-h-[100px] resize-y"
            placeholder="Any additional information you'd like us to know..."
            {...register('additionalNotes')}
          />
        </Card>

        <div className="flex justify-end">
          <Button type="submit" loading={saving}>
            <Save size={16} />
            Save Profile
          </Button>
        </div>
      </form>
    </div>
  );
}
