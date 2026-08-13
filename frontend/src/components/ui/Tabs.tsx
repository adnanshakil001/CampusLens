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
    <div className={cn('border-b border-gray-200 flex gap-6 overflow-x-auto custom-scrollbar scrollbar-none', className)}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={cn(
              'relative pb-3.5 text-sm font-extrabold whitespace-nowrap transition-all duration-150 ease-out active:scale-[0.98] cursor-pointer select-none',
              isActive
                ? 'text-orange-600'
                : 'text-gray-500 hover:text-gray-900'
            )}
          >
            <span>{tab.label}</span>
            {isActive && (
              <span className="absolute bottom-0 inset-x-0 h-0.5 bg-orange-600 rounded-full transition-all duration-200 ease-out" />
            )}
          </button>
        );
      })}
    </div>
  );
};

