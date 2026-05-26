import * as React from 'react';
import { cn } from '@/lib/cn';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, label, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-semibold text-on-surface-variant">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full bg-white border border-border-subtle rounded-lg px-4 py-2.5 text-sm text-on-surface transition-all duration-200 outline-none placeholder:text-outline/70 focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:opacity-50 disabled:bg-surface-muted',
            {
              'border-error focus:border-error focus:ring-error/10': error,
            },
            className
          )}
          {...props}
        />
        {error && (
          <span className="text-xs text-error font-medium mt-0.5">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
