import clsx from 'clsx';
import { ReactNode } from 'react';

type BadgeVariant = 'green' | 'yellow' | 'red' | 'blue' | 'grey';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  green: 'badge-green',
  yellow: 'badge-yellow',
  red: 'badge-red',
  blue: 'badge-blue',
  grey: 'badge-grey',
};

export function Badge({ variant = 'blue', children, className }: BadgeProps) {
  return (
    <span className={clsx('badge', variantClasses[variant], className)}>
      {children}
    </span>
  );
}
