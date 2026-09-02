'use client';

import { useEffect, useState, useCallback } from 'react';
import { universitiesAPI } from '@/lib/api';
import { Card, Button, Input, Select, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { Target, Plus, MapPin, Trash2, X } from 'lucide-react';

interface Program {
  name: string;
  degreeLevel: string;
  gpaRequirement: number;
  englishRequirement: string;
  tuitionInfo: string;
}

interface University {
  _id: string;
  name: string;
  destination: string;
  programs: Program[];
  reviewCapacity: number;
  isActive: boolean;
}

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New university form state
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('USA');
  const [reviewCapacity, setReviewCapacity] = useState(50);
  const [programs, setPrograms] = useState<Program[]>([
    { name: 'Computer Science', degreeLevel: 'Bachelor', gpaRequirement: 3.0, englishRequirement: 'IELTS 6.5', tuitionInfo: '$30,000/yr' },
  ]);

  const loadUniversities = useCallback(async () => {
    try {
      const res = await universitiesAPI.list();
      setUniversities(res.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    universitiesAPI
      .list()
      .then((res) => {
        if (active) {
          setUniversities(res.data || []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleToggle = async (id: string) => {
    try {
      await universitiesAPI.toggle(id);
      loadUniversities();
    } catch {
      // ignore
    }
  };

  const addProgramField = () => {
    setPrograms([
      ...programs,
      { name: '', degreeLevel: 'Bachelor', gpaRequirement: 3.0, englishRequirement: 'IELTS 6.5', tuitionInfo: '' },
    ]);
  };

  const updateProgramField = (idx: number, key: keyof Program, val: string | number) => {
    const updated = [...programs];
    updated[idx] = { ...updated[idx], [key]: val };
    setPrograms(updated);
  };

  const removeProgramField = (idx: number) => {
    setPrograms(programs.filter((_, i) => i !== idx));
  };

  const handleCreateUniversity = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await universitiesAPI.create({
        name,
        destination,
        reviewCapacity: Number(reviewCapacity) || 50,
        programs: programs.filter((p) => p.name.trim().length > 0),
        isActive: true,
      });
      setShowAddModal(false);
      setName('');
      loadUniversities();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading university directory..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Partner Universities</h1>
          <p className="text-dim-grey text-sm mt-1">
            Manage institutions, degree programs, and admissions requirements
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowAddModal(true)}>
          <Plus size={16} /> Add University
        </Button>
      </div>

      {universities.length === 0 ? (
        <EmptyState
          icon={<Target />}
          title="No Universities Yet"
          description="Add participating universities to enable admissions matching."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {universities.map((uni) => (
            <Card key={uni._id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-bold text-carbon text-base">{uni.name}</h3>
                  <Badge variant={uni.isActive ? 'green' : 'grey'}>
                    {uni.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-dim-grey mb-3">
                  <MapPin size={14} className="text-ocean" />
                  <span className="font-medium text-carbon">{uni.destination}</span>
                  <span>•</span>
                  <span>Capacity: {uni.reviewCapacity} students</span>
                </div>

                <div className="space-y-2 mt-4 pt-3 border-t border-charcoal/10">
                  <span className="text-xs font-semibold text-dim-grey uppercase tracking-wider">
                    Programs ({uni.programs?.length || 0})
                  </span>
                  {uni.programs?.map((prog, pIdx) => (
                    <div key={pIdx} className="bg-porcelain p-2.5 rounded-lg text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-carbon">{prog.name}</span>
                        <span className="text-dim-grey">{prog.degreeLevel}</span>
                      </div>
                      <div className="flex items-center gap-3 text-dim-grey mt-1">
                        <span>Min GPA: <strong>{prog.gpaRequirement}</strong></span>
                        <span>•</span>
                        <span>{prog.englishRequirement}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-charcoal/10 flex justify-end">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleToggle(uni._id)}
                >
                  {uni.isActive ? 'Deactivate for Event' : 'Activate for Event'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add University Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-carbon">Add Partner University</h2>
              <button onClick={() => setShowAddModal(false)} className="text-dim-grey hover:text-carbon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUniversity} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Institution Name *"
                  placeholder="e.g. University of Toronto"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Select
                  label="Destination Country *"
                  value={destination}
                  options={[
                    { value: 'USA', label: 'USA' },
                    { value: 'Canada', label: 'Canada' },
                    { value: 'UK', label: 'UK' },
                    { value: 'Germany', label: 'Germany' },
                    { value: 'Australia', label: 'Australia' },
                    { value: 'Ireland', label: 'Ireland' },
                    { value: 'Italy', label: 'Italy' },
                    { value: 'Spain', label: 'Spain' },
                  ]}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              <Input
                label="Profile Review Capacity"
                type="number"
                value={reviewCapacity}
                onChange={(e) => setReviewCapacity(parseInt(e.target.value) || 50)}
              />

              {/* Program list */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-semibold text-carbon">Degree Programs</label>
                  <Button type="button" size="sm" variant="secondary" onClick={addProgramField}>
                    <Plus size={12} /> Add Program
                  </Button>
                </div>

                <div className="space-y-3">
                  {programs.map((p, idx) => (
                    <div key={idx} className="p-3 bg-porcelain rounded-xl border border-charcoal/10 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-dim-grey">Program #{idx + 1}</span>
                        {programs.length > 1 && (
                          <button type="button" onClick={() => removeProgramField(idx)} className="text-red hover:opacity-80">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <Input
                          label="Program Name"
                          placeholder="e.g. Computer Science"
                          value={p.name}
                          onChange={(e) => updateProgramField(idx, 'name', e.target.value)}
                          required
                        />
                        <Select
                          label="Degree Level"
                          value={p.degreeLevel}
                          options={[
                            { value: 'Bachelor', label: 'Bachelor' },
                            { value: 'Master', label: 'Master' },
                            { value: 'PhD', label: 'PhD' },
                            { value: 'Diploma', label: 'Diploma' },
                          ]}
                          onChange={(e) => updateProgramField(idx, 'degreeLevel', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                        <Input
                          label="Min GPA Requirement"
                          type="number"
                          step="0.1"
                          value={p.gpaRequirement}
                          onChange={(e) => updateProgramField(idx, 'gpaRequirement', parseFloat(e.target.value) || 0)}
                        />
                        <Input
                          label="English Requirement"
                          placeholder="e.g. IELTS 6.5"
                          value={p.englishRequirement}
                          onChange={(e) => updateProgramField(idx, 'englishRequirement', e.target.value)}
                        />
                        <Input
                          label="Tuition Info"
                          placeholder="e.g. $25,000/yr"
                          value={p.tuitionInfo}
                          onChange={(e) => updateProgramField(idx, 'tuitionInfo', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-charcoal/10">
                <Button type="button" variant="secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Save University
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
