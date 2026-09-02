'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 bg-white/85 backdrop-blur-md border-b border-charcoal/15 flex items-center justify-between px-6 sticky top-0 z-30 transition-all">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg text-carbon hover:bg-porcelain transition-colors cursor-pointer"
            title="Toggle Menu"
          >
            <Menu size={20} />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dim-grey" />
          <input
            type="text"
            placeholder="Search students, programs, universities..."
            className="glory-input pl-9.5 pr-12 py-2 w-64 lg:w-96 text-xs bg-porcelain/60 focus:bg-white"
          />
          <kbd className="hidden lg:inline-block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-dim-grey/70 bg-white border border-charcoal/20 px-1.5 py-0.5 rounded">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          className="relative p-2 rounded-xl text-dim-grey hover:text-carbon hover:bg-porcelain transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red rounded-full ring-2 ring-white animate-pulse" />
        </button>

        <div className="h-6 w-px bg-charcoal/20 hidden sm:block" />

        <div className="flex items-center gap-3 pl-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean to-ocean-dark flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-ocean/20">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-semibold text-carbon leading-tight">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[11px] text-dim-grey capitalize leading-tight">
              {user?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
