'use client';

import * as React from 'react';
import { Filter, RotateCcw, Landmark, DollarSign, Star, GraduationCap } from 'lucide-react';
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
  ];

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'Government', label: 'Government' },
    { value: 'Private', label: 'Private' },
  ];

  const ratingOptions = [
    { value: '0', label: 'Any Rating' },
    { value: '4.5', label: '4.5 & Above' },
    { value: '4.0', label: '4.0 & Above' },
    { value: '3.5', label: '3.5 & Above' },
  ];

  const examOptions = [
    { value: '', label: 'Select Exam' },
    { value: 'JEE Main', label: 'JEE Main' },
    { value: 'JEE Advanced', label: 'JEE Advanced' },
  ];

  const handleFilterChange = (key: keyof FilterType, value: any) => {
    onChange({
      ...filters,
      [key]: value === '' ? undefined : value,
    });
  };

  return (
    <div className="bg-surface border border-border-subtle rounded-xl p-5 shadow-sm sticky top-24 flex flex-col gap-6">
      {/* Title & Clear Action */}
      <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
        <h3 className="text-base font-bold text-on-surface flex items-center gap-2">
          <Filter size={18} className="text-primary" />
          Filter Colleges
        </h3>
        <button
          onClick={onClear}
          className="text-xs font-bold text-outline hover:text-primary flex items-center gap-1 transition-colors active:scale-95"
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* College Type & State */}
      <div className="flex flex-col gap-4">
        <Select
          label="College Type"
          options={typeOptions}
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
        />

        <Select
          label="State"
          options={stateOptions}
          value={filters.state || ''}
          onChange={(e) => handleFilterChange('state', e.target.value)}
        />
      </div>

      {/* Annual Fees Limit */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-on-surface-variant flex items-center gap-1.5">
          <DollarSign size={16} className="text-outline" />
          Annual Fees Limit (INR)
        </label>
        <div className="grid grid-cols-2 gap-3">
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
      <div className="flex flex-col gap-3">
        <label className="text-sm font-semibold text-on-surface-variant flex items-center gap-1.5">
          <Star size={16} className="text-outline" />
          Minimum Rating
        </label>
        <Select
          options={ratingOptions}
          value={filters.minRating || '0'}
          onChange={(e) => handleFilterChange('minRating', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>

      {/* Rank Cutoff Predictor Integration! */}
      <div className="border-t border-border-subtle pt-5 flex flex-col gap-4">
        <label className="text-sm font-bold text-primary flex items-center gap-1.5 uppercase tracking-wider">
          <GraduationCap size={18} />
          Predictor Filter
        </label>
        <p className="text-xs font-semibold text-on-surface-variant leading-relaxed mb-1">
          Input your rank to filter colleges with cutoffs higher than your rank score.
        </p>
        
        <Select
          options={examOptions}
          value={filters.exam || ''}
          onChange={(e) => handleFilterChange('exam', e.target.value)}
        />

        <Input
          placeholder="Enter Your Rank"
          type="number"
          disabled={!filters.exam}
          value={filters.rank || ''}
          onChange={(e) => handleFilterChange('rank', e.target.value ? Number(e.target.value) : undefined)}
        />
      </div>
    </div>
  );
};
