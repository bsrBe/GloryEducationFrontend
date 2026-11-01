import Image from 'next/image';
import { ReactNode } from 'react';
import { Logo } from '@/components/ui';

// Sign-in pages share the landing hero's look: the form beside the diagonal photo.
export function AuthShell({ title, intro, children }: { title: string; intro?: string; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden min-h-screen bg-surface">
      <div className="relative z-10 flex flex-col min-h-screen w-full lg:w-[46%] px-4 sm:px-8 lg:px-12 py-6">
        <Logo href="/" size="sm" priority />
        <main className="flex-1 flex items-center py-10">
          <div className="w-full max-w-md mx-auto lg:mx-0">
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-black tracking-tight">{title}</h1>
            {intro && <p className="mt-3 text-dim-grey leading-relaxed">{intro}</p>}
            <div className="mt-8">{children}</div>
          </div>
        </main>
      </div>
      <div className="hidden lg:block hero-photo-frame">
        <Image
          src="/images/webinar-classroom.jpg"
          alt="Students watching a presenter explain university requirements at a Veridan session"
          fill
          priority
          sizes="52vw"
          className="hero-photo"
        />
      </div>
    </div>
  );
}
