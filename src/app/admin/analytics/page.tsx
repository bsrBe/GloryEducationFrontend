'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { Card, StatCard, Button, LoadingSpinner, ErrorState } from '@/components/ui';
import {
  Users,
  CreditCard,
  ClipboardCheck,
  Target,
  Download,
  Mail,
  BarChart3,
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
  // Fallbacks for draft mocks
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
      a.download = 'students-export.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      // error
    }
  };

  if (loading) return <LoadingSpinner text="Loading analytics..." />;
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Analytics Dashboard</h1>
          <p className="text-dim-grey text-sm mt-1">Glory International Admissions Fair 2026</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" size="sm" onClick={handleExport}>
            <Download size={14} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users />}
          label="Total Students"
          value={total.toLocaleString()}
          color="ocean"
        />
        <StatCard
          icon={<CreditCard />}
          label="Payment Verified"
          value={`${paidPct}%`}
          subtext={`${paid} / ${total} students`}
          color="green"
        />
        <StatCard
          icon={<ClipboardCheck />}
          label="Assessed"
          value={`${assessed}`}
          subtext={`${Math.max(0, total - assessed)} pending`}
          color="gold"
        />
        <StatCard
          icon={<Target />}
          label="Matches Approved"
          value={`${matched}`}
          subtext={`${Math.max(0, total - matched)} pending`}
          color="ocean"
        />
      </div>

      {/* Results Breakdown */}
      <Card>
        <h3 className="font-semibold text-carbon mb-4 flex items-center gap-2">
          <BarChart3 size={18} className="text-ocean" /> Results Breakdown
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-carbon">🟢 Green — Eligible</span>
              <span className="text-sm text-dim-grey">{greenCount} ({greenPct}%)</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-green rounded-full" style={{ width: `${greenPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-carbon">🟡 Yellow — Under Review</span>
              <span className="text-sm text-dim-grey">{yellowCount} ({yellowPct}%)</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-gold rounded-full" style={{ width: `${yellowPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-carbon">🔴 Red — Not Matched</span>
              <span className="text-sm text-dim-grey">{redCount} ({redPct}%)</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-red rounded-full" style={{ width: `${redPct}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Application Pipeline */}
      {pipeline && Object.keys(pipeline).length > 0 && (
        <Card>
          <h3 className="font-semibold text-carbon mb-4">Application Pipeline</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(pipeline).map(([stage, count], i) => (
              <div key={stage} className="flex items-center gap-2">
                {i > 0 && <span className="text-dim-grey">→</span>}
                <div className="bg-porcelain rounded-lg px-3 py-2 text-center">
                  <p className="text-xs text-dim-grey capitalize">{stage.replace(/_/g, ' ')}</p>
                  <p className="font-bold text-carbon">{count as number}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Influencer Sources */}
      {sources && Object.keys(sources).length > 0 && (
        <Card>
          <h3 className="font-semibold text-carbon mb-4">Student Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(sources).map(([source, count]) => (
              <div key={source} className="bg-porcelain rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-ocean">{count as number}</p>
                <p className="text-xs text-dim-grey capitalize">{source}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
