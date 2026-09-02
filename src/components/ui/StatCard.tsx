import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'ocean' | 'gold' | 'green' | 'red';
  className?: string;
}

const colorMap = {
  ocean: {
    iconBg: 'bg-ocean/10 text-ocean border-ocean/20',
    accent: 'border-l-ocean',
  },
  gold: {
    iconBg: 'bg-gold/15 text-gold-dark border-gold/30',
    accent: 'border-l-gold',
  },
  green: {
    iconBg: 'bg-green/10 text-green border-green/20',
    accent: 'border-l-green',
  },
  red: {
    iconBg: 'bg-red/10 text-red border-red/20',
    accent: 'border-l-red',
  },
};

export function StatCard({
  icon,
  label,
  value,
  subtext,
  color = 'ocean',
  className,
}: StatCardProps) {
  const styles = colorMap[color];
  return (
    <div
      className={clsx(
        'card card-hoverable p-5 flex items-start gap-4 transition-all duration-300 relative overflow-hidden',
        className
      )}
    >
      <div
        className={clsx(
          'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-transform duration-300 group-hover:scale-110',
          styles.iconBg
        )}
      >
        <div className="text-xl">{icon}</div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-dim-grey mb-0.5 truncate">
          {label}
        </p>
        <p className="text-2xl sm:text-3xl font-extrabold text-carbon tracking-tight">{value}</p>
        {subtext && <p className="text-xs text-dim-grey mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
