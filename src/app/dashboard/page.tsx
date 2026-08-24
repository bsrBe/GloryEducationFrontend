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
  profile: {
    completionPercentage: number;
  };
  payment: {
    status: string;
  };
  documents: {
    count: number;
  };
  assessment: {
    totalScore: number | null;
  };
  match: {
    primaryMatch: { name: string } | null;
  };
  result: {
    decision: string;
  };
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

  const profileComplete = data?.profile?.completionPercentage || 0;
  const paymentStatus = data?.payment?.status || 'pending';
  const docCount = data?.documents?.count || 0;
  const hasAssessment = !!data?.assessment?.totalScore;
  const hasMatch = !!data?.match?.primaryMatch;
  const hasResult = !!data?.result?.decision;

  const progressSteps = [
    paymentStatus === 'verified',
    profileComplete === 100,
    hasAssessment,
    hasMatch,
    hasResult,
  ];
  const progressPct = Math.round(
    (progressSteps.filter(Boolean).length / progressSteps.length) * 100
  );

  const decisionVariant = (d: string) => {
    if (d === 'green') return 'green' as const;
    if (d === 'yellow') return 'yellow' as const;
    return 'red' as const;
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-carbon">
          Welcome back, {user?.firstName}! 👋
        </h1>
        <p className="text-dim-grey text-sm mt-1">
          Student ID: <span className="text-gold font-semibold">{user?.studentId || '—'}</span>
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
          value={paymentStatus === 'verified' ? 'Verified' : 'Pending'}
          done={paymentStatus === 'verified'}
          href="/dashboard/payments"
        />
        <StatusCard
          icon={<FileText size={20} />}
          title="Documents"
          value={`${docCount} uploaded`}
          done={docCount > 0}
          href="/dashboard/documents"
        />
        <StatusCard
          icon={<BarChart3 size={20} />}
          title="Assessment"
          value={hasAssessment ? `${data?.assessment?.totalScore}/100` : 'Pending'}
          done={hasAssessment}
          href="/dashboard"
        />
        <StatusCard
          icon={<Target size={20} />}
          title="Match"
          value={hasMatch ? data?.match?.primaryMatch?.name || 'Matched' : 'Pending'}
          done={hasMatch}
          href="/dashboard"
        />
        <StatusCard
          icon={<ClipboardCheck size={20} />}
          title="Result"
          value={hasResult ? data?.result?.decision.toUpperCase() : 'Pending'}
          done={hasResult}
          variant={hasResult ? decisionVariant(data!.result.decision) : undefined}
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
