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
  gpa: number;
  programInterest: string;
  countryPreference: string;
  englishScore: number;
  assessment: { totalScore: number };
  match: { decision: string };
  representative?: { status: string; comments: string };
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
        setStudents(res.data);
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
        decision: review.status,
        comments: review.comments || '',
      });
      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId
            ? { ...s, representative: { status: review.status, comments: review.comments || '' } }
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
          Review students matched to your university • {students.length} pending
        </p>
      </div>

      {students.map((s) => {
        const reviewed = !!s.representative?.status;
        const currentReview = reviews[s._id] || {};

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
                        s.representative!.status === 'green'
                          ? 'green'
                          : s.representative!.status === 'yellow'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      <CheckCircle size={10} /> Reviewed
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-3 text-sm text-dim-grey mb-4">
                  <span>GPA: {s.gpa}</span>
                  <span>•</span>
                  <span>{s.programInterest}</span>
                  <span>•</span>
                  <span>{s.countryPreference}</span>
                  <span>•</span>
                  <span>Score: {s.assessment?.totalScore}/100</span>
                </div>

                {!reviewed ? (
                  <div className="space-y-3">
                    <div className="flex gap-3">
                      {(['green', 'yellow', 'red'] as const).map((color) => (
                        <button
                          key={color}
                          onClick={() => updateReview(s._id, 'status', color)}
                          className={clsx(
                            'flex-1 py-3 rounded-lg border-2 font-semibold text-sm transition-all text-center',
                            currentReview.status === color
                              ? color === 'green'
                                ? 'border-green bg-green-bg text-green-text'
                                : color === 'yellow'
                                ? 'border-gold bg-gold-light text-yellow-text'
                                : 'border-red bg-red-bg text-red-text'
                              : 'border-charcoal/20 text-dim-grey hover:border-charcoal/40'
                          )}
                        >
                          {color === 'green' ? '🟢 Eligible' : color === 'yellow' ? '🟡 Review' : '🔴 No Match'}
                        </button>
                      ))}
                    </div>

                    <Input
                      placeholder="Comments (optional)"
                      value={currentReview.comments || ''}
                      onChange={(e) => updateReview(s._id, 'comments', e.target.value)}
                    />

                    <Button
                      size="sm"
                      disabled={!currentReview.status}
                      onClick={() => handleReview(s._id)}
                      loading={reviewing === s._id}
                    >
                      Submit Review
                    </Button>
                  </div>
                ) : (
                  <div className="bg-porcelain rounded-lg px-4 py-3">
                    <p className="text-sm text-dim-grey">
                      Your review: <span className="font-medium text-carbon capitalize">{s.representative!.status}</span>
                    </p>
                    {s.representative!.comments && (
                      <p className="text-sm text-carbon mt-1">{s.representative!.comments}</p>
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
