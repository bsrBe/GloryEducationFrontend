import { ReactNode } from 'react';
import clsx from 'clsx';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={clsx(
        'bg-white border border-charcoal rounded-xl shadow-md',
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
        'bg-ocean text-white rounded-t-xl px-6 py-4 font-semibold',
        className
      )}
    >
      {children}
    </div>
  );
}
