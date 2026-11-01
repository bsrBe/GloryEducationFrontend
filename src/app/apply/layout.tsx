'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { Logo } from '@/components/ui';

const steps = [
  { label: 'Profile', short: 'Profile', href: '/apply/profile', step: 1 },
  { label: 'Documents', short: 'Docs', href: '/apply/documents', step: 2 },
  // [Payment disabled] { label: 'Payment', short: 'Pay', href: '/apply/payment', step: 3 },
  { label: 'Submit', short: 'Submit', href: '/apply/submit', step: 3 },
  { label: 'Review', short: 'Review', href: '/apply/review', step: 4 },
];

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIdx = steps.findIndex((s) => pathname.startsWith(s.href));
  const currentStep = currentIdx >= 0 ? currentIdx + 1 : 1;

  return (
    <div className="min-h-screen bg-porcelain flex flex-col">
      {/* Header */}
      <header className="bg-surface border-b border-line sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Logo href="/" size="sm" subtitle="Application" priority />
          <Link href="/login" className="text-sm font-medium text-carbon hover:text-ocean">
            Sign in
          </Link>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="apply-band relative overflow-hidden bg-navy text-on-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <p className="text-sm text-on-navy-muted mb-3">Step {currentStep} of {steps.length}</p>
          <div className="flex items-center justify-between lg:justify-start lg:gap-3">
            {steps.map((s, i) => {
              const isComplete = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  aria-current={isCurrent ? 'step' : undefined}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div
                    className={clsx(
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold',
                      isComplete && 'bg-gold text-navy',
                      isCurrent && 'bg-white text-navy ring-2 ring-gold ring-offset-2 ring-offset-navy',
                      !isComplete && !isCurrent && 'border border-on-navy-muted/60 text-on-navy-muted'
                    )}
                  >
                    {isComplete ? <Check size={14} /> : s.step}
                  </div>
                  {/* Short label stays visible on mobile so steps are identifiable; full label on sm+ */}
                  <span
                    className={clsx(
                      'text-[10px] sm:hidden font-semibold whitespace-nowrap',
                      isCurrent || isComplete ? 'text-on-navy' : 'text-on-navy-muted'
                    )}
                  >
                    {s.short}
                  </span>
                  <span
                    className={clsx(
                      'text-sm hidden sm:inline',
                      isCurrent ? 'text-on-navy font-semibold' : isComplete ? 'text-on-navy' : 'text-on-navy-muted'
                    )}
                  >
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={clsx(
                        'w-3 sm:w-10 h-0.5 sm:mx-1',
                        isComplete ? 'bg-gold' : 'bg-on-navy-muted/30'
                      )}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-navy py-4 text-center">
        <p className="text-pale-sky text-xs">Veridan Education © 2026</p>
        <p className="text-pale-sky text-xs mt-1 space-x-4">
          <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white">Terms of Service</Link>
        </p>
      </footer>
    </div>
  );
}
