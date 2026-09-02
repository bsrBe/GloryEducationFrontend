'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getDraft, getDocuments } from '@/lib/draftStorage';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge } from '@/components/ui';
import { ArrowLeft, ArrowRight, FileText, CheckCircle } from 'lucide-react';

export default function ApplyReviewPage() {
  const router = useRouter();
  const { user, loadFromStorage } = useAuthStore();
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [payment, setPayment] = useState<Record<string, string>>({});
  const [docs, setDocs] = useState<{ id: string; fileName: string; fileType: string; fileSize: number }[]>([]);

  useEffect(() => {
    loadFromStorage();
    getDraft().then((d) => {
      setProfile((d?.profile || {}) as Record<string, string>);
      setPayment((d?.payment || {}) as Record<string, string>);
    });
    getDocuments().then((d) =>
      setDocs(d.map(({ id, fileName, fileType, fileSize }) => ({ id, fileName, fileType, fileSize })))
    );
  }, [loadFromStorage]);

  // Redirect to payment if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/apply/payment');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Review Your Application</h1>
        <p className="text-dim-grey text-sm mt-1">
          Everything looks good? Click &quot;Submit&quot; to complete your registration.
        </p>
        <div className="mt-2 bg-green-bg border border-green/30 rounded-lg px-4 py-2 text-sm text-green-text flex items-center gap-2">
          <CheckCircle size={14} />
          Logged in as <strong>{user.email}</strong>
        </div>
      </div>

      {/* Profile Summary */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-carbon">Profile</h3>
          <Button variant="ghost" size="sm" onClick={() => router.push('/apply/profile')}>Edit</Button>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-dim-grey">Name</p>
            <p className="font-medium text-carbon">{profile.firstName} {profile.lastName}</p>
          </div>
          <div>
            <p className="text-dim-grey">Email</p>
            <p className="font-medium text-carbon">{profile.email}</p>
          </div>
          <div>
            <p className="text-dim-grey">Education</p>
            <p className="font-medium text-carbon capitalize">{profile.educationLevel?.replace('_', ' ') || '—'}</p>
          </div>
          <div>
            <p className="text-dim-grey">GPA</p>
            <p className="font-medium text-carbon">{profile.gpa || '—'}</p>
          </div>
          <div>
            <p className="text-dim-grey">Program</p>
            <p className="font-medium text-carbon">{profile.programInterest || '—'}</p>
          </div>
          <div>
            <p className="text-dim-grey">Country</p>
            <p className="font-medium text-carbon capitalize">{profile.countryPreference || '—'}</p>
          </div>
          <div>
            <p className="text-dim-grey">English</p>
            <p className="font-medium text-carbon">{profile.englishProficiency} {profile.englishScore}</p>
          </div>
          <div>
            <p className="text-dim-grey">Budget</p>
            <p className="font-medium text-carbon capitalize">{profile.financialBudget?.replace('_', ' ') || '—'}</p>
          </div>
        </div>
      </Card>

      {/* Documents */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-carbon">Documents ({docs.length})</h3>
          <Button variant="ghost" size="sm" onClick={() => router.push('/apply/documents')}>Edit</Button>
        </div>
        {docs.length === 0 ? (
          <p className="text-sm text-dim-grey">No documents uploaded</p>
        ) : (
          <div className="space-y-2">
            {docs.map((d) => (
              <div key={d.id} className="flex items-center gap-2 text-sm">
                <FileText size={14} className="text-ocean" />
                <span className="text-carbon">{d.fileName}</span>
                <Badge variant="blue" className="text-xs">Ready</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Payment */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-carbon">Payment</h3>
          <Button variant="ghost" size="sm" onClick={() => router.push('/apply/payment')}>Edit</Button>
        </div>
        {payment.method ? (
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-dim-grey">Method</p>
              <p className="font-medium text-carbon capitalize">{payment.method}</p>
            </div>
            <div>
              <p className="text-dim-grey">Amount</p>
              <p className="font-medium text-carbon">{payment.amount || 500} ETB</p>
            </div>
            <div>
              <p className="text-dim-grey">Reference</p>
              <p className="font-medium text-carbon">{payment.reference}</p>
            </div>
          </div>
        ) : (
          <p className="text-sm text-dim-grey">No payment info</p>
        )}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={() => router.push('/apply/payment')}>
          <ArrowLeft size={16} /> Back
        </Button>
        <Button variant="accent" onClick={() => router.push('/dashboard')}>
          Go to Student Dashboard <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
}
