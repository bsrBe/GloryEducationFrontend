'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { GraduationCap, MapPin, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

interface ResultData {
  decision: string;
  status: string;
  primaryMatch?: string | null;
  secondaryMatch?: string | null;
  publishedAt: string;
  nextStep?: string;
  disclaimer?: string;
  totalScore?: number | null;
}

export default function ResultsPage() {
  const user = useAuthStore((s) => s.user);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    Promise.all([
      studentsAPI.getResult(user._id).catch(() => null),
      studentsAPI.getDashboard().catch(() => null),
    ])
      .then(([resResult, resDashboard]) => {
        const r = resResult?.data;
        const d = resDashboard?.data;

        if (r?.result?.isPublished || d?.resultPublished) {
          const rawStatus = r?.result?.status || d?.result?.status || d?.representativeDecision || 'Green';
          setResult({
            decision: rawStatus.toLowerCase(),
            status: rawStatus,
            primaryMatch: d?.primaryMatch || 'Matched Institution',
            secondaryMatch: d?.secondaryMatch,
            publishedAt: r?.result?.publishedAt || new Date().toISOString(),
            nextStep: r?.result?.nextStep || d?.result?.nextStep || 'Application recommended — start your application now!',
            disclaimer: r?.result?.disclaimer || d?.result?.disclaimer || 'This is a preliminary eligibility assessment.',
            totalScore: d?.assessmentScore,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading results..." />;

  if (!result) {
    return (
      <EmptyState
        icon={<GraduationCap />}
        title="Assessment in Progress"
        description="Your profile is currently undergoing academic screening and university review. Check back soon for your personalized results!"
      />
    );
  }

  const decisionConfig: Record<string, { bg: string; border: string; text: string; label: string; message: string; defaultNextStep: string }> = {
    green: {
      bg: 'bg-green-bg',
      border: 'border-green',
      text: 'text-green-text',
      label: '🟢 ELIGIBLE TO APPLY',
      message: 'Your profile meets the preliminary criteria for this institution.',
      defaultNextStep: 'Application recommended — start your application now!',
    },
    yellow: {
      bg: 'bg-gold-light',
      border: 'border-gold',
      text: 'text-yellow-text',
      label: '🟡 FURTHER REVIEW REQUIRED',
      message: 'Your profile has potential. Additional documents or clarification are recommended.',
      defaultNextStep: 'Attend the Glory Application Clinic for personalized guidance.',
    },
    red: {
      bg: 'bg-red-bg',
      border: 'border-red',
      text: 'text-red-text',
      label: '🔴 NOT CURRENTLY MATCHED',
      message: 'Your current profile does not match our participating partner requirements.',
      defaultNextStep: 'Explore alternative pathways, Foundation years, or language score improvements.',
    },
  };

  const config = decisionConfig[result.decision] || decisionConfig.green;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header Card */}
      <div className={`rounded-xl ${config.bg} border ${config.border} p-6 text-center`}>
        <p className="text-sm text-dim-grey mb-1">Glory International Admissions Fair</p>
        <h1 className="text-xl font-semibold text-carbon">Assessment Result</h1>
        <p className="text-sm text-dim-grey mt-1">
          {user?.studentId} — {user?.firstName} {user?.lastName}
        </p>
        <p className="text-xs text-dim-grey mt-1">
          Published: {new Date(result.publishedAt).toLocaleDateString()}
        </p>
      </div>

      {/* Match Card */}
      <Card>
        <p className="text-xs text-dim-grey uppercase tracking-wide mb-2">Primary Match</p>
        <div className="border-l-4 border-ocean pl-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap size={20} className="text-ocean" />
            <h3 className="text-lg font-bold text-carbon">
              {result.primaryMatch || 'Matched Partner Institution'}
            </h3>
          </div>
        </div>

        {result.secondaryMatch && (
          <div className="border-l-4 border-pale-sky pl-4 py-2 mt-4">
            <p className="text-xs text-dim-grey mb-1">Secondary Match (Alternative)</p>
            <h4 className="font-semibold text-carbon">{result.secondaryMatch}</h4>
          </div>
        )}
      </Card>

      {/* Decision */}
      <div className={`rounded-xl ${config.bg} border ${config.border} p-6`}>
        <h2 className={`text-xl font-bold ${config.text} text-center`}>
          {config.label}
        </h2>
        <p className="text-sm text-carbon text-center mt-2">{config.message}</p>
        <p className="text-sm font-medium text-carbon text-center mt-3">
          Next Step: {result.nextStep || config.defaultNextStep}
        </p>
      </div>

      {/* Disclaimer */}
      <div className="bg-pale-sky/30 border border-pale-sky rounded-lg p-4">
        <div className="flex items-start gap-2">
          <AlertCircle size={16} className="text-dim-grey mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-xs text-dim-grey">
              <strong>Disclaimer:</strong> This is a preliminary assessment. Final admission
              depends on the institution&apos;s official application process and their own
              evaluation criteria.
            </p>
          </div>
        </div>
      </div>

      {/* Action */}
      {result.decision === 'green' && (
        <div className="text-center">
          <Button size="lg">
            Start Application <ExternalLink size={16} />
          </Button>
        </div>
      )}
    </div>
  );
}
