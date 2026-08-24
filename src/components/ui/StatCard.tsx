import { ReactNode } from 'react';
import clsx from 'clsx';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtext?: string;
  color?: 'ocean' | 'gold' | 'green' | 'red';
}

const colorMap = {
  ocean: 'text-ocean',
  gold: 'text-gold',
  green: 'text-green',
  red: 'text-red',
};

export function StatCard({ icon, label, value, subtext, color = 'ocean' }: StatCardProps) {
  return (
    <div className="card flex items-start gap-4">
      <div className={clsx('text-2xl mt-1', colorMap[color])}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-dim-grey">{label}</p>
        <p className="text-2xl font-bold text-carbon">{value}</p>
        {subtext && <p className="text-xs text-dim-grey mt-1">{subtext}</p>}
      </div>
    </div>
  );
}
