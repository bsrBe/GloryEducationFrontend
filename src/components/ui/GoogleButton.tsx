'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

interface GoogleButtonProps {
  onCredential: (credential: string) => void;
}

interface GoogleIdentity {
  accounts: {
    id: {
      initialize: (config: { client_id: string; callback: (res: { credential: string }) => void }) => void;
      renderButton: (el: HTMLElement, options: Record<string, unknown>) => void;
    };
  };
}

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Renders nothing until NEXT_PUBLIC_GOOGLE_CLIENT_ID is set.
export function GoogleButton({ onCredential }: GoogleButtonProps) {
  const container = useRef<HTMLDivElement>(null);
  const latestCallback = useRef(onCredential);
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    latestCallback.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    const google = (window as unknown as { google?: GoogleIdentity }).google;
    if (!CLIENT_ID || !scriptReady || !google || !container.current) return;
    google.accounts.id.initialize({
      client_id: CLIENT_ID,
      callback: (res) => latestCallback.current(res.credential),
    });
    google.accounts.id.renderButton(container.current, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      width: Math.min(container.current.offsetWidth || 320, 400),
    });
  }, [scriptReady]);

  if (!CLIENT_ID) return null;

  return (
    <div>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onReady={() => setScriptReady(true)}
      />
      <div ref={container} className="flex justify-center min-h-10" />
      <div className="flex items-center gap-3 my-4 text-xs text-dim-grey">
        <span className="flex-1 h-px bg-charcoal/15" />
        or
        <span className="flex-1 h-px bg-charcoal/15" />
      </div>
    </div>
  );
}
