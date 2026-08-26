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
  educationLevel: string;
  school: string;
  gpa: string;
  graduationYear: string;
  intendedProgram: string;
  preferredCountry: string;
  preferredUniversity: string;
  englishTest: string;
  englishScore: string;
  budget: string;
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
          educationLevel: d.educationLevel || '',
          school: d.school || d.institution || '',
          gpa: d.gpa?.toString() || '',
          graduationYear: d.graduationYear?.toString() || '',
          intendedProgram: d.intendedProgram || d.programInterest || '',
          preferredCountry: d.preferredCountry || d.countryPreference || '',
          preferredUniversity: d.preferredUniversity || '',
          englishTest: d.englishTest || d.englishProficiency || '',
          englishScore: d.englishScore?.toString() || '',
          budget: d.budget?.toString() || '',
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
      const payload: Record<string, unknown> = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        educationLevel: data.educationLevel || undefined,
        school: data.school || undefined,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
        graduationYear: data.graduationYear ? parseInt(data.graduationYear) : undefined,
        intendedProgram: data.intendedProgram || undefined,
        preferredCountry: data.preferredCountry || undefined,
        preferredUniversity: data.preferredUniversity || undefined,
        englishTest: data.englishTest || undefined,
        englishScore: data.englishScore ? parseFloat(data.englishScore) : undefined,
        budget: data.budget ? parseFloat(data.budget) : undefined,
      };

      // Remove undefined values
      Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

      await studentsAPI.updateProfile(user._id, payload);
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
          Complete your academic profile for admissions assessment and matching
        </p>
      </div>

      {success && (
        <div className="bg-green-bg border border-green/30 text-green-text px-4 py-3 rounded-lg text-sm">
          ✅ Profile saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Personal Info */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">Personal Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" {...register('firstName', { required: true })} error={errors.firstName?.message} />
            <Input label="Last Name" {...register('lastName', { required: true })} error={errors.lastName?.message} />
            <Input label="Phone" placeholder="+251..." {...register('phone', { required: true })} error={errors.phone?.message} />
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
                { value: 'High School', label: 'High School' },
                { value: 'Diploma', label: 'Diploma' },
                { value: "Bachelor's Degree", label: "Bachelor's Degree" },
                { value: "Master's Degree", label: "Master's Degree" },
              ]}
              {...register('educationLevel')}
            />
            <Input label="Current / Previous Institution" placeholder="e.g. Addis Ababa University" {...register('school')} />
            <Input label="GPA" type="number" step="0.01" min="0" max="4" placeholder="e.g. 3.5" {...register('gpa')} />
            <Input label="Graduation Year" type="number" placeholder="e.g. 2026" {...register('graduationYear')} />
            <Input label="Program of Interest" placeholder="e.g. Computer Science" {...register('intendedProgram')} />
            <Select
              label="Preferred Destination"
              options={[
                { value: '', label: 'Select...' },
                { value: 'USA', label: 'USA' },
                { value: 'Canada', label: 'Canada' },
                { value: 'UK', label: 'UK' },
                { value: 'Germany', label: 'Germany' },
                { value: 'Australia', label: 'Australia' },
                { value: 'Ireland', label: 'Ireland' },
                { value: 'Italy', label: 'Italy' },
              ]}
              {...register('preferredCountry')}
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
                { value: 'IELTS', label: 'IELTS' },
                { value: 'TOEFL', label: 'TOEFL' },
                { value: 'Duolingo', label: 'Duolingo' },
                { value: 'Medium of Instruction', label: 'English Medium of Instruction' },
              ]}
              {...register('englishTest')}
            />
            <Input label="Score" type="number" step="0.5" placeholder="e.g. 7.0" {...register('englishScore')} />
          </div>
        </Card>

        {/* Financial */}
        <Card className="mb-6">
          <h3 className="font-semibold text-carbon mb-4">Financial Budget</h3>
          <Input label="Annual Tuition Budget ($ USD)" type="number" placeholder="e.g. 25000" {...register('budget')} />
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
