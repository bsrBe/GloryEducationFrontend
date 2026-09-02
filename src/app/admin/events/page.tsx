'use client';

import { useEffect, useState, useCallback } from 'react';
import { eventsAPI } from '@/lib/api';
import { Card, Button, Input, Select, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { Calendar, Plus, ExternalLink, X } from 'lucide-react';

interface Session {
  name: string;
  destination: string;
  time: string;
  roomLink: string;
  capacity?: number;
  assignedStudents?: Array<{ studentId: string; firstName: string; lastName: string }>;
}

interface EventData {
  _id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  mainRoomLink?: string;
  status: string;
  sessions?: Session[];
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // New Event Form State
  const [name, setName] = useState('Glory International Admissions Fair 2026');
  const [date, setDate] = useState('2026-09-15');
  const [startTime, setStartTime] = useState('09:00 AM');
  const [endTime, setEndTime] = useState('12:30 PM');
  const [mainRoomLink, setMainRoomLink] = useState('https://meet.google.com/glory-main-2026');

  // New Session Form State
  const [sessionName, setSessionName] = useState('');
  const [sessionDest, setSessionDest] = useState('USA');
  const [sessionTime, setSessionTime] = useState('10:30 AM - 11:30 AM');
  const [sessionRoomLink, setSessionRoomLink] = useState('');
  const [sessionCapacity, setSessionCapacity] = useState(50);

  const loadEvents = useCallback(async () => {
    try {
      const res = await eventsAPI.list();
      setEvents(res.data || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    eventsAPI
      .list()
      .then((res) => {
        if (active) {
          setEvents(res.data || []);
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await eventsAPI.create({
        name,
        date,
        startTime,
        endTime,
        mainRoomLink,
        status: 'published',
      });
      setShowEventModal(false);
      loadEvents();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSessionModal) return;
    setSubmitting(true);
    try {
      await eventsAPI.addSession(showSessionModal, {
        name: sessionName,
        destination: sessionDest,
        time: sessionTime,
        roomLink: sessionRoomLink,
        capacity: Number(sessionCapacity) || 50,
      });
      setShowSessionModal(null);
      setSessionName('');
      setSessionRoomLink('');
      loadEvents();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading fair events..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-carbon">Fair Events & Breakout Rooms</h1>
          <p className="text-dim-grey text-sm mt-1">
            Schedule virtual admissions fairs and configure destination breakout tracks
          </p>
        </div>
        <Button variant="accent" onClick={() => setShowEventModal(true)}>
          <Plus size={16} /> Create Event
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={<Calendar />}
          title="No Events Scheduled"
          description="Create your first International Admissions Fair to start assigning students to breakout tracks."
        />
      ) : (
        <div className="space-y-6">
          {events.map((evt) => (
            <Card key={evt._id} className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-charcoal/10">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-carbon">{evt.name}</h2>
                    <Badge variant={evt.status === 'published' ? 'green' : 'yellow'}>
                      {evt.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-dim-grey mt-1">
                    📅 {new Date(evt.date).toLocaleDateString()} • ⏰ {evt.startTime} - {evt.endTime}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {evt.mainRoomLink && (
                    <a
                      href={evt.mainRoomLink}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-ocean bg-ocean-light/20 px-3 py-1.5 rounded-lg border border-ocean/30 hover:underline flex items-center gap-1.5"
                    >
                      Main Room Link <ExternalLink size={12} />
                    </a>
                  )}
                  <Button size="sm" variant="secondary" onClick={() => setShowSessionModal(evt._id)}>
                    <Plus size={14} /> Add Breakout Track
                  </Button>
                </div>
              </div>

              {/* Breakout Sessions List */}
              <div>
                <h3 className="text-xs font-semibold text-dim-grey uppercase tracking-wider mb-3">
                  Breakout Destination Sessions ({evt.sessions?.length || 0})
                </h3>

                {!evt.sessions || evt.sessions.length === 0 ? (
                  <p className="text-xs text-dim-grey italic">No breakout tracks added yet. Click &quot;Add Breakout Track&quot; above.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {evt.sessions.map((sess, sIdx) => (
                      <div key={sIdx} className="p-3.5 bg-porcelain rounded-xl border border-charcoal/10 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-carbon">{sess.name}</span>
                          <span className="text-xs font-semibold text-ocean">{sess.destination}</span>
                        </div>
                        <p className="text-xs text-dim-grey">⏰ {sess.time}</p>
                        <p className="text-xs text-dim-grey">Capacity: {sess.capacity || 50} students</p>

                        <div className="pt-2 border-t border-charcoal/10 flex items-center justify-between">
                          <span className="text-[11px] text-dim-grey font-medium">
                            {sess.assignedStudents?.length || 0} Students Assigned
                          </span>
                          {sess.roomLink && (
                            <a
                              href={sess.roomLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-ocean font-semibold hover:underline flex items-center gap-1"
                            >
                              Join Room <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-carbon">Create Fair Event</h2>
              <button onClick={() => setShowEventModal(false)} className="text-dim-grey hover:text-carbon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <Input
                label="Event Title *"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                label="Date *"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Start Time *"
                  placeholder="09:00 AM"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                />
                <Input
                  label="End Time *"
                  placeholder="12:30 PM"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                />
              </div>
              <Input
                label="Main Webinar Plenary Room Link *"
                placeholder="https://meet.google.com/..."
                value={mainRoomLink}
                onChange={(e) => setMainRoomLink(e.target.value)}
                required
              />
              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="secondary" onClick={() => setShowEventModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Create Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Session Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-carbon">Add Breakout Session</h2>
              <button onClick={() => setShowSessionModal(null)} className="text-dim-grey hover:text-carbon">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddSession} className="space-y-3.5">
              <Input
                label="Session Name *"
                placeholder="e.g. USA & Canada STEM Track"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                required
              />
              <Select
                label="Destination *"
                value={sessionDest}
                options={[
                  { value: 'USA', label: 'USA' },
                  { value: 'Canada', label: 'Canada' },
                  { value: 'UK', label: 'UK' },
                  { value: 'Germany', label: 'Germany' },
                  { value: 'Australia', label: 'Australia' },
                  { value: 'Ireland', label: 'Ireland' },
                ]}
                onChange={(e) => setSessionDest(e.target.value)}
              />
              <Input
                label="Time Slot *"
                placeholder="10:30 AM - 11:45 AM"
                value={sessionTime}
                onChange={(e) => setSessionTime(e.target.value)}
                required
              />
              <Input
                label="Private Meeting URL *"
                placeholder="https://meet.google.com/..."
                value={sessionRoomLink}
                onChange={(e) => setSessionRoomLink(e.target.value)}
                required
              />
              <Input
                label="Room Capacity"
                type="number"
                value={sessionCapacity}
                onChange={(e) => setSessionCapacity(parseInt(e.target.value) || 50)}
              />
              <div className="flex justify-end gap-3 pt-3">
                <Button type="button" variant="secondary" onClick={() => setShowSessionModal(null)}>
                  Cancel
                </Button>
                <Button type="submit" loading={submitting}>
                  Save Track
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
