import { SelectHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-carbon">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={clsx(
            'w-full bg-surface border border-charcoal rounded-lg px-4 py-3 pr-10 text-sm text-carbon outline-none appearance-none transition-colors duration-200',
            'select-chevron',
            'focus:border-ocean focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--focus-ring)_25%,transparent)]',
            error && 'border-red',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-red">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
