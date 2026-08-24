'use client';

import { useEffect, useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { GraduationCap, MapPin, BookOpen, BarChart3 } from 'lucide-react';

interface AssignedStudent {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  educationLevel: string;
  gpa: number;
  programInterest: string;
  countryPreference: string;
  englishProficiency: string;
  englishScore: number;
  assessment: {
    totalScore: number;
  };
  match: {
    decision: string;
  };
  representative: {
    status: string;
    comments: string;
  };
}

export default function AssignedPage() {
  const user = useAuthStore((s) => s.user);
  const [students, setStudents] = useState<AssignedStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studentsAPI
      .representativeAssigned()
      .then((res) => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [user]);

  if (loading) return <LoadingSpinner text="Loading assigned students..." />;

  if (students.length === 0) {
    return (
      <EmptyState
        icon={<GraduationCap />}
        title="No Assigned Students"
        description="Students matched to your university will appear here."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Assigned Students</h1>
        <p className="text-dim-grey text-sm mt-1">
          Students matched to your university • {students.length} total
        </p>
      </div>

      <div className="grid gap-4">
        {students.map((s) => (
          <Card key={s._id}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-ocean-light flex items-center justify-center text-ocean font-semibold text-sm">
                    {s.firstName?.[0]}{s.lastName?.[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-carbon">
                      {s.firstName} {s.lastName}
                    </p>
                    <p className="text-xs text-dim-grey">{s.studentId}</p>
                  </div>
                  {s.representative?.status && (
                    <Badge
                      variant={
                        s.representative.status === 'green'
                          ? 'green'
                          : s.representative.status === 'yellow'
                          ? 'yellow'
                          : 'red'
                      }
                    >
                      {s.representative.status === 'green'
                        ? '🟢 Eligible'
                        : s.representative.status === 'yellow'
                        ? '🟡 Review'
                        : '🔴 No Match'}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-1.5 text-dim-grey">
                    <BarChart3 size={14} className="text-ocean" />
                    GPA: <span className="font-medium text-carbon">{s.gpa}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-dim-grey">
                    <BookOpen size={14} className="text-ocean" />
                    {s.programInterest}
                  </div>
                  <div className="flex items-center gap-1.5 text-dim-grey">
                    <MapPin size={14} className="text-ocean" />
                    {s.countryPreference}
                  </div>
                  <div className="flex items-center gap-1.5 text-dim-grey">
                    📝 {s.englishProficiency}: <span className="font-medium text-carbon">{s.englishScore}</span>
                  </div>
                </div>

                {s.assessment?.totalScore && (
                  <div className="mt-2">
                    <span className="text-xs text-dim-grey">Score: </span>
                    <span className="text-sm font-bold text-ocean">{s.assessment.totalScore}/100</span>
                  </div>
                )}

                {s.representative?.comments && (
                  <div className="mt-2 bg-porcelain rounded-lg px-3 py-2">
                    <p className="text-xs text-dim-grey">Your comment:</p>
                    <p className="text-sm text-carbon">{s.representative.comments}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
