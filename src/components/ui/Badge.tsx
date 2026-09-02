import clsx from 'clsx';
import { ReactNode } from 'react';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'grey' | 'gold';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  blue: 'badge-blue',
  grey: 'badge-grey',
  gold: 'badge-yellow',
};

const dotColorClasses: Record<BadgeVariant, string> = {
  green: 'bg-green animate-pulse',
  yellow: 'bg-gold-dark animate-pulse',
  red: 'bg-red animate-pulse',
  blue: 'bg-ocean animate-pulse',
  grey: 'bg-dim-grey',
  gold: 'bg-gold-dark animate-pulse',
};

export function Badge({ variant = 'blue', children, className, dot = false }: BadgeProps) {
  return (
    <span className={clsx('badge select-none', variantClasses[variant], className)}>
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', dotColorClasses[variant])} />}
      {children}
    </span>
  );
}
