'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Input, Select, Button, Badge, LoadingSpinner, ErrorState } from '@/components/ui';
import { CreditCard, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Payment {
  amount: number;
  method: string;
  transactionRef?: string;
  reference?: string;
  status: string;
  date?: string;
  submittedAt?: string;
  verifiedAt?: string;
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

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AddPaymentForm>({
    defaultValues: { amount: 500, method: 'telebirr' },
  });

  useEffect(() => {
    loadPayments();
  }, [user]);

  const loadPayments = async () => {
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
  };

  const onSubmit = async (data: AddPaymentForm) => {
    if (!user?._id) return;
    setSubmitting(true);
    try {
      const methodVal = data.method === 'bank' ? 'bank_transfer' : data.method;
      await studentsAPI.addPayment(user._id, {
        method: methodVal,
        amount: Number(data.amount) || 500,
        transactionRef: data.reference,
      });
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
      bank_transfer: '🏦 Bank Transfer',
      bank: '🏦 Bank Transfer',
      cash: '💵 Cash',
    };
    return map[m] || m;
  };

  if (loading) return <LoadingSpinner text="Loading payments..." />;
  if (error && !payments.length) return <ErrorState message={error} />;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Payments</h1>
          <p className="text-dim-grey text-sm mt-1">Registration fee: 500 ETB</p>
        </div>
        <Button variant="accent" onClick={() => setShowForm(!showForm)}>
          <Plus size={16} /> Add Payment
        </Button>
      </div>

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
        <Card>
          <h3 className="font-semibold text-carbon mb-4">Submit Payment</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Amount (ETB)"
                type="number"
                {...register('amount', { required: 'Required', min: 1 })}
                error={errors.amount?.message}
              />
              <Select
                label="Payment Method"
                options={[
                  { value: 'telebirr', label: 'Telebirr' },
                  { value: 'bank_transfer', label: 'Bank Transfer' },
                  { value: 'cash', label: 'Cash' },
                ]}
                {...register('method', { required: 'Required' })}
                error={errors.method?.message}
              />
            </div>
            <Input
              label="Transaction / Reference Number"
              placeholder="e.g. FT260824..."
              {...register('reference', { required: 'Required' })}
              error={errors.reference?.message}
            />
            <div className="flex gap-3">
              <Button type="submit" loading={submitting}>Submit Payment</Button>
              <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
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
                <div key={i} className="flex items-center justify-between p-3 bg-porcelain rounded-lg">
                  <div>
                    <p className="font-medium text-carbon">{methodLabel(p.method)}</p>
                    <p className="text-xs text-dim-grey">Ref: {p.transactionRef || p.reference || '—'}</p>
                    <p className="text-xs text-dim-grey">
                      {p.date || p.submittedAt ? new Date(p.date || p.submittedAt!).toLocaleDateString() : 'Recent'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-carbon">{p.amount} ETB</p>
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
