'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { GraduationCap, MapPin, BookOpen, AlertCircle, ExternalLink } from 'lucide-react';

interface ResultData {
  decision: string;
  primaryMatch: {
    name: string;
    country: string;
    programs: string[];
  };
  secondaryMatch: {
    name: string;
    country: string;
  };
  publishedAt: string;
  assessedBy: string;
  totalScore: number;
  feedback: string;
}

export default function ResultsPage() {
  const user = useAuthStore((s) => s.user);
  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    studentsAPI
      .getResult(user._id)
      .then((res) => {
        setResult(res.data);
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
        title="No Results Yet"
        description="Your results will be published after the assessment and review process. Check back later!"
      />
    );
  }

  const decisionConfig = {
    green: {
      bg: 'bg-green-bg',
      border: 'border-green',
      text: 'text-green-text',
      label: '🟢 ELIGIBLE TO APPLY',
      message: 'Your profile meets the preliminary criteria for this institution.',
      nextStep: 'Application recommended — start your application now!',
    },
    yellow: {
      bg: 'bg-gold-light',
      border: 'border-gold',
      text: 'text-yellow-text',
      label: '🟡 UNDER REVIEW',
      message: 'Your profile is being reviewed. You may need additional documents.',
      nextStep: 'Wait for further instructions from the admissions team.',
    },
    red: {
      bg: 'bg-red-bg',
      border: 'border-red',
      text: 'text-red-text',
      label: '🔴 NOT MATCHED',
      message: 'Unfortunately, your profile does not currently meet the criteria.',
      nextStep: 'Consider improving your qualifications and reapplying next year.',
    },
  };

  const config = decisionConfig[result.decision as keyof typeof decisionConfig];

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
              {result.primaryMatch.name}
            </h3>
          </div>
          <div className="flex items-center gap-4 text-sm text-dim-grey">
            <span className="flex items-center gap-1">
              <BookOpen size={14} /> {result.primaryMatch.programs.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {result.primaryMatch.country}
            </span>
          </div>
        </div>

        {result.secondaryMatch && (
          <div className="border-l-4 border-pale-sky pl-4 py-2 mt-4">
            <p className="text-xs text-dim-grey mb-1">Secondary Match</p>
            <h4 className="font-semibold text-carbon">{result.secondaryMatch.name}</h4>
            <p className="text-sm text-dim-grey">{result.secondaryMatch.country}</p>
          </div>
        )}
      </Card>

      {/* Score */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-dim-grey">Assessment Score</p>
            <p className="text-3xl font-bold text-ocean">{result.totalScore}/100</p>
          </div>
          {result.feedback && (
            <p className="text-sm text-dim-grey max-w-xs text-right">{result.feedback}</p>
          )}
        </div>
      </Card>

      {/* Decision */}
      <div className={`rounded-xl ${config.bg} border ${config.border} p-6`}>
        <h2 className={`text-xl font-bold ${config.text} text-center`}>
          {config.label}
        </h2>
        <p className="text-sm text-carbon text-center mt-2">{config.message}</p>
        <p className="text-sm font-medium text-carbon text-center mt-3">
          Next Step: {config.nextStep}
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
