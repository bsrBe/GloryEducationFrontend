'use client';

import { useState } from 'react';
import clsx from 'clsx';
import 'flag-icons/css/flag-icons.min.css';
import { destinations, regions, type Region } from '@/lib/destinations';

export function Destinations() {
  const [region, setRegion] = useState<Region | 'all'>('all');
  const visible = region === 'all' ? destinations : destinations.filter((d) => d.region === region);
  const filters = [{ value: 'all' as const, label: 'All countries' }, ...regions];

  return (
    <>
      <div role="group" aria-label="Filter by region" className="flex flex-wrap gap-2 mt-8">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            aria-pressed={region === filter.value}
            onClick={() => setRegion(filter.value)}
            className={clsx(
              'px-4 py-2 rounded-full text-sm font-medium border cursor-pointer',
              region === filter.value
                ? 'bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] border-transparent'
                : 'bg-transparent text-carbon border-charcoal/40 hover:border-ocean'
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} countries
      </p>

      <ul className="mt-8 grid md:grid-cols-2 gap-x-12 border-t border-line">
        {visible.map((destination) => (
          <li key={destination.value} className="flex gap-4 py-6 border-b border-line">
            <span
              className={`fi fi-${destination.flag} shrink-0 mt-1 rounded-sm`}
              style={{ width: 36, height: 27, lineHeight: '27px' }}
              aria-hidden="true"
            />
            <div>
              <h3 className="font-display font-semibold text-lg text-black">{destination.name}</h3>
              <p className="text-sm text-dim-grey mt-1 leading-relaxed">{destination.description}</p>
              {destination.universities.length > 0 ? (
                <p className="text-sm text-carbon mt-2">{destination.universities.join(', ')}</p>
              ) : (
                <p className="text-sm text-gold-dark mt-2">Partner universities coming soon</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
