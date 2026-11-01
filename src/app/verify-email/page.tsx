'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Card, Logo, LoadingSpinner } from '@/components/ui';

function VerifyEmail() {
  const token = useSearchParams().get('token');
  const [state, setState] = useState<'checking' | 'done' | 'failed'>(token ? 'checking' : 'failed');
  const [message, setMessage] = useState('This link is invalid or has expired. Sign in to get a new one.');
  const requested = useRef(false);

  useEffect(() => {
    // Links only work once, so never send the same one twice
    if (!token || requested.current) return;
    requested.current = true;
    authAPI
      .verifyEmail({ token })
      .then(() => setState('done'))
      .catch((err: { response?: { data?: { message?: string } } }) => {
        if (err.response?.data?.message) setMessage(err.response.data.message);
        setState('failed');
      });
  }, [token]);

  if (state === 'checking') return <LoadingSpinner text="Confirming your email..." />;

  return (
    <>
      <h1 className="text-xl font-semibold text-carbon">
        {state === 'done' ? 'Your email is confirmed' : 'We could not confirm your email'}
      </h1>
      <p className="text-dim-grey text-sm mt-2 mb-6">
        {state === 'done' ? 'Thank you. You can continue with your application.' : message}
      </p>
      <Link href="/dashboard" className="btn-primary">Go to your dashboard</Link>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-porcelain flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <Logo href="/" size="lg" subtitle="Education" />
        </div>
        <Card>
          <Suspense fallback={<LoadingSpinner text="Confirming your email..." />}>
            <VerifyEmail />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}
