'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Badge, LoadingSpinner, ErrorState, Button } from '@/components/ui';
import {
  User,
  CreditCard,
  FileText,
  BarChart3,
  Target,
  ClipboardCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
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

  if (loading) return <LoadingSpinner text="Loading your admissions portal..." />;
  if (error) return <ErrorState message={error} />;

  const profileComplete = data?.profileComplete ?? 0;
  const isPaymentVerified = (data?.paymentStatus || '').toLowerCase() === 'verified';
  const hasDocuments = data?.documentStatus && data.documentStatus !== 'Not Uploaded';
  const hasAssessment = data?.assessmentStatus === 'Completed' || (data?.assessmentScore != null && data.assessmentScore > 0);
  const hasMatch = !!data?.primaryMatch;
  const hasResult = !!data?.resultPublished || !!data?.result?.status;

  const steps = [
    { label: 'Register & Account', done: true },
    { label: '500 ETB Pass', done: isPaymentVerified },
    { label: 'Academic Profile', done: profileComplete === 100 },
    { label: 'Upload Documents', done: !!hasDocuments },
    { label: 'Score Assessment', done: !!hasAssessment },
    { label: 'University Match', done: !!hasMatch },
  ];

  const completedStepsCount = steps.filter((s) => s.done).length;
  const progressPct = Math.round((completedStepsCount / steps.length) * 100);

  const decisionVariant = (d?: string) => {
    const lower = (d || '').toLowerCase();
    if (lower === 'green') return 'green' as const;
    if (lower === 'yellow') return 'yellow' as const;
    return 'red' as const;
  };

  const resultDecision = data?.result?.status || data?.representativeDecision;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-carbon via-[#242422] to-carbon text-white p-6 sm:p-8 border border-charcoal/30 shadow-lg">
        <div className="absolute top-0 right-0 w-96 h-96 bg-ocean/15 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-gold/10 blur-3xl rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs font-semibold text-gold mb-3">
              <Sparkles size={13} />
              <span>International Admissions Fair 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.firstName || data?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-xs sm:text-sm text-dim-grey/90 mt-1 flex flex-wrap items-center gap-2 sm:gap-4">
              <span>
                Student ID:{' '}
                <span className="font-mono font-bold text-gold bg-gold/10 px-2 py-0.5 rounded-md border border-gold/20">
                  {user?.studentId || data?.studentId || 'GH26-PENDING'}
                </span>
              </span>
              <span>•</span>
              <span className="text-pale-sky">Status: {data?.applicationStage || 'In Progress'}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/apply/profile">
              <Button variant="accent" size="sm" className="shadow-glow-gold font-bold">
                Edit Profile Details
              </Button>
            </Link>
            <Link href="/dashboard/events">
              <Button variant="secondary" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                Fair Sessions
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Status Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatusCard
          icon={<User size={18} />}
          title="Profile Form"
          value={`${profileComplete}%`}
          subtext="Academic data"
          done={profileComplete === 100}
          color="ocean"
          href="/dashboard/profile"
        />
        <StatusCard
          icon={<CreditCard size={18} />}
          title="500 ETB Pass"
          value={isPaymentVerified ? 'Verified' : 'Pending'}
          subtext={isPaymentVerified ? 'Pass active' : 'Receipt review'}
          done={isPaymentVerified}
          color="gold"
          href="/dashboard/payments"
        />
        <StatusCard
          icon={<FileText size={18} />}
          title="Documents"
          value={data?.documentStatus || 'Not Uploaded'}
          subtext="Transcripts & IDs"
          done={!!hasDocuments}
          color="ocean"
          href="/dashboard/documents"
        />
        <StatusCard
          icon={<BarChart3 size={18} />}
          title="100-Pt Score"
          value={hasAssessment ? `${data?.assessmentScore || 0}/100` : 'Pending'}
          subtext="Evaluation engine"
          done={!!hasAssessment}
          color="gold"
          href="/dashboard"
        />
        <StatusCard
          icon={<Target size={18} />}
          title="Target Match"
          value={data?.primaryMatch || 'Pending'}
          subtext="Institution fit"
          done={!!hasMatch}
          color="ocean"
          href="/dashboard"
        />
        <StatusCard
          icon={<ClipboardCheck size={18} />}
          title="Fair Decision"
          value={hasResult && resultDecision ? resultDecision.toUpperCase() : 'Pending'}
          subtext="Rep evaluation"
          done={!!hasResult}
          color="green"
          variant={hasResult && resultDecision ? decisionVariant(resultDecision) : undefined}
          href="/dashboard/results"
        />
      </div>

      {/* Progress Milestone Pipeline */}
      <Card className="p-6 sm:p-7">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base sm:text-lg text-carbon">Your Admissions Pipeline</h3>
            <p className="text-xs text-dim-grey mt-0.5">
              {completedStepsCount} of {steps.length} milestones complete
            </p>
          </div>
          <span className="text-base sm:text-lg font-black text-ocean">{progressPct}%</span>
        </div>

        <div className="progress-bar h-2.5 mb-6">
          <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
          {steps.map((step, idx) => (
            <div
              key={step.label}
              className={`p-2.5 rounded-xl border transition-all ${
                step.done
                  ? 'bg-green/5 border-green/30 text-green-text'
                  : 'bg-porcelain/60 border-charcoal/15 text-dim-grey'
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold mb-0.5">
                {step.done ? (
                  <CheckCircle2 size={13} className="text-green shrink-0" />
                ) : (
                  <Clock size={13} className="text-dim-grey shrink-0" />
                )}
                <span>Step 0{idx + 1}</span>
              </div>
              <p className="text-[11px] truncate">{step.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Event Schedule & Next Actions Grid */}
      <div className="grid md:grid-cols-3 gap-5">
        <Card className="md:col-span-2 border-ocean/20 p-6 flex flex-col justify-between">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-ocean/10 border border-ocean/20 flex items-center justify-center text-ocean shrink-0">
              <Calendar size={24} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="blue" dot>Live Virtual Fair</Badge>
                <Badge variant="yellow">Breakout Sessions</Badge>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-carbon">
                Glory International Admissions Fair 2026
              </h3>
              <p className="text-xs sm:text-sm text-dim-grey mt-1">
                September 15, 2026 • 2:00 PM - 5:00 PM (EAT)
              </p>
              <p className="text-xs text-dim-grey mt-2">
                Join dedicated virtual tracks with university representatives from the US, UK, Canada, and Europe.
              </p>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-charcoal/10 flex items-center justify-between">
            <span className="text-xs font-semibold text-ocean flex items-center gap-1">
              Google Meet Link Available on Event Day
            </span>
            <Link href="/dashboard/events">
              <Button variant="ghost" size="sm" className="text-xs font-bold text-ocean">
                View Schedule <ArrowRight size={14} />
              </Button>
            </Link>
          </div>
        </Card>

        <Card className="p-6 flex flex-col justify-between bg-gradient-to-br from-white to-pale-sky/20">
          <div>
            <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/30 flex items-center justify-center text-gold-dark mb-4">
              <AlertCircle size={20} />
            </div>
            <h4 className="font-bold text-sm text-carbon mb-1">Need Consultation?</h4>
            <p className="text-xs text-dim-grey leading-relaxed">
              Message your assigned advisor directly through our internal messaging inbox for help with documents or scoring.
            </p>
          </div>
          <Link href="/dashboard/messages" className="mt-5">
            <Button variant="outline-ocean" size="sm" className="w-full text-xs font-bold">
              Open Advisor Messages
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}

function StatusCard({
  icon,
  title,
  value,
  subtext,
  done,
  color = 'ocean',
  variant,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtext?: string;
  done: boolean;
  color?: 'ocean' | 'gold' | 'green';
  variant?: 'green' | 'yellow' | 'red';
  href: string;
}) {
  const colorStyles = {
    ocean: 'bg-ocean/10 text-ocean border-ocean/20',
    gold: 'bg-gold/15 text-gold-dark border-gold/30',
    green: 'bg-green/10 text-green border-green/20',
  };

  return (
    <Link
      href={href}
      className="card card-hoverable p-4 sm:p-5 flex flex-col justify-between group transition-all duration-300 relative overflow-hidden"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colorStyles[color]}`}>
            {icon}
          </div>
          <span
            className={`w-2 h-2 rounded-full ${done ? 'bg-green ring-4 ring-green/20' : 'bg-gold ring-4 ring-gold/20'}`}
          />
        </div>
        <p className="text-xs font-semibold text-dim-grey truncate">{title}</p>
        <p className="font-bold text-carbon text-sm sm:text-base mt-0.5 truncate">{value}</p>
      </div>

      <div className="mt-3 pt-2 border-t border-charcoal/10 flex items-center justify-between text-[11px]">
        {variant ? (
          <Badge variant={variant} className="text-[10px] px-1.5 py-0.5">
            {variant === 'green' ? 'Eligible' : variant === 'yellow' ? 'Review' : 'No Match'}
          </Badge>
        ) : (
          <span className="text-dim-grey truncate">{subtext || (done ? 'Complete' : 'Pending')}</span>
        )}
        <ArrowRight size={12} className="text-dim-grey group-hover:text-ocean group-hover:translate-x-0.5 transition-all" />
      </div>
    </Link>
  );
}
