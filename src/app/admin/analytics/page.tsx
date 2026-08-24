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

interface AnalyticsData {
  totalStudents: number;
  paymentStats: { verified: number; pending: number; percentage: number };
  profileStats: { complete: number; incomplete: number };
  assessmentStats: { assessed: number; pending: number };
  matchStats: { matched: number; pending: number };
  resultStats: { green: number; yellow: number; red: number };
  influencerBreakdown: Record<string, number>;
  applicationPipeline: Record<string, number>;
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
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

  const totalResults = data.resultStats.green + data.resultStats.yellow + data.resultStats.red;
  const greenPct = totalResults ? Math.round((data.resultStats.green / totalResults) * 100) : 0;
  const yellowPct = totalResults ? Math.round((data.resultStats.yellow / totalResults) * 100) : 0;
  const redPct = totalResults ? Math.round((data.resultStats.red / totalResults) * 100) : 0;

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
          value={data.totalStudents.toLocaleString()}
          color="ocean"
        />
        <StatCard
          icon={<CreditCard />}
          label="Payment Verified"
          value={`${data.paymentStats.percentage}%`}
          subtext={`${data.paymentStats.verified} / ${data.totalStudents}`}
          color="green"
        />
        <StatCard
          icon={<ClipboardCheck />}
          label="Assessed"
          value={`${data.assessmentStats.assessed}`}
          subtext={`${data.totalStudents - data.assessmentStats.assessed} pending`}
          color="gold"
        />
        <StatCard
          icon={<Target />}
          label="Matched"
          value={`${data.matchStats.matched}`}
          subtext={`${data.totalStudents - data.matchStats.matched} pending`}
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
              <span className="text-sm text-dim-grey">{data.resultStats.green} ({greenPct}%)</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-green rounded-full" style={{ width: `${greenPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-carbon">🟡 Yellow — Under Review</span>
              <span className="text-sm text-dim-grey">{data.resultStats.yellow} ({yellowPct}%)</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-gold rounded-full" style={{ width: `${yellowPct}%` }} />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-carbon">🔴 Red — Not Matched</span>
              <span className="text-sm text-dim-grey">{data.resultStats.red} ({redPct}%)</span>
            </div>
            <div className="progress-bar">
              <div className="h-full bg-red rounded-full" style={{ width: `${redPct}%` }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Application Pipeline */}
      {data.applicationPipeline && Object.keys(data.applicationPipeline).length > 0 && (
        <Card>
          <h3 className="font-semibold text-carbon mb-4">Application Pipeline</h3>
          <div className="flex items-center gap-2 flex-wrap">
            {Object.entries(data.applicationPipeline).map(([stage, count], i) => (
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
      {data.influencerBreakdown && Object.keys(data.influencerBreakdown).length > 0 && (
        <Card>
          <h3 className="font-semibold text-carbon mb-4">Student Sources</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(data.influencerBreakdown).map(([source, count]) => (
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
