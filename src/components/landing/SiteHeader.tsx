'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/ui';

const links = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#why-veridan', label: 'Why Veridan' },
  { href: '#destinations', label: 'Destinations' },
  { href: '#faq', label: 'FAQ' },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-surface border-b border-line">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
        <Logo href="/" size="sm" priority />

        <nav aria-label="Main" className="hidden lg:flex items-center gap-7 text-sm font-medium text-carbon">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover:text-ocean">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/login" className="hidden sm:inline text-sm font-medium text-carbon hover:text-ocean">
            Sign in
          </Link>
          <a href="#register" className="btn-accent text-sm px-3.5 py-2 sm:px-5 sm:py-2.5">
            <span className="sm:hidden">Register</span>
            <span className="hidden sm:inline">Register for the next webinar</span>
          </a>
          <button
            type="button"
            className="lg:hidden p-2 text-carbon"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="lg:hidden border-t border-line bg-surface px-4 py-2">
          {[...links, { href: '/login', label: 'Sign in' }].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block py-3 text-base font-medium text-carbon"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
