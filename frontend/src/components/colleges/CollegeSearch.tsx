'use client';

import * as React from 'react';
import { Search, Sparkles, TrendingUp, X, ArrowUpRight } from 'lucide-react';
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
  const [isFocused, setIsFocused] = React.useState(false);
  const searchContainerRef = React.useRef<HTMLDivElement>(null);

  const autocompleteSuggestions = [
    { title: 'IIT Bombay', category: 'Top Engineering', query: 'IIT Bombay' },
    { title: 'BITS Pilani', category: 'Deemed University', query: 'BITS Pilani' },
    { title: 'NIT Trichy', category: 'Government NIT', query: 'NIT Trichy' },
    { title: 'Computer Science & Engineering', category: 'Popular Course', query: 'Computer Science' },
    { title: 'JEE Main Cutoff Ranks', category: 'Predictor Search', query: 'JEE Main' },
  ];

  // Sync internal state with prop changes
  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced search trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange]);

  // Close dropdown on outside click
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectSuggestion = (query: string) => {
    setLocalValue(query);
    onChange(query);
    setIsFocused(false);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div ref={searchContainerRef} className="relative w-full z-30">
      
      {/* Search Input Box */}
      <div 
        className={cn(
          'relative w-full rounded-2xl border border-gray-200/90 bg-white/95 backdrop-blur-xl shadow-sm transition-all duration-200 focus-within:ring-4 focus-within:ring-orange-500/20 focus-within:border-orange-500/50',
          isFocused && 'shadow-lg border-orange-500/40',
          className
        )}
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
          <Search size={19} className={cn('transition-colors', isFocused && 'text-orange-600')} />
        </div>
        
        <input
          type="text"
          value={localValue}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => setLocalValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-10 py-3.5 bg-transparent text-sm sm:text-base font-semibold text-gray-900 placeholder:text-gray-400 outline-none border-none"
        />

        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-700 transition-colors active:scale-95 cursor-pointer"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Autocomplete Suggestions Dropdown (Origin-Aware Top Entrance) */}
      {isFocused && (
        <div 
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-2xl border border-gray-200/90 rounded-2xl shadow-2xl p-2 z-50 animate-scale-in transition-all duration-150 origin-top"
        >
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles size={12} className="text-orange-500" />
              Quick Suggestions
            </span>
            <span>Press Esc to close</span>
          </div>

          <div className="py-1">
            {autocompleteSuggestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectSuggestion(item.query)}
                className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-orange-50/70 transition-colors flex items-center justify-between group active:scale-[0.99] cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp size={15} className="text-gray-400 group-hover:text-orange-600 transition-colors" />
                  <span className="text-sm font-bold text-gray-900 group-hover:text-orange-950">{item.title}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-gray-400 bg-gray-100 group-hover:bg-orange-100 group-hover:text-orange-800 px-2 py-0.5 rounded-md transition-colors">
                    {item.category}
                  </span>
                  <ArrowUpRight size={14} className="text-gray-400 group-hover:text-orange-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

