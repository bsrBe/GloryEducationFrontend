import { InputHTMLAttributes, forwardRef } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-carbon"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={clsx(
            'w-full bg-surface border border-charcoal rounded-lg px-4 py-3 text-sm text-carbon outline-none transition-colors duration-200',
            'placeholder:text-dim-grey',
            'focus:border-ocean focus:shadow-[0_0_0_3px_color-mix(in_srgb,var(--focus-ring)_25%,transparent)]',
            error && 'border-red',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-red">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
