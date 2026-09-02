'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { Card, StatCard, Button, LoadingSpinner, ErrorState, Badge } from '@/components/ui';
import {
  Users,
  CreditCard,
  ClipboardCheck,
  Target,
  Download,
  BarChart3,
  TrendingUp,
  Layers,
} from 'lucide-react';

interface RawAnalytics {
  totalStudents?: number;
  paidStudents?: number;
  assessedStudents?: number;
  matchedStudents?: number;
  reviewedStudents?: number;
  representativeReviews?: { green?: number; yellow?: number; red?: number };
  publishedResults?: number;
  applicationStages?: Record<string, number>;
  influencerSources?: Record<string, number>;
  paymentStats?: { verified: number; pending: number; percentage: number };
  resultStats?: { green: number; yellow: number; red: number };
  influencerBreakdown?: Record<string, number>;
  applicationPipeline?: Record<string, number>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<RawAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentsAPI
      .analytics()
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load analytics');
        setLoading(false);
      });
  }, []);

  const handleExport = async () => {
    try {
      const res = await studentsAPI.exportCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = `glory-students-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // error
    }
  };

  if (loading) return <LoadingSpinner text="Aggregating live admissions telemetry..." />;
  if (error) return <ErrorState message={error} />;
  if (!data) return null;

  const total = data.totalStudents || 0;
  const paid = data.paidStudents ?? data.paymentStats?.verified ?? 0;
  const paidPct = total ? Math.round((paid / total) * 100) : 0;
  const assessed = data.assessedStudents || 0;
  const matched = data.matchedStudents || 0;

  const greenCount = data.representativeReviews?.green ?? data.resultStats?.green ?? 0;
  const yellowCount = data.representativeReviews?.yellow ?? data.resultStats?.yellow ?? 0;
  const redCount = data.representativeReviews?.red ?? data.resultStats?.red ?? 0;

  const totalResults = greenCount + yellowCount + redCount;
  const greenPct = totalResults ? Math.round((greenCount / totalResults) * 100) : 0;
  const yellowPct = totalResults ? Math.round((yellowCount / totalResults) * 100) : 0;
  const redPct = totalResults ? Math.round((redCount / totalResults) * 100) : 0;

  const pipeline = data.applicationStages || data.applicationPipeline || {};
  const sources = data.influencerSources || data.influencerBreakdown || {};

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-charcoal/15 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue" dot>Live Telemetry</Badge>
            <span className="text-xs text-dim-grey">Fair Date: Sept 15, 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-carbon tracking-tight">
            Admissions Analytics & CRM
          </h1>
          <p className="text-xs sm:text-sm text-dim-grey mt-0.5">
            Real-time funnel conversion, 100-point scoring metrics, and university matches.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport} className="shadow-xs font-semibold">
            <Download size={15} /> Export CSV Dataset
          </Button>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users size={22} />}
          label="Registered Applicants"
          value={total.toLocaleString()}
          subtext="Total student accounts"
          color="ocean"
        />
        <StatCard
          icon={<CreditCard size={22} />}
          label="500 ETB Verified"
          value={`${paidPct}%`}
          subtext={`${paid} of ${total} verified`}
          color="green"
        />
        <StatCard
          icon={<ClipboardCheck size={22} />}
          label="Scored & Assessed"
          value={`${assessed}`}
          subtext={`${Math.max(0, total - assessed)} pending review`}
          color="gold"
        />
        <StatCard
          icon={<Target size={22} />}
          label="University Matches"
          value={`${matched}`}
          subtext={`${Math.max(0, total - matched)} awaiting match`}
          color="ocean"
        />
      </div>

      {/* Results Breakdown & Pipeline Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Results Breakdown */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-carbon flex items-center gap-2">
              <BarChart3 size={18} className="text-ocean" /> Admissions Decision Ratio
            </h3>
            <span className="text-xs font-semibold text-dim-grey">{totalResults} Evaluated</span>
          </div>

          <div className="space-y-4">
            <div className="bg-green/5 border border-green/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-green-text flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green inline-block" />
                  🟢 Green — Direct Application Recommended
                </span>
                <span className="text-xs font-bold text-carbon">{greenCount} ({greenPct}%)</span>
              </div>
              <div className="progress-bar h-2 bg-green/20">
                <div className="h-full bg-green rounded-full transition-all duration-500" style={{ width: `${greenPct}%` }} />
              </div>
            </div>

            <div className="bg-gold/10 border border-gold/30 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-yellow-text flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-dark inline-block" />
                  🟡 Yellow — Conditional Review Required
                </span>
                <span className="text-xs font-bold text-carbon">{yellowCount} ({yellowPct}%)</span>
              </div>
              <div className="progress-bar h-2 bg-gold/30">
                <div className="h-full bg-gold-dark rounded-full transition-all duration-500" style={{ width: `${yellowPct}%` }} />
              </div>
            </div>

            <div className="bg-red/5 border border-red/20 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-red-text flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red inline-block" />
                  🔴 Red — Foundation / Alternative Tier
                </span>
                <span className="text-xs font-bold text-carbon">{redCount} ({redPct}%)</span>
              </div>
              <div className="progress-bar h-2 bg-red/20">
                <div className="h-full bg-red rounded-full transition-all duration-500" style={{ width: `${redPct}%` }} />
              </div>
            </div>
          </div>
        </Card>

        {/* Application Stage Flow */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-base text-carbon flex items-center gap-2">
              <Layers size={18} className="text-gold-dark" /> Student Conversion Pipeline
            </h3>
            <Badge variant="blue" className="text-[11px]">Funnel</Badge>
          </div>

          <div className="space-y-2.5">
            {Object.entries(pipeline).length > 0 ? (
              Object.entries(pipeline).map(([stage, count], i) => (
                <div
                  key={stage}
                  className="flex items-center justify-between p-3 rounded-xl bg-porcelain border border-charcoal/15 hover:border-ocean/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-white border border-charcoal/20 text-xs font-bold flex items-center justify-center text-dim-grey">
                      0{i + 1}
                    </span>
                    <span className="text-xs font-bold text-carbon capitalize">
                      {stage.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold text-ocean bg-ocean/10 px-2 py-0.5 rounded-md">
                    {count as number} students
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-xs text-dim-grey">
                No pipeline records yet. Students will appear here as they register and advance.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Influencer & Referral Attribution */}
      {sources && Object.keys(sources).length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-carbon flex items-center gap-2">
              <TrendingUp size={18} className="text-green" /> Marketing Channel Attribution
            </h3>
            <span className="text-xs text-dim-grey">Telegram, TikTok & Organic</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {Object.entries(sources).map(([source, count]) => (
              <div
                key={source}
                className="bg-porcelain border border-charcoal/15 rounded-2xl p-4 text-center card-hoverable transition-all"
              >
                <p className="text-2xl font-black text-carbon">{count as number}</p>
                <p className="text-xs font-semibold text-ocean capitalize mt-1 truncate">{source}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
