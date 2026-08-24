'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore, type UserRole } from '@/stores/authStore';
import {
  LayoutDashboard,
  User,
  CreditCard,
  FileText,
  Target,
  ClipboardCheck,
  Calendar,
  MessageSquare,
  Users,
  BarChart3,
  GraduationCap,
  Settings,
  ChevronLeft,
  LogOut,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  // Student
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard size={18} />, roles: ['student'] },
  { label: 'My Profile', href: '/dashboard/profile', icon: <User size={18} />, roles: ['student'] },
  { label: 'Payments', href: '/dashboard/payments', icon: <CreditCard size={18} />, roles: ['student'] },
  { label: 'Documents', href: '/dashboard/documents', icon: <FileText size={18} />, roles: ['student'] },
  { label: 'Results', href: '/dashboard/results', icon: <ClipboardCheck size={18} />, roles: ['student'] },
  { label: 'Events', href: '/dashboard/events', icon: <Calendar size={18} />, roles: ['student'] },
  { label: 'Messages', href: '/dashboard/messages', icon: <MessageSquare size={18} />, roles: ['student'] },

  // Glory Staff & Admin
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'Students', href: '/admin/analytics', icon: <GraduationCap size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'User Management', href: '/admin/users', icon: <Users size={18} />, roles: ['admin'] },

  // University Rep
  { label: 'Assigned Students', href: '/rep/assigned', icon: <GraduationCap size={18} />, roles: ['university_rep'] },
  { label: 'Review Portal', href: '/rep/portal', icon: <ClipboardCheck size={18} />, roles: ['university_rep'] },
];

export function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const filtered = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside
      className={clsx(
        'h-screen bg-carbon text-white flex flex-col transition-all duration-300 fixed left-0 top-0 z-40',
        collapsed ? 'w-16' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-charcoal">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-xl">🎓</span>
            <span className="font-display font-bold text-sm">GLORY</span>
          </div>
        )}
        {collapsed && <span className="text-xl mx-auto">🎓</span>}
        <button
          onClick={onToggle}
          className="text-dim-grey hover:text-white transition-colors"
        >
          <ChevronLeft
            size={18}
            className={clsx('transition-transform', collapsed && 'rotate-180')}
          />
        </button>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4">
        {filtered.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && item.href !== '/admin/analytics' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-ocean text-white'
                  : 'text-dim-grey hover:text-white hover:bg-charcoal/50'
              )}
              title={collapsed ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-charcoal p-3">
        {!collapsed && user && (
          <div className="flex items-center gap-3 px-2 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-ocean flex items-center justify-center text-white text-sm font-semibold">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-xs text-dim-grey capitalize">{user.role.replace('_', ' ')}</p>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-dim-grey hover:text-white hover:bg-charcoal/50 transition-colors"
          title="Logout"
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
