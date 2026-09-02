'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Input, Select, Button, Badge, LoadingSpinner, ErrorState } from '@/components/ui';
import { CreditCard, Plus, CheckCircle, Clock, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

interface Payment {
  amount: number;
  method: string;
  transactionRef?: string;
  reference?: string;
  status: string;
  date?: string;
  submittedAt?: string;
  verifiedAt?: string;
  verificationProvider?: string;
}

interface AddPaymentForm {
  amount: number;
  method: string;
  reference: string;
}

export default function PaymentsPage() {
  const user = useAuthStore((s) => s.user);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'info'; message: string } | null>(null);

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<AddPaymentForm>({
    defaultValues: { amount: 500, method: 'telebirr' },
  });

  const selectedMethod = watch('method');

  const loadPayments = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await studentsAPI.get(user._id);
      setPayments(res.data.payments || []);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load payments'
      );
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    let active = true;
    if (user?._id) {
      studentsAPI
        .get(user._id)
        .then((res) => {
          if (active) {
            setPayments(res.data.payments || []);
            setLoading(false);
          }
        })
        .catch((err: unknown) => {
          if (active) {
            setError(
              (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to load payments'
            );
            setLoading(false);
          }
        });
    }
    return () => {
      active = false;
    };
  }, [user]);

  const onSubmit = async (data: AddPaymentForm) => {
    if (!user?._id) return;
    setSubmitting(true);
    setError(null);
    setFeedback(null);
    try {
      const res = await studentsAPI.addPayment(user._id, {
        method: data.method,
        provider: data.method,
        amount: Number(data.amount) || 500,
        transactionRef: data.reference.trim(),
      });

      const isInstantVerified = res.data?.verified || false;
      if (isInstantVerified) {
        setFeedback({
          type: 'success',
          message: 'Payment verified instantly via banking gateway! Your Admissions Fair Pass is active.',
        });
      } else {
        setFeedback({
          type: 'info',
          message: res.data?.message || 'Payment recorded. Pending manual review.',
        });
      }

      reset();
      setShowForm(false);
      loadPayments();
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to submit payment'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const totalPaid = payments
    .filter((p) => (p.status || '').toLowerCase() === 'verified')
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const methodLabel = (m: string) => {
    const map: Record<string, string> = {
      telebirr: '📱 Telebirr',
      cbe: '🏦 Commercial Bank of Ethiopia (CBE)',
      boa: '🏦 Bank of Abyssinia (BOA)',
      bank_transfer: '🏦 Bank Transfer',
      bank: '🏦 Bank Transfer',
      cash: '💵 Cash',
    };
    return map[m] || m;
  };

  const getMethodHint = (m: string) => {
    switch (m) {
      case 'cbe':
        return {
          label: 'CBE Receipt ID or SMS Slip Link',
          placeholder: 'e.g. FT240...-12345678 or https://mbreciept.cbe.com.et/...',
          tip: 'Enter the dashed receipt ID from your CBE SMS or paste the receipt link.',
        };
      case 'boa':
        return {
          label: 'Abyssinia 17-char Slip Token or Link',
          placeholder: 'e.g. FT24000000000000A or https://cs.bankofabyssinia.com/slip/?trx=...',
          tip: 'Enter the 17-character slip token or paste the slip link from your BOA confirmation.',
        };
      case 'telebirr':
      default:
        return {
          label: 'Telebirr Transaction Code or Receipt URL',
          placeholder: 'e.g. DB12345678 or https://transactioninfo.ethiotelecom.et/receipt/...',
          tip: 'Enter your 10-char Telebirr transaction ID (from SMS) or paste the receipt link.',
        };
    }
  };

  const currentHint = getMethodHint(selectedMethod);

  if (loading) return <LoadingSpinner text="Loading payments..." />;
  if (error && !payments.length) return <ErrorState message={error} />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Payments</h1>
          <p className="text-dim-grey text-sm mt-1">Admissions Fair Registration fee: 500 ETB</p>
        </div>
        <Button variant="accent" onClick={() => { setShowForm(!showForm); setFeedback(null); }}>
          <Plus size={16} /> Add Payment
        </Button>
      </div>

      {/* Live Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-start gap-2.5">
            {feedback.type === 'success' ? (
              <CheckCircle className="text-emerald-600 mt-0.5 shrink-0" size={18} />
            ) : (
              <Clock className="text-blue-600 mt-0.5 shrink-0" size={18} />
            )}
            <div>
              <p className="text-sm font-medium">{feedback.message}</p>
              {feedback.type === 'success' && (
                <p className="text-xs text-emerald-700 mt-1">
                  You can now join all live university sessions in the conference rooms.
                </p>
              )}
            </div>
          </div>
          {feedback.type === 'success' && (
            <Link
              href="/dashboard/events"
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition shrink-0"
            >
              Enter Rooms →
            </Link>
          )}
        </div>
      )}

      {/* Fair Pass Banner when Verified */}
      {totalPaid >= 500 && (
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-4 rounded-xl shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-1.5">
                Admissions Fair Live Pass Active <Sparkles size={15} />
              </h3>
              <p className="text-xs text-white/80">
                You have verified access to in-platform video rooms for plenary sessions and university tracks.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/events"
            className="px-3.5 py-1.5 bg-white text-emerald-800 hover:bg-white/90 text-xs font-bold rounded-lg transition shadow-sm"
          >
            Live Sessions →
          </Link>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center">
          <p className="text-sm text-dim-grey">Required</p>
          <p className="text-2xl font-bold text-carbon">500 ETB</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-dim-grey">Verified Paid</p>
          <p className="text-2xl font-bold text-green">{totalPaid} ETB</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-dim-grey">Status</p>
          <p className="mt-1">
            {totalPaid >= 500 ? (
              <Badge variant="green"><CheckCircle size={12} /> Paid</Badge>
            ) : (
              <Badge variant="yellow"><Clock size={12} /> Pending</Badge>
            )}
          </p>
        </Card>
      </div>

      {/* Add Payment Form */}
      {showForm && (
        <Card className="border-2 border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-carbon">Submit Payment</h3>
              <p className="text-xs text-dim-grey">
                Select your payment method. Instant verification is supported for Telebirr, CBE, and Bank of Abyssinia.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Payment Method / Bank"
                options={[
                  { value: 'telebirr', label: '📱 Telebirr (Instant Verification)' },
                  { value: 'cbe', label: '🏦 Commercial Bank of Ethiopia (CBE)' },
                  { value: 'boa', label: '🏦 Bank of Abyssinia (BOA)' },
                ]}
                {...register('method', { required: 'Required' })}
                error={errors.method?.message}
              />
              <Input
                label="Amount (ETB)"
                type="number"
                {...register('amount', { required: 'Required', min: 1 })}
                error={errors.amount?.message}
              />
            </div>

            <div>
              <Input
                label={currentHint.label}
                placeholder={currentHint.placeholder}
                {...register('reference', { required: 'Required' })}
                error={errors.reference?.message}
              />
              <p className="text-xs text-dim-grey mt-1">{currentHint.tip}</p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" loading={submitting}>
                {submitting ? 'Verifying with Bank...' : 'Verify & Submit Payment'}
              </Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Payment History */}
      <Card>
        <h3 className="font-semibold text-carbon mb-4">Payment History</h3>
        {payments.length === 0 ? (
          <div className="text-center py-8 text-dim-grey">
            <CreditCard size={32} className="mx-auto mb-2 opacity-50" />
            <p>No payments submitted yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {payments.map((p, i) => {
              const isVerified = (p.status || '').toLowerCase() === 'verified';
              const isFailed = (p.status || '').toLowerCase() === 'failed';
              return (
                <div key={i} className="flex items-center justify-between p-3.5 bg-porcelain rounded-lg">
                  <div>
                    <p className="font-medium text-carbon text-sm">{methodLabel(p.method)}</p>
                    <p className="text-xs text-dim-grey truncate max-w-xs md:max-w-md">
                      Ref: <span className="font-mono">{p.transactionRef || p.reference || '—'}</span>
                    </p>
                    <p className="text-xs text-dim-grey mt-0.5">
                      {p.date || p.submittedAt ? new Date(p.date || p.submittedAt!).toLocaleDateString() : 'Recent'}
                      {p.verificationProvider && (
                        <span className="ml-2 text-emerald-700 font-medium">
                          • Verified via {p.verificationProvider.toUpperCase()}
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-carbon text-sm">{p.amount} ETB</p>
                    <Badge variant={isVerified ? 'green' : (isFailed ? 'red' : 'yellow')}>
                      {isVerified ? '✅ Verified' : (isFailed ? '❌ Failed' : '⏳ Pending')}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}

