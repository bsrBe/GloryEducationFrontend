'use client';

import { useState } from 'react';
import { studentsAPI } from '@/lib/api';
import { Button, Input, Select } from '@/components/ui';

export interface MatchableUniversity {
  _id: string;
  name: string;
  isActive?: boolean;
  programs?: { name: string }[];
}

interface MatchEntry {
  university?: string;
  program?: string;
}

interface MatchOverrideProps {
  studentId: string;
  universities: MatchableUniversity[];
  primary?: MatchEntry | null;
  secondary?: MatchEntry | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function MatchOverride({ studentId, universities, primary, secondary, onSaved, onCancel }: MatchOverrideProps) {
  const [primaryUni, setPrimaryUni] = useState(primary?.university || '');
  const [primaryProgram, setPrimaryProgram] = useState(primary?.program || '');
  const [secondaryUni, setSecondaryUni] = useState(secondary?.university || '');
  const [secondaryProgram, setSecondaryProgram] = useState(secondary?.program || '');
  const [reason, setReason] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const active = universities.filter((u) => u.isActive !== false);
  const programsOf = (id: string) => universities.find((u) => u._id === id)?.programs || [];
  const programOptions = (id: string) => [
    { value: '', label: id && programsOf(id).length === 0 ? 'No programs listed' : 'Select a program' },
    ...programsOf(id).map((p) => ({ value: p.name, label: p.name })),
  ];
  const universityOptions = (emptyLabel: string, exclude: string) => [
    { value: '', label: emptyLabel },
    ...active.filter((u) => u._id !== exclude).map((u) => ({ value: u._id, label: u.name })),
  ];

  const handleSave = async () => {
    if (!primaryUni) return setError('Choose a primary university.');
    if (programsOf(primaryUni).length > 0 && !primaryProgram) return setError('Choose a program for the primary university.');
    if (secondaryUni && programsOf(secondaryUni).length > 0 && !secondaryProgram) return setError('Choose a program for the secondary university.');
    if (!reason.trim()) return setError('Add a reason for the change.');

    setSaving(true);
    setError(null);
    try {
      await studentsAPI.overrideMatch(studentId, {
        primary: { universityId: primaryUni, ...(primaryProgram && { program: primaryProgram }) },
        ...(secondaryUni && {
          secondary: { universityId: secondaryUni, ...(secondaryProgram && { program: secondaryProgram }) },
        }),
        reason: reason.trim(),
      });
      onSaved();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string | string[] } } })?.response?.data?.message;
      setError(Array.isArray(message) ? message.join(', ') : message || 'Could not save the match.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3 text-sm">
      <div className="grid sm:grid-cols-2 gap-3">
        <Select
          id="override-primary-university"
          label="Primary university"
          value={primaryUni}
          options={universityOptions('Select a university', secondaryUni)}
          onChange={(e) => {
            setPrimaryUni(e.target.value);
            setPrimaryProgram('');
          }}
        />
        <Select
          id="override-primary-program"
          label="Primary program"
          value={primaryProgram}
          options={programOptions(primaryUni)}
          disabled={programsOf(primaryUni).length === 0}
          onChange={(e) => setPrimaryProgram(e.target.value)}
        />
        <Select
          id="override-secondary-university"
          label="Secondary university (optional)"
          value={secondaryUni}
          options={universityOptions('None', primaryUni)}
          onChange={(e) => {
            setSecondaryUni(e.target.value);
            setSecondaryProgram('');
          }}
        />
        <Select
          id="override-secondary-program"
          label="Secondary program"
          value={secondaryProgram}
          options={programOptions(secondaryUni)}
          disabled={programsOf(secondaryUni).length === 0}
          onChange={(e) => setSecondaryProgram(e.target.value)}
        />
      </div>
      <Input
        id="override-reason"
        label="Reason for the change"
        placeholder="e.g. Student prefers Canada after their consultation"
        value={reason}
        onChange={(e) => {
          setReason(e.target.value);
          setError(null);
        }}
      />
      {error && <p role="alert" className="text-sm text-red">{error}</p>}
      <p className="text-xs text-dim-grey">
        Saving sets this match back to suggested. The university&apos;s rep sees the student after you approve it.
      </p>
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="secondary" type="button" onClick={onCancel} disabled={saving}>Cancel</Button>
        <Button size="sm" type="button" onClick={handleSave} loading={saving}>Save match</Button>
      </div>
    </div>
  );
}
