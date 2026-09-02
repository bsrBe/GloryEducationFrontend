'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { saveDraft, getDraft, syncToBackend, clearDraft, clearDocuments } from '@/lib/draftStorage';
import { useAuthStore } from '@/stores/authStore';
import { studentsAPI } from '@/lib/api';
import { Card, Input, Button } from '@/components/ui';
import {
  ArrowRight, ArrowLeft, CreditCard, Smartphone, Building2, Banknote,
  LogIn, UserPlus, CheckCircle,
} from 'lucide-react';

interface PaymentForm {
  method: string;
  amount: number;
  reference: string;
  transactionId: string;
}

export default function ApplyPaymentPage() {
  const router = useRouter();
  const { user, login, register: registerUser, loadFromStorage } = useAuthStore();
  const [selectedMethod, setSelectedMethod] = useState('');
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

  const { register, handleSubmit, watch, getValues, reset, formState: { errors } } = useForm<PaymentForm>({
    defaultValues: { amount: 500 },
  });

  useEffect(() => {
    loadFromStorage();
    getDraft().then((draft) => {
      if (draft?.payment) {
        const p = draft.payment as Record<string, string>;
        reset({
          method: p.method || '',
          amount: Number(p.amount) || 500,
          reference: p.reference || '',
          transactionId: p.transactionId || '',
        });
        setSelectedMethod(p.method || '');
      }
    });
  }, [reset, loadFromStorage]);

  useEffect(() => {
    const subscription = watch((value) => {
      getDraft().then((draft) => {
        saveDraft({
          profile: draft?.profile || {},
          payment: value as unknown as Record<string, unknown>,
          currentStep: 3,
        });
      });
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const syncAll = useCallback(async () => {
    if (!user?._id) return;
    setSubmitting(true);
    setError(null);
    try {
      const draft = await getDraft();
      const profile = (draft?.profile || {}) as Record<string, string>;
      const payment = (draft?.payment || {}) as Record<string, string>;
      const currentValues = getValues();

      // Upload profile (whitelisted fields only)
      const cleanProfile: Record<string, unknown> = {};
      if (profile.firstName) cleanProfile.firstName = profile.firstName;
      if (profile.lastName) cleanProfile.lastName = profile.lastName;
      if (profile.phone) cleanProfile.phone = profile.phone;
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
        await studentsAPI.updateProfile(user._id, cleanProfile);
      }

      // Upload documents from IndexedDB
      await syncToBackend(user._id);

      // Submit payment
      const paymentMethod = (payment.method || selectedMethod || 'telebirr').toLowerCase();
      const validMethod = ['telebirr', 'bank_transfer', 'cbe', 'boa', 'cash'].includes(paymentMethod)
        ? paymentMethod
        : (paymentMethod === 'bank' ? 'cbe' : 'telebirr');
      const ref = (payment.reference || payment.transactionId || currentValues.reference || currentValues.transactionId || '').trim();

      if (ref) {
        await studentsAPI.addPayment(user._id, {
          method: validMethod,
          provider: validMethod,
          amount: Number(payment.amount) || Number(currentValues.amount) || 500,
          transactionRef: ref,
        });
      }

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
  }, [user, selectedMethod, getValues]);

  // After login, check auth and proceed
  useEffect(() => {
    if (user && showAuth) {
      setShowAuth(false);
      // Sync everything to backend now that we're authenticated
      syncAll();
    }
  }, [user, showAuth, syncAll]);

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
        await registerUser({
          email: authEmail,
          password: authPassword,
          firstName: authFirstName || profile.firstName || '',
          lastName: authLastName || profile.lastName || '',
          phone: profile.phone || '',
          educationLevel: profile.educationLevel || '',
        });
      } else {
        await login(authEmail, authPassword);
      }
      // syncAll will be triggered by useEffect when user changes
    } catch (err: unknown) {
      setAuthError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Authentication failed'
      );
    } finally {
      setAuthLoading(false);
    }
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
          Your registration is complete. Your payment has been submitted for automated banking verification.
        </p>
        <div className="space-y-3">
          <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          <Button variant="ghost" onClick={() => router.push('/')}>Back to Home</Button>
        </div>
      </div>
    );
  }

  const methods = [
    { id: 'telebirr', label: 'Telebirr', icon: <Smartphone size={20} />, desc: 'Instant Verification' },
    { id: 'cbe', label: 'Commercial Bank of Ethiopia', icon: <Building2 size={20} />, desc: 'CBE Mobile Slip / SMS' },
    { id: 'boa', label: 'Bank of Abyssinia', icon: <Building2 size={20} />, desc: 'BOA Slip Token or Link' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Payment Information</h1>
        <p className="text-dim-grey text-sm mt-1">
          Registration fee: <span className="font-semibold text-carbon">500 ETB</span>
        </p>
        {!user && (
          <div className="mt-2 bg-gold-light border border-gold/30 rounded-lg px-4 py-2 text-sm text-yellow-text">
            ⚠️ You&apos;ll need to create an account or login to complete payment. Your progress is saved.
          </div>
        )}
      </div>

      {/* Payment Instructions */}
      <Card className="border-ocean/20 bg-ocean-light/20">
        <div className="flex items-start gap-3">
          <CreditCard size={20} className="text-ocean mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-carbon">How payment works:</p>
            <ol className="mt-1 text-dim-grey space-y-1 list-decimal list-inside">
              <li>Choose your payment method below</li>
              <li>Send <strong className="text-carbon">500 ETB</strong> using the provided details</li>
              <li>Enter the transaction reference number</li>
              <li>Click &quot;Submit&quot; — create account to finalize, then payment is verified by our team</li>
            </ol>
          </div>
        </div>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Payment Method */}
        <Card className="mb-5">
          <h3 className="font-semibold text-carbon mb-4">Select Payment Method</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {methods.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setSelectedMethod(m.id);
                  const input = document.querySelector('input[name="method"]') as HTMLInputElement;
                  if (input) {
                    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                    setter?.call(input, m.id);
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                  }
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedMethod === m.id
                    ? 'border-ocean bg-ocean-light/20'
                    : 'border-charcoal/20 hover:border-charcoal/40'
                }`}
              >
                <div className="text-ocean mb-2">{m.icon}</div>
                <p className="font-medium text-carbon text-sm">{m.label}</p>
                <p className="text-xs text-dim-grey mt-0.5">{m.desc}</p>
              </button>
            ))}
          </div>
          <input type="hidden" {...register('method', { required: 'Select a payment method' })} />
          {errors.method && <p className="text-sm text-red mt-2">{errors.method.message}</p>}
        </Card>

        {/* Transaction Details */}
        <Card className="mb-5">
          <h3 className="font-semibold text-carbon mb-4">Transaction Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount (ETB)"
              type="number"
              {...register('amount', { required: 'Required', min: 500 })}
              error={errors.amount?.message}
            />
            <Input
              label="Reference Number *"
              placeholder="Transaction reference from your receipt"
              {...register('reference', { required: 'Enter the reference number' })}
              error={errors.reference?.message}
            />
            <Input
              label="Transaction ID (optional)"
              placeholder="Additional transaction ID"
              {...register('transactionId')}
            />
          </div>
        </Card>

        {/* Error */}
        {error && (
          <div className="bg-red-bg border border-red/30 text-red-text px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="secondary" type="button" onClick={() => router.push('/apply/documents')}>
            <ArrowLeft size={16} /> Back
          </Button>
          <Button type="submit" loading={submitting} variant="accent">
            {user ? 'Submit Application' : 'Create Account & Submit'} <ArrowRight size={16} />
          </Button>
        </div>
      </form>

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
