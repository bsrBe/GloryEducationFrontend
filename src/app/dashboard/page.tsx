'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Badge, LoadingSpinner, ErrorState } from '@/components/ui';
import {
  User,
  CreditCard,
  FileText,
  BarChart3,
  Target,
  ClipboardCheck,
} from 'lucide-react';

interface DashboardData {
  studentId?: string;
  name?: string;
  email?: string;
  profileComplete?: number;
  paymentStatus?: string;
  documentStatus?: string;
  assessmentStatus?: string;
  assessmentScore?: number | null;
  matchStatus?: string;
  primaryMatch?: string | null;
  secondaryMatch?: string | null;
  representativeDecision?: string;
  resultPublished?: boolean;
  result?: {
    status: string;
    nextStep: string;
    disclaimer: string;
  } | null;
  applicationStage?: string;
}

export default function StudentDashboard() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentsAPI
      .getDashboard()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load dashboard');
        setLoading(false);
      });
  }, []);

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;
  if (error) return <ErrorState message={error} />;

  const profileComplete = data?.profileComplete ?? 0;
  const isPaymentVerified = (data?.paymentStatus || '').toLowerCase() === 'verified';
  const hasDocuments = data?.documentStatus && data.documentStatus !== 'Not Uploaded';
  const hasAssessment = data?.assessmentStatus === 'Completed' || (data?.assessmentScore != null && data.assessmentScore > 0);
  const hasMatch = !!data?.primaryMatch;
  const hasResult = !!data?.resultPublished || !!data?.result?.status;

  const progressSteps = [
    isPaymentVerified,
    profileComplete === 100,
    hasDocuments,
    hasAssessment,
    hasMatch,
    hasResult,
  ];
  const progressPct = Math.round(
    (progressSteps.filter(Boolean).length / progressSteps.length) * 100
  );

  const decisionVariant = (d?: string) => {
    const lower = (d || '').toLowerCase();
    if (lower === 'green') return 'green' as const;
    if (lower === 'yellow') return 'yellow' as const;
    return 'red' as const;
  };

  const resultDecision = data?.result?.status || data?.representativeDecision;

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-carbon">
          Welcome back, {user?.firstName || data?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-dim-grey text-sm mt-1">
          Student ID: <span className="text-gold font-semibold">{user?.studentId || data?.studentId || '—'}</span>
        </p>
      </div>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <StatusCard
          icon={<User size={20} />}
          title="Profile"
          value={`${profileComplete}%`}
          done={profileComplete === 100}
          href="/dashboard/profile"
        />
        <StatusCard
          icon={<CreditCard size={20} />}
          title="Payment"
          value={isPaymentVerified ? 'Verified' : 'Pending'}
          done={isPaymentVerified}
          href="/dashboard/payments"
        />
        <StatusCard
          icon={<FileText size={20} />}
          title="Documents"
          value={data?.documentStatus || 'Not Uploaded'}
          done={!!hasDocuments}
          href="/dashboard/documents"
        />
        <StatusCard
          icon={<BarChart3 size={20} />}
          title="Assessment"
          value={hasAssessment ? `${data?.assessmentScore || 0}/100` : 'Pending'}
          done={!!hasAssessment}
          href="/dashboard"
        />
        <StatusCard
          icon={<Target size={20} />}
          title="Match"
          value={data?.primaryMatch || 'Pending'}
          done={!!hasMatch}
          href="/dashboard"
        />
        <StatusCard
          icon={<ClipboardCheck size={20} />}
          title="Result"
          value={hasResult && resultDecision ? resultDecision.toUpperCase() : 'Pending'}
          done={!!hasResult}
          variant={hasResult && resultDecision ? decisionVariant(resultDecision) : undefined}
          href="/dashboard/results"
        />
      </div>

      {/* Progress */}
      <Card>
        <h3 className="font-semibold text-carbon mb-3">Your Progress</h3>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="text-sm text-dim-grey mt-2">{progressPct}% Complete</p>
      </Card>

      {/* Event Preview */}
      <Card className="border-ocean/20">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-ocean-light rounded-xl flex items-center justify-center">
            📅
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-carbon">Glory Fair 2026</h3>
            <p className="text-sm text-dim-grey">September 15, 2026 • 2:00 PM - 5:00 PM</p>
          </div>
          <Badge variant="blue">Upcoming</Badge>
        </div>
      </Card>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  done,
  variant,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  done: boolean;
  variant?: 'green' | 'yellow' | 'red';
  href: string;
}) {
  const statusEmoji = done ? '✅' : '⏳';
  return (
    <a href={href} className="card p-3 sm:p-6 hover:shadow-lg transition-shadow cursor-pointer group">
      <div className="text-ocean mb-2 group-hover:text-ocean-dark transition-colors">
        {icon}
      </div>
      <p className="text-xs text-dim-grey">{title}</p>
      <p className="font-semibold text-carbon text-sm mt-0.5">{statusEmoji} {value}</p>
      {variant && (
        <Badge variant={variant} className="mt-2 text-xs">
          {variant === 'green' ? 'Eligible' : variant === 'yellow' ? 'Review' : 'No Match'}
        </Badge>
      )}
    </a>
  );
}
