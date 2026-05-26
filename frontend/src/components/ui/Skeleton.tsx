import * as React from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rect',
  ...props
}) => {
  return (
    <div
      className={cn(
        'animate-pulse bg-surface-muted',
        {
          'h-4 w-full rounded': variant === 'text',
          'rounded-lg': variant === 'rect',
          'rounded-full': variant === 'circle',
        },
        className
      )}
      {...props}
    />
  );
};
