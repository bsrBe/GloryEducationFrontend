'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Button, LoadingSpinner, EmptyState, Badge, Logo } from '@/components/ui';
import { GraduationCap, Award, ArrowRight, ShieldCheck } from 'lucide-react';

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
            primaryMatch: d?.primaryMatch || r?.result?.primaryMatch || 'Matched Institution',
            secondaryMatch: d?.secondaryMatch || r?.result?.secondaryMatch,
            publishedAt: r?.result?.publishedAt || new Date().toISOString(),
            nextStep: r?.result?.nextStep || d?.result?.nextStep || 'Application recommended — proceed with official document submission.',
            disclaimer: r?.result?.disclaimer || d?.result?.disclaimer || 'This is an official preliminary eligibility assessment issued by Glory Edu and partner institutions.',
            totalScore: d?.assessmentScore,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading your official decision report..." />;

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <EmptyState
          icon={<GraduationCap size={32} className="text-ocean" />}
          title="Assessment Under Evaluation"
          description="Your credentials are being reviewed by Glory evaluators and partner university representatives. Once complete, your official Green, Yellow, or Red match decision will appear here."
        />
      </div>
    );
  }

  const decisionConfig: Record<
    string,
    { bg: string; border: string; text: string; badge: string; label: string; message: string; defaultNextStep: string }
  > = {
    green: {
      bg: 'bg-green-bg/60',
      border: 'border-green',
      text: 'text-green-text',
      badge: 'bg-green text-white',
      label: 'ELIGIBLE TO APPLY (GREEN)',
      message: 'Your academic profile meets the core qualification benchmarks for this institution.',
      defaultNextStep: 'Application recommended — proceed with official document submission.',
    },
    yellow: {
      bg: 'bg-gold-light/60',
      border: 'border-gold',
      text: 'text-yellow-text',
      badge: 'bg-gold-dark text-white',
      label: 'FURTHER REVIEW REQUIRED (YELLOW)',
      message: 'Your profile has solid potential. Additional transcripts, test scores, or advisor consultation are recommended.',
      defaultNextStep: 'Attend the Glory Application Clinic for tailored guidance.',
    },
    red: {
      bg: 'bg-red-bg/60',
      border: 'border-red',
      text: 'text-red-text',
      badge: 'bg-red text-white',
      label: 'NOT CURRENTLY MATCHED (RED)',
      message: 'Your profile does not currently meet direct entry thresholds for this specific tier.',
      defaultNextStep: 'Explore Foundation pathways, language programs, or alternative university tiers.',
    },
  };

  const config = decisionConfig[result.decision] || decisionConfig.green;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Official Certificate Card */}
      <div className="bg-white border-2 border-charcoal/20 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        {/* Corner Decors */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-gold/20 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-ocean/10 to-transparent pointer-events-none" />

        {/* Certificate Header */}
        <div className="text-center pb-6 border-b border-charcoal/15">
          <div className="flex justify-center mb-3">
            <Logo size="lg" subtitle="Official Admissions Evaluation" priority />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-black mt-2">
            Official Evaluation Decision
          </h1>
          <p className="text-xs sm:text-sm text-dim-grey mt-1">
            Candidate: <span className="font-bold text-carbon">{user?.firstName} {user?.lastName}</span> • ID:{' '}
            <span className="font-mono font-bold text-gold-dark">{user?.studentId || 'GH26-PENDING'}</span>
          </p>
          <p className="text-[11px] text-dim-grey mt-0.5">
            Issued On: {new Date(result.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Primary Match Section */}
        <div className="py-6 border-b border-charcoal/15">
          <p className="text-xs font-bold uppercase tracking-wider text-ocean mb-2">
            🏛️ Primary Institutional Match
          </p>
          <div className="bg-porcelain rounded-2xl p-5 border border-ocean/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-carbon">
                {result.primaryMatch || 'Matched Institution'}
              </h3>
              <p className="text-xs text-dim-grey mt-1 flex items-center gap-2">
                <span>Degree: Bachelor / Master</span>
                <span>•</span>
                <span className="text-ocean font-semibold">Priority Track</span>
              </p>
            </div>
            {result.totalScore && (
              <div className="text-right shrink-0">
                <span className="text-xs text-dim-grey">Score:</span>
                <p className="text-2xl font-black text-ocean">{result.totalScore}/100</p>
              </div>
            )}
          </div>

          {result.secondaryMatch && (
            <div className="mt-3 bg-white rounded-xl p-3 border border-charcoal/15 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-dim-grey uppercase">Secondary Match:</span>
                <p className="text-xs font-semibold text-carbon">{result.secondaryMatch}</p>
              </div>
              <Badge variant="grey" className="text-[10px]">Alternative</Badge>
            </div>
          )}
        </div>

        {/* Decision Banner */}
        <div className={`mt-6 rounded-2xl ${config.bg} border-2 ${config.border} p-6 text-center`}>
          <span className={`inline-block text-xs font-black px-3 py-1 rounded-full ${config.badge} uppercase tracking-wider mb-2`}>
            {config.label}
          </span>
          <p className="text-sm sm:text-base font-semibold text-carbon max-w-lg mx-auto">
            {config.message}
          </p>
          <div className="mt-4 pt-3 border-t border-black/10 text-xs sm:text-sm font-bold text-carbon">
            <span className="text-dim-grey font-medium">Recommended Next Step: </span>
            {result.nextStep || config.defaultNextStep}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 bg-pale-sky/20 border border-pale-sky/40 rounded-xl p-4 flex items-start gap-3 text-xs text-dim-grey">
          <ShieldCheck size={18} className="text-ocean shrink-0 mt-0.5" />
          <p>
            <strong>Disclaimer:</strong> This assessment is an institutional qualification indicator prepared by Glory Educational Consultancy based on submitted transcripts and English proficiency data. Formal acceptance is subject to final university credential review.
          </p>
        </div>

        {/* Action Button */}
        {result.decision === 'green' && (
          <div className="mt-8 text-center">
            <Button size="lg" className="shadow-glow-ocean text-base font-bold">
              Proceed to University Application <ArrowRight size={18} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
