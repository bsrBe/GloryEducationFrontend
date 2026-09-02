'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { Check } from 'lucide-react';
import { Logo } from '@/components/ui';

const steps = [
  { label: 'Profile', href: '/apply/profile', step: 1 },
  { label: 'Documents', href: '/apply/documents', step: 2 },
  { label: 'Payment', href: '/apply/payment', step: 3 },
  { label: 'Review', href: '/apply/review', step: 4 },
];

export default function ApplyLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const currentIdx = steps.findIndex((s) => pathname.startsWith(s.href));
  const currentStep = currentIdx >= 0 ? currentIdx + 1 : 1;

  return (
    <div className="min-h-screen bg-porcelain">
      {/* Header */}
      <header className="bg-white border-b border-charcoal/10 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Logo href="/" size="sm" subtitle="Applicant Portal" priority />
          <div className="flex items-center gap-3">
            <span className="text-xs sm:text-sm text-dim-grey hidden sm:inline">
              Step {currentStep} of {steps.length}
            </span>
            <Link href="/login">
              <button className="btn-primary text-sm py-2 px-4">Login</button>
            </Link>
          </div>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="bg-white border-b border-charcoal/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {steps.map((s, i) => {
              const isComplete = currentStep > s.step;
              const isCurrent = currentStep === s.step;
              return (
                <Link
                  key={s.href}
                  href={s.href}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  <div
                    className={clsx(
                      'w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors',
                      isComplete
                        ? 'bg-ocean text-white'
                        : isCurrent
                        ? 'bg-ocean text-white ring-2 ring-ocean/30'
                        : 'bg-pale-sky text-dim-grey'
                    )}
                  >
                    {isComplete ? <Check size={14} /> : s.step}
                  </div>
                  <span
                    className={clsx(
                      'text-xs sm:text-sm font-medium hidden sm:inline',
                      isCurrent ? 'text-ocean' : isComplete ? 'text-carbon' : 'text-dim-grey'
                    )}
                  >
                    {s.label}
                  </span>
                  {i < steps.length - 1 && (
                    <div
                      className={clsx(
                        'w-6 sm:w-12 h-0.5 mx-1',
                        isComplete ? 'bg-ocean' : 'bg-pale-sky'
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
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-carbon py-4 text-center">
        <p className="text-dim-grey text-xs">Glory Educational Consultancy © 2026</p>
      </footer>
    </div>
  );
}
