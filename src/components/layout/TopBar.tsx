'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function TopBar({ onMenuToggle }: { onMenuToggle?: () => void }) {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="h-16 bg-white border-b border-charcoal/20 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {onMenuToggle && (
          <button onClick={onMenuToggle} className="lg:hidden text-carbon">
            <Menu size={20} />
          </button>
        )}
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dim-grey" />
          <input
            type="text"
            placeholder="Search students, universities..."
            className="glory-input pl-9 py-2 w-64 lg:w-96"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-dim-grey hover:text-carbon transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red rounded-full" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-ocean flex items-center justify-center text-white text-sm font-semibold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-carbon">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-dim-grey capitalize">
              {user?.role.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
