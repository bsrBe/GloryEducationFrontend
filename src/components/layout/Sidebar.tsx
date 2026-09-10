'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { useAuthStore, type UserRole } from '@/stores/authStore';
import { Logo } from '@/components/ui';
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
  ChevronLeft,
  Sparkles,
  X,
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
  { label: 'Events & Fairs', href: '/dashboard/events', icon: <Calendar size={18} />, roles: ['student'] },
  { label: 'Messages', href: '/dashboard/messages', icon: <MessageSquare size={18} />, roles: ['student'] },

  // Glory Staff & Admin
  { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'Students Queue', href: '/admin/students', icon: <GraduationCap size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'Universities', href: '/admin/universities', icon: <Target size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'Events & Rooms', href: '/admin/events', icon: <Calendar size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'Bulk Email', href: '/admin/email', icon: <Sparkles size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'Audit Trail', href: '/admin/audit', icon: <ClipboardCheck size={18} />, roles: ['admin', 'glory_staff'] },
  { label: 'User Accounts', href: '/admin/users', icon: <Users size={18} />, roles: ['admin'] },

  // University Rep
  { label: 'Assigned Students', href: '/rep/assigned', icon: <GraduationCap size={18} />, roles: ['university_rep'] },
  { label: 'Review Portal', href: '/rep/portal', icon: <ClipboardCheck size={18} />, roles: ['university_rep'] },
];

export function Sidebar({
  collapsed,
  onToggle,
  mobile = false,
}: {
  collapsed: boolean;
  onToggle: () => void;
  mobile?: boolean;
}) {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const filtered = navItems.filter((item) => user && item.roles.includes(user.role));

  return (
    <aside
      className={clsx(
        'bg-gradient-to-b from-[#1e1e1d] via-carbon to-[#111110] text-white flex flex-col transition-all duration-300 border-r border-charcoal/30',
        // Mobile drawer: static-positioned inside the sliding panel, full height using dynamic viewport units
        mobile
          ? 'h-dvh w-64 shadow-xl'
          : clsx(
              'h-screen fixed left-0 top-0 z-40 shadow-xl',
              collapsed ? 'w-16' : 'w-64'
            )
      )}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between px-3.5 py-4 border-b border-charcoal/30 bg-black/20">
        {!collapsed && (
          <Logo
            href="/dashboard"
            size="sm"
            subtitle="Admissions Fair"
            inverted
            priority
          />
        )}
        {collapsed && (
          <Logo
            href="/dashboard"
            size="sm"
            showText={false}
            inverted
            priority
            className="mx-auto"
          />
        )}
        {mobile ? (
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-dim-grey hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close menu"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-dim-grey hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft
              size={16}
              className={clsx('transition-transform duration-300', collapsed && 'rotate-180')}
            />
          </button>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1.5">
        {filtered.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== '/dashboard' && item.href !== '/admin/analytics' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all duration-200 group relative',
                isActive
                  ? 'bg-gradient-to-r from-ocean to-ocean-dark text-white font-semibold shadow-glow-ocean'
                  : 'text-dim-grey hover:text-white hover:bg-white/5 hover:translate-x-0.5'
              )}
              title={collapsed ? item.label : undefined}
            >
              <span
                className={clsx(
                  'flex-shrink-0 transition-colors',
                  isActive ? 'text-white' : 'text-dim-grey group-hover:text-ocean'
                )}
              >
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
              {isActive && !collapsed && (
                <span className="w-1.5 h-1.5 rounded-full bg-gold ml-auto shrink-0 shadow-[0_0_8px_#f9bf31]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info & sign-out live in the TopBar avatar menu (UserMenu) —
          no duplicate footer here. Spacer keeps nav pinned to the top. */}
      <div className="flex-1" aria-hidden />
    </aside>
  );
}
