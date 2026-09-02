'use client';

import { useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { Card, Button, Input, Select, Badge, LoadingSpinner } from '@/components/ui';
import { Mail, Send, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminEmailPage() {
  const [templateName, setTemplateName] = useState('application_reminder');
  const [filterType, setFilterType] = useState('all');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string; details?: any } | null>(null);

  const templates = [
    { value: 'application_reminder', label: '📢 Application Deadline Reminder' },
    { value: 'event_reminder', label: '📅 Fair Event Schedule & Breakout Links' },
    { value: 'match_ready', label: '🏛️ University Match Recommendations Ready' },
    { value: 'payment_reminder', label: '💳 500 ETB Registration Fee Reminder' },
  ];

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to dispatch this bulk email campaign?')) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await studentsAPI.bulkEmail({
        templateName,
        filter: filterType === 'all' ? {} : { 'application.stage': filterType },
      });
      setResult({
        success: true,
        message: res.data?.message || 'Bulk email campaign dispatched successfully!',
        details: res.data,
      });
    } catch (err: any) {
      setResult({
        success: false,
        message: err.response?.data?.message || 'Failed to dispatch email campaign.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="bg-white border border-charcoal/15 p-6 rounded-3xl shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant="blue" dot>Campaign Dispatcher</Badge>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-carbon tracking-tight">
          Bulk Email Announcements
        </h1>
        <p className="text-xs sm:text-sm text-dim-grey mt-0.5">
          Dispatch template-based transactional emails to segmented groups of registered applicants.
        </p>
      </div>

      {result && (
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3 ${
            result.success
              ? 'bg-green-bg border-green/30 text-green-text'
              : 'bg-red-bg border-red/30 text-red-text'
          }`}
        >
          {result.success ? <CheckCircle size={20} className="shrink-0 mt-0.5" /> : <AlertCircle size={20} className="shrink-0 mt-0.5" />}
          <div>
            <p className="font-bold text-sm">{result.message}</p>
            {result.details && (
              <p className="text-xs mt-1 opacity-90">
                Sent: {result.details.sent ?? result.details.total ?? 0} | Failed: {result.details.failed ?? 0}
              </p>
            )}
          </div>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSend} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dim-grey mb-1.5">
              Email Template
            </label>
            <Select
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              options={templates}
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-dim-grey mb-1.5">
              Target Audience Segment
            </label>
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Registered Students' },
                { value: 'Interested', label: 'Pipeline: Interested' },
                { value: 'Profile Pending', label: 'Pipeline: Profile Pending' },
                { value: 'Payment Pending', label: 'Pipeline: Payment Pending' },
                { value: 'Assessed', label: 'Pipeline: Assessed' },
                { value: 'Matched', label: 'Pipeline: Matched' },
              ]}
            />
          </div>

          <div className="bg-porcelain p-4 rounded-xl border border-charcoal/10 text-xs text-dim-grey space-y-1">
            <p className="font-semibold text-carbon">ℹ️ Campaign Safety Policy:</p>
            <p>• Emails are queued and delivered via Glory Brevo Transactional Service.</p>
            <p>• Each recipient receives a customized message with their personal Student ID and name.</p>
          </div>

          <div className="pt-2">
            <Button type="submit" variant="accent" loading={loading} className="w-full sm:w-auto font-bold">
              <Send size={16} /> Dispatch Campaign Now
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
