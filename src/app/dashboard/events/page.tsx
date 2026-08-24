'use client';

import { useEffect, useState } from 'react';
import { eventsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { Calendar, Clock, ExternalLink, CheckCircle, MapPin } from 'lucide-react';

interface EventSession {
  name: string;
  destination: string;
  time: string;
  roomLink: string;
  universityName: string;
  repName: string;
}

interface EventData {
  _id: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  mainRoomLink: string;
  status: string;
}

interface MySession {
  session: EventSession;
  checkedIn: boolean;
}

export default function EventsPage() {
  const user = useAuthStore((s) => s.user);
  const [events, setEvents] = useState<EventData[]>([]);
  const [mySessions, setMySessions] = useState<Record<string, MySession[]>>({});
  const [loading, setLoading] = useState(true);
  const [checkInCode, setCheckInCode] = useState('');
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkInSuccess, setCheckInSuccess] = useState<string | null>(null);

  useEffect(() => {
    loadEvents();
  }, [user]);

  const loadEvents = async () => {
    try {
      const res = await eventsAPI.list();
      const evts = res.data;
      setEvents(evts);

      // Load my sessions for each event
      for (const evt of evts) {
        try {
          const sessRes = await eventsAPI.mySessions(evt._id);
          setMySessions((prev) => ({ ...prev, [evt._id]: sessRes.data }));
        } catch {
          // Student may not have sessions
        }
      }
    } catch {
      // No events yet
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async (eventId: string) => {
    setCheckingIn(true);
    try {
      await eventsAPI.checkIn(eventId, {
        code: checkInCode || undefined,
        attended: true,
      });
      setCheckInSuccess(eventId);
      setTimeout(() => setCheckInSuccess(null), 3000);
      setCheckInCode('');
    } catch {
      // Handle error
    } finally {
      setCheckingIn(false);
    }
  };

  if (loading) return <LoadingSpinner text="Loading events..." />;

  if (events.length === 0) {
    return (
      <EmptyState
        icon={<Calendar />}
        title="No Events Yet"
        description="Event schedules will appear here once published by the admin."
      />
    );
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-carbon">Events</h1>
        <p className="text-dim-grey text-sm mt-1">Your assigned sessions and check-in</p>
      </div>

      {events.map((evt) => {
        const sessions = mySessions[evt._id] || [];
        return (
          <Card key={evt._id}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-carbon">{evt.name}</h2>
                <div className="flex items-center gap-4 text-sm text-dim-grey mt-1">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(evt.date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> {evt.startTime} - {evt.endTime}
                  </span>
                </div>
              </div>
              <Badge variant={evt.status === 'live' ? 'green' : 'blue'}>
                {evt.status}
              </Badge>
            </div>

            {/* Main Room */}
            {evt.mainRoomLink && (
              <div className="bg-porcelain rounded-lg p-3 mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-carbon">📺 Main Room</span>
                <a
                  href={evt.mainRoomLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ocean text-sm flex items-center gap-1 hover:underline"
                >
                  Join <ExternalLink size={12} />
                </a>
              </div>
            )}

            {/* Assigned Sessions */}
            {sessions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-carbon">Your Sessions:</h3>
                {sessions.map((s, i) => (
                  <div
                    key={i}
                    className={`border rounded-lg p-4 ${
                      s.checkedIn ? 'border-green/30 bg-green-bg/20' : 'border-pale-sky'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-carbon flex items-center gap-2">
                          <MapPin size={14} className="text-ocean" />
                          {s.session.name}
                        </p>
                        <p className="text-sm text-dim-grey mt-1">
                          🏛️ {s.session.universityName} • ⏰ {s.session.time}
                        </p>
                        {s.session.repName && (
                          <p className="text-xs text-dim-grey">Rep: {s.session.repName}</p>
                        )}
                      </div>
                      {s.checkedIn ? (
                        <Badge variant="green"><CheckCircle size={12} /> Checked In</Badge>
                      ) : null}
                    </div>
                    {s.session.roomLink && (
                      <a
                        href={s.session.roomLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-ocean text-sm flex items-center gap-1 hover:underline mt-2"
                      >
                        Join Session <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Check-in */}
            <div className="mt-4 pt-4 border-t border-charcoal/10">
              {checkInSuccess === evt._id ? (
                <div className="bg-green-bg text-green-text px-4 py-2 rounded-lg text-sm text-center">
                  ✅ Checked in successfully!
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Check-in code (optional)"
                    value={checkInCode}
                    onChange={(e) => setCheckInCode(e.target.value)}
                    className="glory-input flex-1 py-2 text-sm"
                  />
                  <Button
                    size="sm"
                    onClick={() => handleCheckIn(evt._id)}
                    loading={checkingIn}
                  >
                    ✓ I Attended
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}
