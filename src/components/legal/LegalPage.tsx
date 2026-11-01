import Link from 'next/link';
import { ReactNode } from 'react';
import { Logo } from '@/components/ui';

export const CONTACT_EMAIL = 'bsr7349@gmail.com';
export const LAST_UPDATED = 'November 1, 2026';

export function ContactLink() {
  return (
    <a href={`mailto:${CONTACT_EMAIL}`} className="text-ocean underline">
      {CONTACT_EMAIL}
    </a>
  );
}

export function LegalSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display font-semibold text-xl text-black">{title}</h2>
      <div className="mt-3 space-y-3 text-carbon leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2">
        {children}
      </div>
    </section>
  );
}

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  return (
    <div className="landing min-h-screen bg-porcelain text-carbon">
      <header className="bg-surface border-b border-line">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          <Logo href="/" size="sm" />
          <Link href="/" className="text-sm font-medium text-carbon hover:text-ocean">
            Back to home
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="font-display font-bold text-3xl sm:text-4xl text-black tracking-tight">{title}</h1>
        <p className="mt-2 text-sm text-dim-grey">Last updated: {LAST_UPDATED}</p>
        <p className="mt-6 text-lg text-dim-grey leading-relaxed">{intro}</p>
        {children}
      </main>

      <footer className="bg-navy text-on-navy-muted">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between gap-3 text-sm">
          <p>© 2026 Veridan Education</p>
          <nav aria-label="Legal" className="flex gap-6">
            <Link href="/privacy" className="hover:text-on-navy">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-on-navy">Terms of Service</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
