import * as React from 'react';
import { cn } from '@/lib/cn';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'muted';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'muted',
  children,
  ...props
}) => {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider',
        {
          'bg-primary/10 text-primary': variant === 'primary',
          'bg-secondary/10 text-secondary': variant === 'secondary',
          'bg-status-success/10 text-status-success': variant === 'success',
          'bg-status-info/10 text-status-info': variant === 'info',
          'bg-surface-muted text-on-surface-variant': variant === 'muted',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
