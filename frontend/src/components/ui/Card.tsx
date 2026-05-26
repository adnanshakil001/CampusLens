import * as React from 'react';
import { cn } from '@/lib/cn';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hoverable = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'bg-surface border border-border-subtle rounded-xl p-5 shadow-sm overflow-hidden transition-all duration-300',
          {
            'hover:shadow-md hover:border-outline/30 hover:-translate-y-0.5': hoverable,
          },
          className
        )}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';
