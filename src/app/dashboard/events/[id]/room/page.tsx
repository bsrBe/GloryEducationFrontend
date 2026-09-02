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

declare global {
  interface Window {
    JitsiMeetExternalAPI?: any;
  }
}

interface RoomData {
  domain: string;
  roomName: string;
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
  const jitsiContainerRef = useRef<HTMLDivElement>(null);
  const jitsiApiRef = useRef<any>(null);

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paywallError, setPaywallError] = useState<string | null>(null);
  const [timeGateError, setTimeGateError] = useState<string | null>(null);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [jitsiScriptLoaded, setJitsiScriptLoaded] = useState(false);

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

  // 2. Load Jitsi External API Script Dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.JitsiMeetExternalAPI) {
      setJitsiScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://meet.jit.si/external_api.js';
    script.async = true;
    script.onload = () => {
      setJitsiScriptLoaded(true);
    };
    script.onerror = () => {
      setGeneralError('Failed to load video conferencing library. Please check your network connection.');
    };
    document.body.appendChild(script);

    return () => {
      // Keep script in head for performance if user navigates back
    };
  }, []);

  // 3. Mount and Initialize Jitsi Meet IFrame when Data and Script are Ready
  useEffect(() => {
    if (!roomData || !jitsiScriptLoaded || !jitsiContainerRef.current) return;

    // Destroy existing instance if any
    if (jitsiApiRef.current) {
      jitsiApiRef.current.dispose();
      jitsiApiRef.current = null;
    }

    // Clean container before mount
    jitsiContainerRef.current.innerHTML = '';

    const domain = roomData.domain || 'meet.jit.si';
    const options = {
      roomName: roomData.roomName,
      width: '100%',
      height: '100%',
      parentNode: jitsiContainerRef.current,
      userInfo: {
        displayName: roomData.displayName,
        email: roomData.email,
      },
      configOverwrite: {
        prejoinPageEnabled: false,
        startWithAudioMuted: true,
        startWithVideoMuted: false,
        enableNoisyMicDetection: false,
        enableClosePage: false,
        disableRemoteMute: !roomData.isModerator,
        disableInviteFunctions: true,
        hideConferenceSubject: false,
        subject: `${roomData.eventName} — ${roomData.sessionName}`,
      },
      interfaceConfigOverwrite: {
        APP_NAME: 'Glory Admissions Fair',
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        SHOW_POWERED_BY: false,
        HIDE_INVITE_MORE_HEADER: true,
        MOBILE_APP_PROMO: false,
        TOOLBAR_BUTTONS: [
          'microphone',
          'camera',
          'desktop',
          'fullscreen',
          'chat',
          'raisehand',
          'tileview',
          'videoquality',
          'fodeviceselection',
          'settings',
          'hangup',
        ],
      },
    };

    try {
      const api = new window.JitsiMeetExternalAPI(domain, options);
      jitsiApiRef.current = api;

      api.executeCommand('displayName', roomData.displayName);

      api.addEventListeners({
        readyToClose: () => {
          router.push('/dashboard/events');
        },
        videoConferenceLeft: () => {
          router.push('/dashboard/events');
        },
      });
    } catch (error) {
      console.error('Error initializing Jitsi Meet:', error);
      setGeneralError('Failed to launch video room player.');
    }

    return () => {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch {
          // ignore cleanup errors
        }
        jitsiApiRef.current = null;
      }
    };
  }, [roomData, jitsiScriptLoaded, router]);

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
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand('hangup');
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

  // --- Embedded Live Conference Player ---
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

      {/* Embedded Jitsi Meeting Iframe Mount */}
      <div className="relative flex-1 w-full h-full bg-black">
        <div
          ref={jitsiContainerRef}
          className="w-full h-full"
          style={{ minHeight: '450px' }}
        />
      </div>
    </div>
  );
}
