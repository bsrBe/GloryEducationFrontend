'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { LoadingSpinner } from '@/components/ui';
import { AuthShell } from '@/components/auth/AuthShell';

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
      <h2 className="font-display font-semibold text-xl text-black">
        {state === 'done' ? 'Your email is confirmed' : 'We could not confirm your email'}
      </h2>
      <p className="text-dim-grey mt-2 mb-6">
        {state === 'done' ? 'Thank you. You can continue with your application.' : message}
      </p>
      <Link href="/dashboard" className="btn-accent">Go to your dashboard</Link>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthShell title="Confirm your email">
      <Suspense fallback={<LoadingSpinner text="Confirming your email..." />}>
        <VerifyEmail />
      </Suspense>
    </AuthShell>
  );
}
