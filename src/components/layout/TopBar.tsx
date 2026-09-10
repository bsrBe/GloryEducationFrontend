'use client';

import { Search, Bell } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { UserMenu } from './UserMenu';

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-charcoal/15 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4 min-w-0">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 -ml-2 rounded-lg text-carbon hover:bg-porcelain transition-colors cursor-pointer"
            title="Toggle Menu"
            aria-label="Toggle navigation menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        )}
        {/* Search is disabled until wired to a real endpoint — hidden to avoid implying functionality */}
        {false && (
          <div className="relative hidden sm:block">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim-grey" />
            <input
              type="text"
              placeholder="Search students, programs, universities..."
              className="glory-input pl-9.5 pr-12 py-2 w-64 lg:w-96 text-xs bg-porcelain/60 focus:bg-white"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          className="relative p-2 rounded-xl text-dim-grey hover:text-carbon hover:bg-porcelain transition-all cursor-pointer"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Notification indicator hidden until the notifications feature is wired up */}
          {false && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full ring-2 ring-white animate-pulse" />
          )}
        </button>

        <div className="h-6 w-px bg-charcoal/20 hidden sm:block" />

        {/* Avatar → account popover (profile info, phone change, logout) */}
        <UserMenu />
      </div>
    </header>
  );
}
