'use client';

import { useEffect, useRef, useState, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { eventsAPI } from '@/lib/api';
import { Card, Button, Badge, LoadingSpinner } from '@/components/ui';
import {
  Lock,
  Clock,
  ArrowLeft,
  Maximize2,
  Minimize2,
  Video,
  ShieldCheck,
  CreditCard,
  Radio,
  Calendar,
} from 'lucide-react';


interface RoomData {
  roomUrl: string;
  token: string;
  displayName: string;
  email: string;
  isModerator: boolean;
  eventName: string;
  sessionName: string;
  startTime?: string;
  endTime?: string;
  date?: string;
  status?: string;
}

export default function ConferenceRoomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const searchParams = useSearchParams();
  const sessionIndexParam = searchParams.get('sessionIndex');
  const sessionIndex =
    sessionIndexParam !== null && sessionIndexParam !== ''
      ? parseInt(sessionIndexParam, 10)
      : undefined;

  const router = useRouter();
  const callFrameRef = useRef<HTMLDivElement>(null);
  const callObjectRef = useRef<any>(null);

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paywallError, setPaywallError] = useState<string | null>(null);
  const [timeGateError, setTimeGateError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // 1. Fetch Room Credentials via Protected REST Gate
  useEffect(() => {
    let active = true;
    setLoading(true);
    setPaywallError(null);
    setTimeGateError(null);
    setGeneralError(null);

    eventsAPI
      .joinRoom(eventId, sessionIndex)
      .then((res) => {
        if (!active) return;
        setRoomData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setLoading(false);
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.message;

        if (status === 403) {
          setPaywallError(
            msg ||
              'Access to live fair conference rooms requires a verified 500 ETB admissions pass.'
          );
        } else if (status === 400) {
          setTimeGateError(
            msg ||
              'This conference room is not accessible yet. Please check back 15 minutes before the scheduled start time.'
          );
        } else {
          setGeneralError(msg || 'Failed to join conference session.');
        }
      });

    return () => {
      active = false;
    };
  }, [eventId, sessionIndex]);

  // 2. Load Daily.co SDK dynamically (SSR-safe)
  const [dailyLoaded, setDailyLoaded] = useState(false);
  const dailyIframeRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    import('@daily-co/daily-js')
      .then((mod) => {
        dailyIframeRef.current = mod.default || mod;
        setDailyLoaded(true);
      })
      .catch((err) => {
        console.error('Failed to load Daily.co SDK:', err);
        setGeneralError('Failed to load video conferencing library.');
      });
  }, []);

  // 3. Mount Daily.co Prebuilt Call Frame when data and SDK are ready
  useEffect(() => {
    if (!roomData || !dailyLoaded || !callFrameRef.current) return;
    const DailyIframeClass = dailyIframeRef.current;
    if (!DailyIframeClass) return;

    // Destroy existing instance if any
    if (callObjectRef.current) {
      try {
        callObjectRef.current.destroy();
      } catch {
        // ignore
      }
      callObjectRef.current = null;
    }

    // Clean container
    callFrameRef.current.innerHTML = '';

    try {
      // createFrame(parentElement, options) mounts the Daily prebuilt UI directly into our container div
      const callFrame = DailyIframeClass.createFrame(callFrameRef.current, {
        iframeStyle: {
          width: '100%',
          height: '100%',
          border: '0',
          borderRadius: '0',
        },
        showLeaveButton: false, // We have our own leave button
        showFullscreenButton: false, // We have our own fullscreen button
      });

      callObjectRef.current = callFrame;

      // Listen for events
      callFrame.on('error', (e: any) => {
        console.error('Daily.co error:', e);
      });

      callFrame.on('left-meeting', () => {
        router.push('/dashboard/events');
      });

      // Join the meeting with the room URL and token
      callFrame
        .join({
          url: roomData.roomUrl,
          token: roomData.token,
        })
        .catch((e: any) => {
          console.error('Daily.co join error:', e);
          setGeneralError(
            e?.message || 'Failed to launch video room. Please try again.'
          );
        });
    } catch (error: any) {
      console.error('Error initializing Daily.co:', error);
      setGeneralError(
        error?.message ||
          'Failed to launch video room. Please check your Daily.co configuration.'
      );
    }

    return () => {
      if (callObjectRef.current) {
        try {
          callObjectRef.current.destroy();
        } catch {
          // ignore cleanup errors
        }
        callObjectRef.current = null;
      }
    };
  }, [roomData, dailyLoaded, router]);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleLeave = () => {
    if (callObjectRef.current) {
      try {
        callObjectRef.current.leave();
      } catch {
        // ignore
      }
    }
    router.push('/dashboard/events');
  };

  // --- Loading State ---
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <LoadingSpinner text="Connecting securely to conference room..." />
      </div>
    );
  }

  // --- Paywall Barrier (403 Forbidden) ---
  if (paywallError) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card className="p-8 text-center space-y-6 border-gold/40 shadow-xl bg-gradient-to-b from-white to-gold/5">
          <div className="w-16 h-16 rounded-2xl bg-gold/15 border border-gold/30 text-gold-dark flex items-center justify-center mx-auto">
            <Lock size={32} />
          </div>

          <div className="space-y-2">
            <Badge variant="yellow" className="px-3 py-1 font-bold">
              Fair Pass Required
            </Badge>
            <h1 className="text-2xl font-black text-carbon">
              Verified 500 ETB Pass Needed
            </h1>
            <p className="text-sm text-dim-grey max-w-lg mx-auto leading-relaxed">
              {paywallError}
            </p>
          </div>

          <div className="bg-porcelain p-4 rounded-xl text-left border border-charcoal/10 space-y-2 text-xs text-dim-grey">
            <div className="flex items-center gap-2 text-carbon font-semibold">
              <ShieldCheck size={16} className="text-ocean" />
              <span>Why is this session protected?</span>
            </div>
            <p>
              Glory International Admissions Fair features exclusive direct breakout tracks
              with university delegates from the US, UK, Canada, and Europe. Access is strictly
              reserved for registered students with a verified application pass.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard/payments" className="w-full sm:w-auto">
              <Button variant="accent" className="w-full flex items-center gap-2">
                <CreditCard size={16} /> Complete or Verify Payment
              </Button>
            </Link>
            <Link href="/dashboard/events" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full">
                Back to Event Schedule
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // --- Time Gate Barrier (400 Bad Request / Early or Closed) ---
  if (timeGateError) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <Card className="p-8 text-center space-y-6 border-ocean/30 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-ocean/10 border border-ocean/20 text-ocean flex items-center justify-center mx-auto">
            <Clock size={32} />
          </div>

          <div className="space-y-2">
            <Badge variant="blue" className="px-3 py-1 font-bold">
              Scheduled Event
            </Badge>
            <h1 className="text-2xl font-black text-carbon">
              Room Not Open Yet
            </h1>
            <p className="text-sm text-dim-grey max-w-lg mx-auto leading-relaxed">
              {timeGateError}
            </p>
          </div>

          <div className="p-4 bg-porcelain rounded-xl border border-charcoal/10 max-w-md mx-auto flex items-center justify-center gap-3 text-sm text-carbon font-medium">
            <Calendar size={18} className="text-ocean" />
            <span>Opens automatically 15 minutes before start</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              className="w-full sm:w-auto"
            >
              Check Again
            </Button>
            <Link href="/dashboard/events" className="w-full sm:w-auto">
              <Button variant="secondary" className="w-full">
                Back to Schedule
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  // --- General Error State ---
  if (generalError || !roomData) {
    return (
      <div className="max-w-md mx-auto py-12 px-4 text-center space-y-4">
        <div className="p-4 bg-red-bg text-red-text rounded-2xl border border-red/20">
          <p className="text-sm font-semibold">{generalError || 'Unable to load conference room.'}</p>
        </div>
        <Link href="/dashboard/events">
          <Button variant="secondary" size="sm">
            <ArrowLeft size={14} /> Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  // --- Embedded Daily.co Conference Player ---
  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] -m-4 sm:-m-6 lg:-m-8 bg-carbon rounded-none sm:rounded-2xl overflow-hidden border border-charcoal/30 shadow-2xl">
      {/* Conference Room Top Bar */}
      <div className="bg-[#181816] text-white px-4 py-2.5 flex items-center justify-between border-b border-charcoal/20 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLeave}
            className="text-dim-grey hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
            title="Leave conference"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white tracking-tight">
                {roomData.eventName}
              </span>
              <Badge variant="green" className="py-0 px-2 text-[10px] flex items-center gap-1">
                <Radio size={10} className="animate-pulse" /> LIVE
              </Badge>
            </div>
            <p className="text-[11px] text-dim-grey font-medium flex items-center gap-1.5">
              <Video size={12} className="text-ocean" />
              <span>{roomData.sessionName}</span>
              <span>•</span>
              <span className="text-pale-sky font-mono">{roomData.displayName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleToggleFullscreen}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs bg-white/10 text-white hover:bg-white/20 border-white/10"
          >
            {isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </Button>
          <Button
            size="sm"
            onClick={handleLeave}
            className="text-xs bg-red hover:bg-red/90 text-white font-bold px-3 py-1.5"
          >
            Leave Room
          </Button>
        </div>
      </div>

      {/* Daily.co Call Frame Mount */}
      <div className="relative flex-1 w-full h-full bg-black">
        <div
          ref={callFrameRef}
          className="w-full h-full"
          style={{ minHeight: '450px' }}
        />
      </div>
    </div>
  );
}
