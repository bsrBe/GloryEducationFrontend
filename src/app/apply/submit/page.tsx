'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getDraft, syncToBackend, clearDraft, clearDocuments } from '@/lib/draftStorage';
import { useAuthStore } from '@/stores/authStore';
import { studentsAPI } from '@/lib/api';
import { Card, Button } from '@/components/ui';
import { ArrowRight, ArrowLeft, LogIn, UserPlus, CheckCircle } from 'lucide-react';

// Final wizard step: creates the account (or logs in) and sends the saved draft to the backend.
export default function ApplySubmitPage() {
  const router = useRouter();
  const { user, login, register: registerUser, loadFromStorage } = useAuthStore();
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authFirstName, setAuthFirstName] = useState('');
  const [authLastName, setAuthLastName] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  const syncAll = useCallback(async () => {
    // Read from the store: handleAuth calls this right after login, before a re-render
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?._id) return;
    setSubmitting(true);
    setError(null);
    try {
      const draft = await getDraft();
      const profile = (draft?.profile || {}) as Record<string, string>;

      // Upload profile (whitelisted fields only)
      const cleanProfile: Record<string, unknown> = {};
      if (profile.firstName) cleanProfile.firstName = profile.firstName;
      if (profile.lastName) cleanProfile.lastName = profile.lastName;
      if (profile.phone) cleanProfile.phone = profile.phone;
      if (profile.country) cleanProfile.country = profile.country;
      if (profile.educationLevel) cleanProfile.educationLevel = profile.educationLevel;
      if (profile.institution || profile.school) cleanProfile.school = profile.institution || profile.school;
      if (profile.gpa) cleanProfile.gpa = parseFloat(profile.gpa);
      if (profile.graduationYear) cleanProfile.graduationYear = parseInt(profile.graduationYear);
      if (profile.programInterest || profile.intendedProgram) cleanProfile.intendedProgram = profile.programInterest || profile.intendedProgram;
      if (profile.countryPreference || profile.preferredCountry) cleanProfile.preferredCountry = profile.countryPreference || profile.preferredCountry;
      if (profile.englishProficiency || profile.englishTest) cleanProfile.englishTest = profile.englishProficiency || profile.englishTest;
      if (profile.englishScore) cleanProfile.englishScore = parseFloat(profile.englishScore);
      if (profile.budget) cleanProfile.budget = Number(profile.budget);

      if (Object.keys(cleanProfile).length > 0) {
        await studentsAPI.updateProfile(currentUser._id, cleanProfile);
      }

      // Upload documents from IndexedDB
      await syncToBackend(currentUser._id);

      await clearDraft();
      await clearDocuments();
      setSubmitted(true);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to submit. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  }, []);

  const onSubmit = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    syncAll();
  };

  const handleAuth = async () => {
    setAuthError('');
    setAuthLoading(true);
    try {
      const draft = await getDraft();
      const profile = (draft?.profile || {}) as Record<string, string>;

      if (authMode === 'register') {
        const firstName = authFirstName || profile.firstName || '';
        const lastName = authLastName || profile.lastName || '';
        // Name and phone are required by the backend; phone only comes from the profile step
        if (!firstName || !lastName || !profile.phone) {
          setAuthError('Please complete the Profile step first (name and phone are required).');
          return;
        }
        await registerUser({
          email: authEmail,
          password: authPassword,
          firstName,
          lastName,
          phone: profile.phone,
          educationLevel: profile.educationLevel || '',
        });
      } else {
        await login(authEmail, authPassword);
      }
    } catch (err: unknown) {
      setAuthError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Authentication failed'
      );
      return;
    } finally {
      setAuthLoading(false);
    }
    // Sync everything to backend now that we're authenticated
    setShowAuth(false);
    await syncAll();
  };

  // Success screen
  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-green-bg rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green" />
        </div>
        <h1 className="text-2xl font-bold text-carbon mb-2">Application Submitted! 🎉</h1>
        <p className="text-dim-grey mb-6">
          Your registration is complete. We&apos;ll review your profile.
        </p>
        <div className="space-y-3">
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          <Button variant="ghost" onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Submit Your Application</h1>
        <p className="text-dim-grey text-sm mt-1">
          Your profile and documents are ready to send to the Veridan team.
        </p>
        {!user && (
          <div className="mt-2 bg-gold-light border border-gold/30 rounded-lg px-4 py-2 text-sm text-yellow-text">
            ⚠️ You&apos;ll need to create an account or login to submit. Your progress is saved.
          </div>
        )}
      </div>

      <Card className="border-ocean/20 bg-ocean-light/20">
        <div className="flex items-start gap-3">
          <CheckCircle size={20} className="text-ocean mt-0.5 flex-shrink-0" />
          <p className="text-sm text-dim-grey">
            Click &quot;Submit&quot; to finish. You can still update your details later from your dashboard.
          </p>
        </div>
      </Card>

      {/* Error */}
      {error && (
        <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" type="button" onClick={() => router.push('/apply/documents')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button type="button" onClick={onSubmit} loading={submitting} variant="accent">
          {user ? 'Submit Application' : 'Create Account & Submit'} <ArrowRight size={16} />
        </Button>
      </div>

      {/* Auth Modal — only shown when user clicks submit without being logged in */}
      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowAuth(false)} />
          <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4">
            <h2 className="text-xl font-bold text-carbon text-center">
              {authMode === 'register' ? 'Create Account to Submit' : 'Login to Submit'}
            </h2>
            <p className="text-xs text-dim-grey text-center -mt-2">
              Your profile and documents are saved. Just need an account to finish.
            </p>

            {authError && (
              <div className="bg-red-bg text-red-text px-3 py-2 rounded-lg text-sm">{authError}</div>
            )}

            {authMode === 'register' && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="First Name"
                  value={authFirstName}
                  onChange={(e) => setAuthFirstName(e.target.value)}
                  className="w-full bg-white border border-charcoal rounded-lg px-4 py-3 text-sm"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  value={authLastName}
                  onChange={(e) => setAuthLastName(e.target.value)}
                  className="w-full bg-white border border-charcoal rounded-lg px-4 py-3 text-sm"
                />
              </div>
            )}

            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              className="w-full bg-white border border-charcoal rounded-lg px-4 py-3 text-sm"
            />
            <input
              type="password"
              placeholder="Password (min 6 chars)"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              className="w-full bg-white border border-charcoal rounded-lg px-4 py-3 text-sm"
            />

            <Button onClick={handleAuth} loading={authLoading} className="w-full">
              {authMode === 'register' ? (
                <><UserPlus size={16} /> Create Account & Submit</>
              ) : (
                <><LogIn size={16} /> Login & Submit</>
              )}
            </Button>

            <p className="text-center text-sm text-dim-grey">
              {authMode === 'register' ? (
                <>Already have an account?{' '}
                  <button onClick={() => setAuthMode('login')} className="text-ocean font-medium">Login</button>
                </>
              ) : (
                <>Don&apos;t have an account?{' '}
                  <button onClick={() => setAuthMode('register')} className="text-ocean font-medium">Register</button>
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
