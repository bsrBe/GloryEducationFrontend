import { ReactNode } from 'react';

export function ApplyHeading({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div>
      <h1 className="font-display font-bold text-3xl sm:text-4xl text-black tracking-tight">{title}</h1>
      {children && <div className="mt-3 text-dim-grey leading-relaxed max-w-2xl">{children}</div>}
    </div>
  );
}

// Same gold rule as the steps on the landing page, instead of a stack of cards.
export function ApplySection({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <section className="border-t-2 border-gold pt-5 grid lg:grid-cols-[1fr_2.4fr] gap-5 lg:gap-10">
      <div>
        <h2 className="font-display font-semibold text-xl text-black">{title}</h2>
        {hint && <p className="text-sm text-dim-grey mt-1 leading-relaxed">{hint}</p>}
      </div>
      <div className="min-w-0">{children}</div>
    </section>
  );
}
