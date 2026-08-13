import * as React from 'react';
import { cn } from '@/lib/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          // Base styles with Emil Kowalski press scale (0.97) & fast cubic-bezier ease-out
          'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-150 ease-[cubic-bezier(0.23,1,0.32,1)] focus:outline-none focus:ring-2 focus:ring-orange-500/30 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none',
          {
            // Variants
            'bg-primary text-white hover:bg-primary-container shadow-sm hover:shadow-md border border-white/10': variant === 'primary',
            'bg-orange-600 text-white hover:bg-orange-700 shadow-sm hover:shadow-md hover:shadow-orange-500/20 border border-white/10': variant === 'secondary',
            'border border-gray-200 bg-white text-gray-900 hover:bg-gray-50 hover:border-gray-300 shadow-2xs': variant === 'outline',
            'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100/80': variant === 'ghost',
            // Sizes
            'text-xs px-3.5 py-1.5 rounded-lg': size === 'sm',
            'text-sm px-5 py-2.5 rounded-xl': size === 'md',
            'text-base px-6 py-3 rounded-xl': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

