'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/authStore';
import api from '@/lib/api';
import { Button, Input } from '@/components/ui';
import {
  User as UserIcon,
  Phone,
  LogOut,
  X,
  ChevronDown,
  IdCard,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';

export function UserMenu() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [savingPhone, setSavingPhone] = useState(false);
  const [phoneFeedback, setPhoneFeedback] = useState<{ ok: boolean; msg: string } | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  // Keep local phone draft in sync with the store
  useEffect(() => {
    if (user) setPhone(user.phone || '');
  }, [user]);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
        setEditingPhone(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        setEditingPhone(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const isStudent = user.role === 'student';
  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`;

  const handleSavePhone = async () => {
    if (!phone.trim()) {
      setPhoneFeedback({ ok: false, msg: 'Phone number is required' });
      return;
    }
    setSavingPhone(true);
    setPhoneFeedback(null);
    try {
      if (isStudent) {
        await api.patch(`/students/${user._id}/profile`, { phone: phone.trim() });
      } else {
        await api.patch('/users/me', { phone: phone.trim() });
      }
      // Refresh stored user so the menu + TopBar reflect the new number
      const updated = { ...user, phone: phone.trim() };
      localStorage.setItem('user', JSON.stringify(updated));
      useAuthStore.setState({ user: updated });
      setPhoneFeedback({ ok: true, msg: 'Phone number updated' });
      setTimeout(() => {
        setEditingPhone(false);
        setPhoneFeedback(null);
      }, 1200);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update phone number';
      setPhoneFeedback({ ok: false, msg });
    } finally {
      setSavingPhone(false);
    }
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    router.push('/login');
  };

  const roleLabel = user.role.replace('_', ' ');

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger — the avatar button in the TopBar */}
      <button
        onClick={() => {
          setOpen((o) => !o);
          setEditingPhone(false);
          setPhoneFeedback(null);
        }}
        className="flex items-center gap-1.5 rounded-xl p-1 pr-1.5 hover:bg-porcelain transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean/40"
        aria-haspopup="menu"
        aria-expanded={open}
        title="Account menu"
      >
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean to-ocean-dark flex items-center justify-center text-white text-xs font-bold shadow-sm ring-2 ring-ocean/20">
          {initials}
        </div>
        <ChevronDown
          size={14}
          className={clsx(
            'hidden sm:block text-dim-grey transition-transform duration-200',
            open && 'rotate-180'
          )}
        />
      </button>

      {/* Popover */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-charcoal/15 overflow-hidden z-[60] animate-fade-in origin-top-right"
        >
          {/* Basic info header */}
          <div className="bg-gradient-to-r from-carbon via-[#242422] to-carbon text-white p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-ocean to-ocean-dark flex items-center justify-center text-white text-sm font-bold ring-2 ring-gold/40 shrink-0">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-[11px] text-dim-grey truncate">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-dim-grey hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
                title="Close menu"
              >
                <X size={16} />
              </button>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-gold bg-gold/10 border border-gold/20 px-2 py-0.5 rounded-md capitalize">
                {isStudent ? <GraduationCap size={12} /> : <Briefcase size={12} />}
                {roleLabel}
              </span>
              {isStudent && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold text-pale-sky bg-white/5 border border-white/10 px-2 py-0.5 rounded-md">
                  <IdCard size={12} />
                  {user.studentId || 'GH26-PENDING'}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            {isStudent ? (
              <Link
                href="/dashboard/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-carbon hover:bg-porcelain transition-colors"
              >
                <UserIcon size={16} className="text-ocean" />
                Manage Profile
              </Link>
            ) : (
              <div className="px-3 py-2 text-xs text-dim-grey flex items-start gap-2">
                <UserIcon size={14} className="text-ocean mt-0.5 shrink-0" />
                <span>
                  Profile details are managed by Glory admin. You can update your phone number
                  below.
                </span>
              </div>
            )}

            {/* Phone number section */}
            <div className="mt-1 px-3 py-2">
              {!editingPhone ? (
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <Phone size={16} className="text-ocean shrink-0" />
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-dim-grey font-semibold">
                        Phone
                      </p>
                      <p className="text-sm text-carbon truncate">
                        {user.phone || 'Not set'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPhone(true);
                      setPhoneFeedback(null);
                    }}
                    className="text-xs font-bold text-ocean hover:underline px-2 py-1.5 rounded-lg hover:bg-ocean/5 transition-colors shrink-0 cursor-pointer"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251911223344"
                    autoFocus
                  />
                  {phoneFeedback && (
                    <p
                      className={clsx(
                        'text-xs font-semibold flex items-center gap-1',
                        phoneFeedback.ok ? 'text-green-text' : 'text-red-text'
                      )}
                    >
                      {phoneFeedback.ok ? (
                        <CheckCircle2 size={13} />
                      ) : (
                        <XCircle size={13} />
                      )}
                      {phoneFeedback.msg}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    <Button size="sm" onClick={handleSavePhone} loading={savingPhone} className="text-xs">
                      Save
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingPhone(false);
                        setPhoneFeedback(null);
                        setPhone(user.phone || '');
                      }}
                      className="text-xs"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer: logout */}
          <div className="border-t border-charcoal/10 p-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-semibold text-red hover:bg-red/10 transition-colors cursor-pointer"
            >
              {savingPhone ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <LogOut size={16} />
              )}
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
