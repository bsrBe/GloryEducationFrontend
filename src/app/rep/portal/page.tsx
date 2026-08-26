'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge, LoadingSpinner, EmptyState, Input } from '@/components/ui';
import { ClipboardCheck, CheckCircle } from 'lucide-react';
import clsx from 'clsx';

interface Student {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  gpa?: number;
  intendedProgram?: string;
  programInterest?: string;
  preferredCountry?: string;
  countryPreference?: string;
  englishTest?: string;
  englishScore?: number;
  assessment?: { totalScore: number };
  matches?: { primary?: { program?: string; reason?: string } };
  representativeReview?: { decision?: string; comments?: string; isLocked?: boolean };
  representative?: { status?: string; comments?: string };
  documents?: Array<{ fileName?: string; cloudinaryUrl?: string }>;
}

export default function PortalPage() {
  const user = useAuthStore((s) => s.user);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Record<string, { status: string; comments: string }>>({});

  useEffect(() => {
    studentsAPI
      .representativeAssigned()
      .then((res) => {
        setStudents(res.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user]);

  const handleReview = async (studentId: string) => {
    const review = reviews[studentId];
    if (!review?.status) return;

    setReviewing(studentId);
    try {
      await studentsAPI.review(studentId, {
        decision: review.status, // 'Green', 'Yellow', or 'Red'
        comments: review.comments || '',
      });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId
            ? {
                ...s,
                representativeReview: {
                  decision: review.status,
                  comments: review.comments || '',
                  isLocked: true,
                },
              }
            : s
        )
      );
    } catch {
      // error
    } finally {
      setReviewing(null);
    }
  };

  const updateReview = (id: string, field: string, value: string) => {
    setReviews((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  if (loading) return <LoadingSpinner text="Loading students..." />;

  if (students.length === 0) {
    return (
      <EmptyState
        icon={<ClipboardCheck />}
        title="No Students to Review"
        description="Students matched to your university will appear here for your review."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Review Portal</h1>
        <p className="text-dim-grey text-sm mt-1">
          Review students matched to your university • {students.length} assigned
        </p>
      </div>

      {students.map((s) => {
        const repDecision = s.representativeReview?.decision || s.representative?.status;
        const reviewed = !!repDecision;
        const currentReview = reviews[s._id] || {};
        const program = s.intendedProgram || s.programInterest || s.matches?.primary?.program || 'General Program';
        const country = s.preferredCountry || s.countryPreference || 'International';
        const docUrl = s.documents?.[0]?.cloudinaryUrl;

        return (
          <Card key={s._id} className={reviewed ? 'border-green/30' : ''}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-ocean-light flex items-center justify-center text-ocean font-bold text-sm flex-shrink-0">
                {s.firstName?.[0]}{s.lastName?.[0]}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-carbon">
                    {s.firstName} {s.lastName}
                  </p>
                  <span className="text-xs text-dim-grey">{s.studentId}</span>
                  {reviewed && (
                    <Badge
                      variant={
                        repDecision.toLowerCase() === 'green'
                          ? 'green'
                          : repDecision.toLowerCase() === 'yellow'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      <CheckCircle size={10} /> {repDecision}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-dim-grey mb-3">
                  <span>GPA: {s.gpa ?? 'N/A'}</span>
                  <span>•</span>
                  <span>{program}</span>
                  <span>•</span>
                  <span>{country}</span>
                  <span>•</span>
                  <span>Score: {s.assessment?.totalScore ?? 'Pending'}/100</span>
                  {docUrl && (
                    <>
                      <span>•</span>
                      <a href={docUrl} target="_blank" rel="noreferrer" className="text-ocean font-medium hover:underline">
                        View Academic PDF ↗
                      </a>
                    </>
                  )}
                </div>

                {!reviewed ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {[
                        { key: 'Green', label: '🟢 Eligible' },
                        { key: 'Yellow', label: '🟡 Review' },
                        { key: 'Red', label: '🔴 No Match' },
                      ].map(({ key, label }) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => updateReview(s._id, 'status', key)}
                          className={clsx(
                            'flex-1 py-3 rounded-lg border-2 font-semibold text-sm transition-all text-center',
                            currentReview.status === key
                              ? key === 'Green'
                                ? 'border-green bg-green-bg text-green-text'
                                : key === 'Yellow'
                                ? 'border-gold bg-gold-light text-yellow-text'
                                : 'border-red bg-red-bg text-red-text'
                              : 'border-charcoal/20 text-dim-grey hover:border-charcoal/40'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <Input
                      placeholder="Representative comments (optional)"
                      value={currentReview.comments || ''}
                      onChange={(e) => updateReview(s._id, 'comments', e.target.value)}
                    />

                    <Button
                      size="sm"
                      disabled={!currentReview.status}
                      onClick={() => handleReview(s._id)}
                      loading={reviewing === s._id}
                    >
                      Submit Decision
                    </Button>
                  </div>
                ) : (
                  <div className="bg-porcelain rounded-lg px-4 py-3">
                    <p className="text-sm text-dim-grey">
                      Decision: <span className="font-semibold text-carbon">{repDecision}</span>
                    </p>
                    {(s.representativeReview?.comments || s.representative?.comments) && (
                      <p className="text-sm text-carbon mt-1">
                        {s.representativeReview?.comments || s.representative?.comments}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
