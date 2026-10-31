import { useEffect, useRef } from 'react';

/**
 * Re-runs `callback` every `intervalMs` while the tab is visible,
 * and immediately when the tab regains focus. Used to keep admin
 * views in sync with new registrations without a manual refresh.
 */
export function usePolling(callback: () => void, intervalMs = 10000) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') savedCallback.current();
    };
    const id = window.setInterval(tick, intervalMs);
    document.addEventListener('visibilitychange', tick);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [intervalMs]);
}
