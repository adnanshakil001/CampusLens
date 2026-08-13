'use client';

import * as React from 'react';
import { Filter, RotateCcw, Landmark, DollarSign, Star, GraduationCap, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { CollegeFilters as FilterType } from '@/hooks/useColleges';

interface CollegeFiltersProps {
  filters: FilterType;
  onChange: (filters: FilterType) => void;
  onClear: () => void;
}

export const CollegeFilters: React.FC<CollegeFiltersProps> = ({
  filters,
  onChange,
  onClear,
}) => {
  const stateOptions = [
    { value: '', label: 'All States' },
    { value: 'Maharashtra', label: 'Maharashtra' },
    { value: 'Delhi', label: 'Delhi' },
    { value: 'Tamil Nadu', label: 'Tamil Nadu' },
    { value: 'Rajasthan', label: 'Rajasthan' },
    { value: 'Telangana', label: 'Telangana' },
    { value: 'Karnataka', label: 'Karnataka' },
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Government', label: 'Government' },
    { value: 'Private', label: 'Private' },
  ];

  const ratingOptions = [
    { value: '0', label: 'Any Rating' },
    { value: '4.5', label: '⭐ 4.5 & Above' },
    { value: '4.0', label: '⭐ 4.0 & Above' },
    { value: '3.5', label: '⭐ 3.5 & Above' },
  ];

  const examOptions = [
    { value: '', label: 'Select Exam' },
    { value: 'JEE Main', label: 'JEE Main' },
    { value: 'JEE Advanced', label: 'JEE Advanced' },
    { value: 'BITSAT', label: 'BITSAT' },
    { value: 'MHT CET', label: 'MHT CET' },
  ];

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    onChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  const removeFilterKey = (key: keyof FilterType) => {
    const updated = { ...filters };
    delete updated[key];
    onChange(updated);
  };

  // Compute active filters list for pill badges
  const activePills = React.useMemo(() => {
    const pills: { key: keyof FilterType; label: string }[] = [];
    if (filters.type) pills.push({ key: 'type', label: `Type: ${filters.type}` });
    if (filters.state) pills.push({ key: 'state', label: `State: ${filters.state}` });
    if (filters.minRating && filters.minRating > 0) pills.push({ key: 'minRating', label: `Rating: ${filters.minRating}+` });
    if (filters.minFees) pills.push({ key: 'minFees', label: `Min Fee: ₹${(filters.minFees / 100000).toFixed(1)}L` });
    if (filters.maxFees) pills.push({ key: 'maxFees', label: `Max Fee: ₹${(filters.maxFees / 100000).toFixed(1)}L` });
    if (filters.exam) pills.push({ key: 'exam', label: `Exam: ${filters.exam}` });
    if (filters.rank) pills.push({ key: 'rank', label: `Rank: ${filters.rank}` });
    return pills;
  }, [filters]);

  return (
    <div className="bg-white/90 backdrop-blur-xl border border-gray-200/80 rounded-2xl p-5 sm:p-6 shadow-lg shadow-gray-200/50 sticky top-24 z-20 flex flex-col gap-6 transition-all duration-200">
      
      {/* Title & Clear Action Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
          <Filter size={18} className="text-orange-600" />
          <span>Filter Colleges</span>
        </h3>
        {activePills.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs font-bold text-gray-500 hover:text-orange-600 flex items-center gap-1 transition-colors active:scale-95 cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Active Filter Pill Badges */}
      {activePills.length > 0 && (
        <div className="flex flex-col gap-2 pb-4 border-b border-gray-100">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Filters</span>
          <div className="flex flex-wrap gap-1.5">
            {activePills.map((pill) => (
              <button
                key={pill.key}
                onClick={() => removeFilterKey(pill.key)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold transition-all duration-150 hover:bg-orange-100 active:scale-95 cursor-pointer"
              >
                <span>{pill.label}</span>
                <X size={12} className="text-orange-600 hover:text-orange-900" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* College Type & State Selectors */}
      <div className="flex flex-col gap-4">
        <Select
          label="College Type"
          options={typeOptions}
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        />

        <Select
          label="State / Region"
          options={stateOptions}
          value={filters.state || ''}
          onChange={(e) => handleFilterChange('state', e.target.value)}
        />
      </div>

      {/* Annual Fees Limit */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <DollarSign size={14} className="text-gray-400" />
          Annual Fees Limit (INR)
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <Input
            placeholder="Min Fees"
            type="number"
            value={filters.minFees || ''}
            onChange={(e) => handleFilterChange('minFees', e.target.value ? Number(e.target.value) : undefined)}
          />
          <Input
            placeholder="Max Fees"
            type="number"
            value={filters.maxFees || ''}
            onChange={(e) => handleFilterChange('maxFees', e.target.value ? Number(e.target.value) : undefined)}
          />
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
          <Star size={14} className="text-amber-500" />
          Minimum Rating
        </label>
        <Select
          options={ratingOptions}
          value={filters.minRating || '0'}
          onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      {/* Rank Cutoff Predictor Integration */}
      <div className="border-t border-gray-100 pt-5 flex flex-col gap-3.5">
        <label className="text-xs font-extrabold text-orange-600 flex items-center gap-1.5 uppercase tracking-wider">
          <GraduationCap size={16} />
          <span>Seat Predictor Filter</span>
        </label>
        <p className="text-xs font-medium text-gray-500 leading-relaxed">
          Select exam & enter your rank score to filter eligible cutoffs.
        </p>
        
        <Select
          options={examOptions}
          value={filters.exam || ''}
          onChange={(e) => handleFilterChange('exam', e.target.value)}
        />

        <Input
          placeholder="Enter Your Rank Score"
          type="number"
          disabled={!filters.exam}
          value={filters.rank || ''}
          onChange={(e) => handleFilterChange('rank', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

    </div>
  );
};

