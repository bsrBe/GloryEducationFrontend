'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import clsx from 'clsx';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loadFromStorage } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    // Check auth after hydration
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [user, router]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close the mobile drawer whenever the viewport grows to desktop size
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setMobileMenuOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-porcelain flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-ocean border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-porcelain">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      {/* Mobile Sidebar Drawer */}
      <div
        className={clsx(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-200',
          mobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden={!mobileMenuOpen}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
        {/* Slide-in panel; h-dvh keeps the Sign Out button above mobile browser chrome */}
        <div
          className={clsx(
            'absolute left-0 top-0 h-dvh transition-transform duration-300 ease-out',
            mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar
            collapsed={false}
            onToggle={() => setMobileMenuOpen(false)}
            mobile
          />
        </div>
      </div>

      {/* Main Content */}
      <div
        className={clsx(
          'transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-60'
        )}
      >
        <TopBar onMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} />
        <main className="p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
