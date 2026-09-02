'use client';

import { useEffect, useState, useCallback } from 'react';
import { auditAPI } from '@/lib/api';
import { Card, Button, Input, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { ShieldCheck, Search, Clock, User, FileText, RefreshCw } from 'lucide-react';

interface AuditLog {
  _id: string;
  action: string;
  studentId?: string;
  user?: {
    _id: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
  };
  details?: Record<string, any>;
  timestamp: string;
  createdAt?: string;
}

export default function AdminAuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchStudentId, setSearchStudentId] = useState('');
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const loadLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 30 };
      if (searchStudentId.trim()) {
        params.studentId = searchStudentId.trim();
      }
      const res = await auditAPI.list(params);
      const data = res.data;
      if (Array.isArray(data)) {
        setLogs(data);
        setTotal(data.length);
      } else if (data?.logs) {
        setLogs(data.logs);
        setTotal(data.total || data.logs.length);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [searchStudentId, page]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  const formatActionBadge = (action: string) => {
    const act = (action || '').toUpperCase();
    if (act.includes('DELETE')) return <Badge variant="red">{action}</Badge>;
    if (act.includes('POST') || act.includes('CREATE')) return <Badge variant="green">{action}</Badge>;
    if (act.includes('PATCH') || act.includes('UPDATE')) return <Badge variant="yellow">{action}</Badge>;
    return <Badge variant="blue">{action}</Badge>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-charcoal/15 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="blue" dot>System Security</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-carbon tracking-tight">
            System Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-dim-grey mt-0.5">
            Immutable activity log recording all administrative modifications, scoring updates, and payment reviews.
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={loadLogs} className="shadow-xs font-semibold">
          <RefreshCw size={15} /> Refresh Feed
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setPage(1);
            loadLogs();
          }}
          className="flex gap-3"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim-grey" />
            <input
              type="text"
              placeholder="Search by Student ID (e.g. GH26-000001)..."
              value={searchStudentId}
              onChange={(e) => setSearchStudentId(e.target.value)}
              className="glory-input pl-10 text-sm"
            />
          </div>
          <Button type="submit" variant="primary" size="sm">
            Filter Logs
          </Button>
          {searchStudentId && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => {
                setSearchStudentId('');
                setPage(1);
              }}
            >
              Clear
            </Button>
          )}
        </form>
      </Card>

      {/* Logs Table */}
      {loading ? (
        <LoadingSpinner text="Retrieving cryptographic audit logs..." />
      ) : logs.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck />}
          title="No Audit Records Found"
          description="Administrative mutations and scoring events will be recorded here automatically."
        />
      ) : (
        <Card padding={false}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-porcelain border-b border-charcoal/10 text-dim-grey font-medium text-xs">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Student</th>
                  <th className="py-3 px-4">Performed By</th>
                  <th className="py-3 px-4">Payload Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/10">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-porcelain/60 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-dim-grey">
                      <div className="flex items-center gap-1.5 font-mono">
                        <Clock size={13} className="text-ocean" />
                        {new Date(log.timestamp || log.createdAt || Date.now()).toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {formatActionBadge(log.action)}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono font-medium text-xs text-carbon">
                      {log.studentId || '—'}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-xs">
                      {log.user ? (
                        <div className="flex items-center gap-1.5">
                          <User size={13} className="text-dim-grey" />
                          <span className="font-semibold text-carbon">
                            {log.user.firstName} {log.user.lastName}
                          </span>
                          <span className="text-dim-grey">({log.user.role || 'staff'})</span>
                        </div>
                      ) : (
                        <span className="text-dim-grey italic">System Service</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs font-mono max-w-xs truncate text-dim-grey">
                      {log.details ? (
                        <span title={JSON.stringify(log.details, null, 2)}>
                          {JSON.stringify(log.details)}
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
