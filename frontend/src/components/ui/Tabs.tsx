import * as React from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  id: string;
  label: string;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
}) => {
  return (
    <div className={cn('border-b border-border-subtle flex gap-6 overflow-x-auto scrollbar-none', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'pb-3.5 text-sm font-semibold whitespace-nowrap transition-all duration-200 border-b-2 border-transparent hover:text-primary active:scale-98',
              isActive
                ? 'text-primary border-primary'
                : 'text-on-surface-variant hover:border-border-subtle'
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
