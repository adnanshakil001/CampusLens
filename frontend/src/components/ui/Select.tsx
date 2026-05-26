import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, options, label, error, ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'w-full bg-white border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-on-surface transition-all duration-200 outline-none appearance-none cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 disabled:bg-surface-muted',
              {
                'border-error focus:border-error focus:ring-error/10': error,
              },
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
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-on-surface-variant">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        {error && (
          <span className="text-xs text-error font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
