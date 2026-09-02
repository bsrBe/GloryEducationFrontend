'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { Card, Button, Badge, LoadingSpinner, EmptyState } from '@/components/ui';
import { Calendar, Clock, CheckCircle, MapPin, Video, Lock } from 'lucide-react';

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
    let active = true;
    eventsAPI
      .list()
      .then(async (res) => {
        if (!active) return;
        const evts = res.data || [];
        setEvents(evts);
        setLoading(false);
        for (const evt of evts) {
          try {
            const sessRes = await eventsAPI.mySessions(evt._id);
            const raw = sessRes.data;
            const sessionsList = Array.isArray(raw)
              ? raw
              : Array.isArray(raw?.assignedSessions)
              ? raw.assignedSessions.map((session: any) => ({
                  session,
                  checkedIn: raw.hasCheckedIn || raw.attended || false,
                }))
              : [];
            if (active) {
              setMySessions((prev) => ({ ...prev, [evt._id]: sessionsList }));
            }
          } catch {
            // Student may not have sessions
          }
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [user]);

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

            {/* Main Plenary Hall — In-Platform Jitsi Video */}
            <div className="bg-gradient-to-r from-ocean/10 to-pale-sky/20 border border-ocean/20 rounded-xl p-4 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-carbon">📺 Main Plenary Hall</span>
                  <Badge variant="blue" className="text-[10px]">In-Platform Video</Badge>
                </div>
                <p className="text-xs text-dim-grey mt-0.5">
                  Opening keynote, global admissions briefing, and interactive plenary
                </p>
              </div>
              <Link href={`/dashboard/events/${evt._id}/room`}>
                <Button size="sm" variant="accent" className="font-bold flex items-center gap-1.5 shadow-sm">
                  <Video size={14} /> Enter Plenary Room
                </Button>
              </Link>
            </div>

            {/* Assigned Sessions */}
            {sessions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-carbon">Your Assigned Breakout Tracks:</h3>
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
                          {s.session?.name || (s as any).name || 'Breakout Track'}
                        </p>
                        <p className="text-sm text-dim-grey mt-1">
                          🏛️ {s.session?.universityName || (s as any).universityName || s.session?.destination || (s as any).destination || 'University Track'} • ⏰ {s.session?.time || (s as any).time || 'Session Time'}
                        </p>
                        {(s.session?.repName || (s as any).repName) && (
                          <p className="text-xs text-dim-grey">Rep: {s.session?.repName || (s as any).repName}</p>
                        )}
                      </div>
                      {s.checkedIn ? (
                        <Badge variant="green"><CheckCircle size={12} /> Checked In</Badge>
                      ) : null}
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-charcoal/10 flex items-center justify-between">
                      <span className="text-[11px] text-dim-grey font-medium flex items-center gap-1">
                        <Lock size={12} className="text-gold" /> 500 ETB Pass Protected
                      </span>
                      <Link href={`/dashboard/events/${evt._id}/room?sessionIndex=${i}`}>
                        <Button size="sm" variant="outline-ocean" className="text-xs font-bold flex items-center gap-1.5 py-1">
                          <Video size={13} /> Enter Breakout Track
                        </Button>
                      </Link>
                    </div>
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
