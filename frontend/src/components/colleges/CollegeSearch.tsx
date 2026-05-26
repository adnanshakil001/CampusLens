'use client';

import * as React from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/cn';

interface CollegeSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CollegeSearch: React.FC<CollegeSearchProps> = ({
  value,
  onChange,
  placeholder = 'Search by college name, city, state, or course...',
  className,
}) => {
  const [localValue, setLocalValue] = React.useState(value);

  // Sync internal state with prop changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 400);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  return (
    <div className={cn('relative w-full shadow-sm rounded-xl overflow-hidden border border-border-subtle bg-white transition-all duration-300 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary', className)}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-outline">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-transparent text-sm text-on-surface placeholder:text-outline/70 font-semibold outline-none border-none"
      />
    </div>
  );
};
