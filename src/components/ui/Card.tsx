import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  hoverable?: boolean;
  glass?: boolean;
  glow?: 'ocean' | 'gold' | 'none';
}

export function Card({
  children,
  className,
  padding = true,
  hoverable = false,
  glass = false,
  glow = 'none',
}: CardProps) {
  return (
    <div
      className={clsx(
        glass ? 'glass-card' : 'bg-white border border-charcoal/15 rounded-2xl shadow-sm',
        hoverable && 'card-hoverable cursor-pointer',
        glow === 'ocean' && 'shadow-glow-ocean border-ocean/30',
        glow === 'gold' && 'shadow-glow-gold border-gold/30',
        padding && 'p-6',
        className
      )}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-ocean to-ocean-dark text-white rounded-t-2xl px-6 py-4 font-semibold shadow-sm',
        className
      )}
    >
      {children}
    </div>
  );
}
