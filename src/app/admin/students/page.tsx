'use client';

import { useEffect, useState, useCallback } from 'react';
import { studentsAPI, universitiesAPI } from '@/lib/api';
import { MatchOverride, type MatchableUniversity } from '@/components/admin/MatchOverride';
import { usePolling } from '@/lib/usePolling';
// [G/Y/R disabled] Input, Select were only used by the Publish Result panel; [Payment disabled] Badge by the payment UI
import { Card, Button, /* Input, Select, Badge, */ LoadingSpinner, EmptyState } from '@/components/ui';
import {
  GraduationCap, Search, CheckCircle, XCircle, FileText,
  Sparkles, X, ExternalLink, RefreshCw
} from 'lucide-react';
import clsx from 'clsx';

interface StudentListItem {
  _id: string;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country?: string;
  dateOfBirth?: string;
  gender?: string;
  educationLevel?: string;
  school?: string;
  gpa?: number;
  graduationYear?: number;
  intendedProgram?: string;
  preferredCountry?: string;
  englishTest?: string;
  englishScore?: number;
  profileComplete?: number;
  payments?: Array<{
    method: string;
    transactionRef: string;
    amount: number;
    status: string;
    date: string;
  }>;
  documents?: Array<{
    fileName: string;
    cloudinaryUrl: string;
    fileSize: number;
    reviewStatus: string;
  }>;
  assessment?: {
    categoryScores?: Record<string, number>;
    totalScore: number;
    override?: { score: number; reason: string };
  };
  matches?: {
    primary?: { university: string; program: string; reason: string };
    secondary?: { university: string; program: string; reason: string };
    status?: string;
    overridden?: boolean;
    overrideReason?: string;
  };
  representativeReview?: {
    decision?: string;
    comments?: string;
    isLocked?: boolean;
  };
  result?: {
    status?: string;
    nextStep?: string;
    isPublished?: boolean;
  };
  application?: {
    stage?: string;
  };
  createdAt?: string;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentListItem | null>(null);
  // const [paymentLoading, setPaymentLoading] = useState(false); // [Payment disabled]
  const [assessmentLoading, setAssessmentLoading] = useState(false);
  const [matchLoading, setMatchLoading] = useState(false);
  // const [resultLoading, setResultLoading] = useState(false); // [G/Y/R disabled]
  const [crmLoading, setCrmLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Scoring form state
  const [academicScore, setAcademicScore] = useState(25);
  const [englishScore, setEnglishScore] = useState(15);
  const [programFitScore, setProgramFitScore] = useState(12);
  const [reqScore, setReqScore] = useState(12);
  const [gradScore, setGradScore] = useState(8);
  const [docScore, setDocScore] = useState(8);

  // Result publishing form — [G/Y/R disabled]
  // const [resultStatus, setResultStatus] = useState('Green');
  // const [nextStep, setNextStep] = useState('Application recommended — start your application now!');

  // University matching
  const [universities, setUniversities] = useState<MatchableUniversity[]>([]);
  const [editingMatch, setEditingMatch] = useState(false);

  // Application CRM stage
  const [crmStage, setCrmStage] = useState('Interested');

  const loadStudents = useCallback(async () => {
    try {
      const res = await studentsAPI.list({ search, limit: 50 });
      setStudents(res.data.students || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    let active = true;
    studentsAPI
      .list({ search, limit: 50 })
      .then((res) => {
        if (active) {
          setStudents(res.data.students || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [search]);

  useEffect(() => {
    universitiesAPI
      .list()
      .then((res) => setUniversities(res.data || []))
      .catch(() => {});
  }, []);

  const universityName = (id?: string) => universities.find((u) => u._id === id)?.name || 'University';

  // Live refresh so newly registered students appear without a manual reload
  usePolling(loadStudents);

  const selectStudent = async (s: StudentListItem) => {
    setSelectedStudent(s);
    setFeedback(null);
    setEditingMatch(false);
    if (s.assessment?.categoryScores) {
      setAcademicScore(s.assessment.categoryScores.academic ?? 25);
      setEnglishScore(s.assessment.categoryScores.english ?? 15);
      setProgramFitScore(s.assessment.categoryScores.programFit ?? 12);
      setReqScore(s.assessment.categoryScores.requirements ?? 12);
      setGradScore(s.assessment.categoryScores.graduation ?? 8);
      setDocScore(s.assessment.categoryScores.documents ?? 8);
    }
    // [G/Y/R disabled]
    // if (s.result?.status) {
    //   setResultStatus(s.result.status);
    //   setNextStep(s.result.nextStep || '');
    // }
    if (s.application?.stage) {
      setCrmStage(s.application.stage);
    }
  };

  // [Payment disabled]
  // const handleVerifyPayment = async (paymentIdx: number, status: 'Verified' | 'Failed') => {
  //   if (!selectedStudent) return;
  //   setActionLoading(true);
  //   try {
  //     await studentsAPI.verifyPayment(selectedStudent._id, paymentIdx, { status });
  //     setFeedback({ type: 'success', message: `Payment marked as ${status}` });
  //     const res = await studentsAPI.get(selectedStudent._id);
  //     setSelectedStudent(res.data);
  //     loadStudents();
  //   } catch {
  //     setFeedback({ type: 'error', message: 'Failed to update payment status' });
  //   } finally {
  //     setActionLoading(false);
  //   }
  // };

  const handleSaveAssessment = async () => {
    if (!selectedStudent) return;
    setAssessmentLoading(true);
    try {
      const total = academicScore + englishScore + programFitScore + reqScore + gradScore + docScore;
      await studentsAPI.assess(selectedStudent._id, {
        categoryScores: {
          academic: academicScore,
          english: englishScore,
          programFit: programFitScore,
          requirements: reqScore,
          graduation: gradScore,
          documents: docScore,
        },
        totalScore: total,
      });
      setFeedback({ type: 'success', message: `Assessment saved! Total Score: ${total}/100` });
      const res = await studentsAPI.get(selectedStudent._id);
      setSelectedStudent(res.data);
      loadStudents();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to save assessment' });
    } finally {
      setAssessmentLoading(false);
    }
  };

  const handleMatchOverridden = async () => {
    if (!selectedStudent) return;
    setEditingMatch(false);
    setFeedback({ type: 'success', message: 'Match updated. Approve it to send it to the university rep.' });
    const res = await studentsAPI.get(selectedStudent._id);
    setSelectedStudent(res.data);
    loadStudents();
  };

  const handleSuggestMatches = async () => {
    if (!selectedStudent) return;
    if (
      selectedStudent.matches?.overridden &&
      !window.confirm('This replaces the match staff chose by hand. Continue?')
    ) {
      return;
    }
    setMatchLoading(true);
    try {
      await studentsAPI.match(selectedStudent._id);
      setFeedback({ type: 'success', message: 'University matches suggested successfully!' });
      const res = await studentsAPI.get(selectedStudent._id);
      setSelectedStudent(res.data);
      loadStudents();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to run matching engine' });
    } finally {
      setMatchLoading(false);
    }
  };

  const handleApproveMatch = async () => {
    if (!selectedStudent) return;
    setMatchLoading(true);
    try {
      await studentsAPI.approveMatch(selectedStudent._id, { status: 'approved' });
      setFeedback({ type: 'success', message: 'Matches approved for university rep review!' });
      const res = await studentsAPI.get(selectedStudent._id);
      setSelectedStudent(res.data);
      loadStudents();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to approve matches' });
    } finally {
      setMatchLoading(false);
    }
  };

  // [G/Y/R disabled]
//   const handlePublishResult = async () => {
//     if (!selectedStudent) return;
//     setActionLoading(true);
//     try {
//       await studentsAPI.publishResult(selectedStudent._id, {
//         status: resultStatus,
//         nextStep,
//         disclaimer: 'This assessment is preliminary. Final admission depends on the institution official application.',
//       });
//       setFeedback({ type: 'success', message: `Result published & email sent to ${selectedStudent.email}!` });
//       const res = await studentsAPI.get(selectedStudent._id);
//       setSelectedStudent(res.data);
//       loadStudents();
//     } catch {
//       setFeedback({ type: 'error', message: 'Failed to publish result' });
//     } finally {
//       setActionLoading(false);
//     }
//   };

  const handleUpdateCrm = async (newStage: string) => {
    if (!selectedStudent) return;
    setCrmLoading(true);
    try {
      await studentsAPI.updateApplication(selectedStudent._id, newStage);
      setCrmStage(newStage);
      setFeedback({ type: 'success', message: `Application moved to: ${newStage}` });
      const res = await studentsAPI.get(selectedStudent._id);
      setSelectedStudent(res.data);
      loadStudents();
    } catch {
      setFeedback({ type: 'error', message: 'Failed to update application stage' });
    } finally {
      setCrmLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Student Admissions Desk</h1>
          <p className="text-dim-grey text-sm mt-1">
            {/* [G/Y/R disabled] was: Screening, 100-Point Scoring, University Matching & Result Publishing */}
            Screening, 100-Point Scoring & University Matching
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim-grey" />
            <input
              type="text"
              placeholder="Search by ID, name, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="glory-input pl-9 text-sm"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={loadStudents}>
            <RefreshCw size={14} /> Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading student applications..." />
      ) : students.length === 0 ? (
        <EmptyState
          icon={<GraduationCap />}
          title="No Students Found"
          description="Registered students will appear here for staff evaluation."
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Student List (Left side) */}
          <div className={clsx('space-y-3', selectedStudent ? 'lg:col-span-5' : 'lg:col-span-12')}>
            <p className="text-xs font-semibold text-dim-grey uppercase tracking-wider">
              {students.length} Registered Students
            </p>
            <div className="space-y-2 max-h-[75vh] overflow-y-auto pr-1">
              {students.map((s) => {
                // [Payment disabled] const isPaid = s.payments?.some((p) => (p.status || '').toLowerCase() === 'verified');
                const isSelected = selectedStudent?._id === s._id;

                return (
                  <div
                    key={s._id}
                    onClick={() => selectStudent(s)}
                    className={clsx(
                      'p-4 rounded-xl border transition-all cursor-pointer bg-white hover:border-ocean hover:shadow-sm',
                      isSelected ? 'border-ocean ring-2 ring-ocean/20 bg-ocean-light/10' : 'border-charcoal/10'
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs text-ocean bg-ocean-light/30 px-2 py-0.5 rounded">
                        {s.studentId}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {/* [Payment disabled] Paid/Unpaid badge
                        {isPaid ? (
                          <Badge variant="green" className="text-[10px]">Paid</Badge>
                        ) : (
                          <Badge variant="yellow" className="text-[10px]">Unpaid</Badge>
                        )}
                        */}
                        {/* [G/Y/R disabled] published result badge
                        {s.result?.isPublished && (
                          <Badge
                            variant={s.result.status?.toLowerCase() === 'green' ? 'green' : s.result.status?.toLowerCase() === 'yellow' ? 'yellow' : 'red'}
                            className="text-[10px]"
                          >
                            {s.result.status}
                          </Badge>
                        )}
                        */}
                      </div>
                    </div>

                    <h3 className="font-semibold text-carbon text-sm">
                      {s.firstName} {s.lastName}
                    </h3>
                    <p className="text-xs text-dim-grey mt-0.5 truncate">{s.email} • {s.phone}</p>

                    <div className="flex items-center gap-3 text-xs text-dim-grey mt-3 pt-2 border-t border-charcoal/5">
                      <span>GPA: <strong>{s.gpa ?? 'N/A'}</strong></span>
                      <span>•</span>
                      <span className="truncate">{s.intendedProgram || 'General'}</span>
                      <span>•</span>
                      <span>{s.preferredCountry || 'Any'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Student Evaluation Console (Right side) */}
          {selectedStudent && (
            <div className="lg:col-span-7 space-y-5 bg-porcelain p-5 rounded-2xl border border-charcoal/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-carbon">
                      {selectedStudent.firstName} {selectedStudent.lastName}
                    </h2>
                    <span className="text-xs font-bold text-ocean bg-white px-2.5 py-1 rounded border border-ocean/30">
                      {selectedStudent.studentId}
                    </span>
                  </div>
                  <p className="text-xs text-dim-grey mt-1">
                    {selectedStudent.email} • {selectedStudent.phone} • Profile: {selectedStudent.profileComplete ?? 0}%
                  </p>
                </div>
                <button onClick={() => setSelectedStudent(null)} className="text-dim-grey hover:text-carbon p-1">
                  <X size={20} />
                </button>
              </div>

              {feedback && (
                <div
                  className={clsx(
                    'p-3 rounded-lg text-sm font-medium flex items-center gap-2',
                    feedback.type === 'success' ? 'bg-green-bg border border-green/30 text-green-text' : 'bg-red-bg border border-red/30 text-red-text'
                  )}
                >
                  {feedback.type === 'success' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                  {feedback.message}
                </div>
              )}

              {/* 1. Academic & Document Details */}
              <Card>
                <h3 className="font-semibold text-carbon text-sm mb-3">Academic Background</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div>
                    <span className="text-dim-grey">Lives in</span>
                    <p className="font-semibold text-carbon mt-0.5">{selectedStudent.country || '—'}</p>
                  </div>
                  <div>
                    <span className="text-dim-grey">Date of birth</span>
                    <p className="font-semibold text-carbon mt-0.5">{selectedStudent.dateOfBirth || '—'}</p>
                  </div>
                  <div>
                    <span className="text-dim-grey">Gender</span>
                    <p className="font-semibold text-carbon mt-0.5 capitalize">{selectedStudent.gender || '—'}</p>
                  </div>
                  <div>
                    <span className="text-dim-grey">Education Level</span>
                    <p className="font-semibold text-carbon mt-0.5">{selectedStudent.educationLevel || '—'}</p>
                  </div>
                  <div>
                    <span className="text-dim-grey">Institution</span>
                    <p className="font-semibold text-carbon mt-0.5">{selectedStudent.school || '—'}</p>
                  </div>
                  <div>
                    <span className="text-dim-grey">GPA</span>
                    <p className="font-semibold text-carbon mt-0.5">{selectedStudent.gpa ?? '—'}</p>
                  </div>
                  <div>
                    <span className="text-dim-grey">English</span>
                    <p className="font-semibold text-carbon mt-0.5">
                      {selectedStudent.englishTest || 'N/A'}: {selectedStudent.englishScore ?? ''}
                    </p>
                  </div>
                </div>

                {selectedStudent.documents && selectedStudent.documents.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-charcoal/10">
                    <span className="text-xs font-semibold text-dim-grey">Uploaded Documents:</span>
                    <div className="space-y-1.5 mt-2">
                      {selectedStudent.documents.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-porcelain p-2 rounded text-xs">
                          <span className="flex items-center gap-1.5 font-medium truncate">
                            <FileText size={14} className="text-ocean" /> {doc.fileName}
                          </span>
                          <a
                            href={doc.cloudinaryUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-ocean font-semibold hover:underline flex items-center gap-1"
                          >
                            Open PDF <ExternalLink size={12} />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Card>

              {/* [Payment disabled] 2. Payment Verification
              <Card>
                <h3 className="font-semibold text-carbon text-sm mb-3 flex items-center justify-between">
                  <span>Payment Receipts</span>
                  <span className="text-xs font-normal text-dim-grey">500 ETB Pass Fee</span>
                </h3>
                {!selectedStudent.payments || selectedStudent.payments.length === 0 ? (
                  <p className="text-xs text-dim-grey">No payment receipts submitted yet.</p>
                ) : (
                  <div className="space-y-2">
                    {selectedStudent.payments.map((p, idx) => {
                      const isVerified = (p.status || '').toLowerCase() === 'verified';
                      return (
                        <div key={idx} className="flex items-center justify-between bg-porcelain p-2.5 rounded-lg text-xs">
                          <div>
                            <p className="font-semibold text-carbon capitalize">{p.method} • {p.amount} ETB</p>
                            <p className="text-[11px] text-dim-grey">Ref: {p.transactionRef}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={isVerified ? 'green' : 'yellow'} className="text-[11px]">
                              {p.status}
                            </Badge>
                            {!isVerified && (
                              <Button
                                size="sm"
                                variant="accent"
                                className="text-xs py-1 px-2.5"
                                disabled={paymentLoading}
                                loading={paymentLoading}
                                onClick={() => handleVerifyPayment(idx, 'Verified')}
                              >
                                Verify Payment
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
              */}

              {/* 3. 100-Point Scoring Engine */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-carbon text-sm">100-Point Admissions Assessment</h3>
                  <span className="text-sm font-bold text-ocean">
                    Total: {academicScore + englishScore + programFitScore + reqScore + gradScore + docScore} / 100
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-dim-grey">Academic (max 30)</label>
                    <input
                      type="number"
                      max={30}
                      min={0}
                      value={academicScore}
                      onChange={(e) => setAcademicScore(parseInt(e.target.value) || 0)}
                      className="glory-input text-xs py-1.5 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-dim-grey">English (max 20)</label>
                    <input
                      type="number"
                      max={20}
                      min={0}
                      value={englishScore}
                      onChange={(e) => setEnglishScore(parseInt(e.target.value) || 0)}
                      className="glory-input text-xs py-1.5 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-dim-grey">Program Fit (max 15)</label>
                    <input
                      type="number"
                      max={15}
                      min={0}
                      value={programFitScore}
                      onChange={(e) => setProgramFitScore(parseInt(e.target.value) || 0)}
                      className="glory-input text-xs py-1.5 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-dim-grey">Country / Inst. (max 15)</label>
                    <input
                      type="number"
                      max={15}
                      min={0}
                      value={reqScore}
                      onChange={(e) => setReqScore(parseInt(e.target.value) || 0)}
                      className="glory-input text-xs py-1.5 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-dim-grey">Grad Status (max 10)</label>
                    <input
                      type="number"
                      max={10}
                      min={0}
                      value={gradScore}
                      onChange={(e) => setGradScore(parseInt(e.target.value) || 0)}
                      className="glory-input text-xs py-1.5 mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-dim-grey">Documents (max 10)</label>
                    <input
                      type="number"
                      max={10}
                      min={0}
                      value={docScore}
                      onChange={(e) => setDocScore(parseInt(e.target.value) || 0)}
                      className="glory-input text-xs py-1.5 mt-1"
                    />
                  </div>
                </div>
                <div className="mt-3 flex justify-end">
                  <Button size="sm" onClick={handleSaveAssessment} loading={assessmentLoading}>
                    Save Assessment Score
                  </Button>
                </div>
              </Card>

              {/* 4. University Matching */}
              <Card>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-carbon text-sm">University Matches</h3>
                  {!editingMatch && (
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="secondary" onClick={() => setEditingMatch(true)}>
                        {selectedStudent.matches?.primary ? 'Change match' : 'Choose manually'}
                      </Button>
                      <Button size="sm" variant="secondary" onClick={handleSuggestMatches} loading={matchLoading}>
                        <Sparkles size={14} className="text-ocean" /> Suggest Matches
                      </Button>
                    </div>
                  )}
                </div>

                {editingMatch ? (
                  <MatchOverride
                    studentId={selectedStudent._id}
                    universities={universities}
                    primary={selectedStudent.matches?.primary}
                    secondary={selectedStudent.matches?.secondary}
                    onSaved={handleMatchOverridden}
                    onCancel={() => setEditingMatch(false)}
                  />
                ) : selectedStudent.matches?.primary ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-ocean-light/20 border border-ocean/30 rounded-lg text-xs">
                      <p className="font-bold text-ocean">
                        Primary: {universityName(selectedStudent.matches.primary.university)}, {selectedStudent.matches.primary.program || 'Program Match'}
                      </p>
                      <p className="text-dim-grey mt-0.5 font-medium">Reason: {selectedStudent.matches.primary.reason}</p>
                    </div>
                    {selectedStudent.matches?.secondary && (
                      <div className="p-3 bg-porcelain border border-charcoal/10 rounded-lg text-xs">
                        <p className="font-bold text-carbon">
                          Secondary: {universityName(selectedStudent.matches.secondary.university)}, {selectedStudent.matches.secondary.program || 'Alternative Program'}
                        </p>
                        <p className="text-dim-grey mt-0.5">Reason: {selectedStudent.matches.secondary.reason}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between mt-2 pt-2">
                      <span className="text-xs text-dim-grey">
                        Match Status: <strong>{selectedStudent.matches.status || 'suggested'}</strong>
                        {selectedStudent.matches.overridden && ' (chosen by staff)'}
                      </span>
                      {selectedStudent.matches.status !== 'approved' && (
                        <Button size="sm" onClick={handleApproveMatch} loading={matchLoading}>
                          Approve for University Rep
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-dim-grey">Click &quot;Suggest Matches&quot; to calculate fit against active university programs, or choose a university manually.</p>
                )}
              </Card>

              {/* [G/Y/R disabled] 5. Publish Result to Student
              <Card>
                <h3 className="font-semibold text-carbon text-sm mb-3">Publish Official Assessment Result</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Select
                      label="Result Outcome"
                      value={resultStatus}
                      options={[
                        { value: 'Green', label: '🟢 Green — Eligible to Apply' },
                        { value: 'Yellow', label: '🟡 Yellow — Further Review Required' },
                        { value: 'Red', label: '🔴 Red — Not Currently Matched' },
                      ]}
                      onChange={(e) => setResultStatus(e.target.value)}
                    />
                    <Input
                      label="Next Action Guidance"
                      value={nextStep}
                      onChange={(e) => setNextStep(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-dim-grey">
                      {selectedStudent.result?.isPublished ? '✅ Result is currently published to student.' : '⏳ Not yet published.'}
                    </p>
                    <Button size="sm" variant="accent" onClick={handlePublishResult} loading={resultLoading}>
                      Publish & Send Email Alert
                    </Button>
                  </div>
                </div>
              </Card>
              */}

              {/* 6. Application CRM Pipeline */}
              <Card>
                <h3 className="font-semibold text-carbon text-sm mb-3">Post-Event Application Pipeline</h3>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Interested', 'Consultation', 'AppStarted', 'DocsComplete',
                    'Submitted', 'Offer', 'I20', 'Visa', 'Completed', 'Lost'
                  ].map((stage) => (
                    <button
                      key={stage}
                      type="button"
                      onClick={() => handleUpdateCrm(stage)}
                      className={clsx(
                        'px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                        crmStage === stage ? 'bg-carbon text-white shadow-sm' : 'bg-white border border-charcoal/20 text-dim-grey hover:border-carbon'
                      )}
                    >
                      {stage}
                    </button>
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
