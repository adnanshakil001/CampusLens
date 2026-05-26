import * as React from 'react';
import { CollegeCard } from './CollegeCard';
import { College } from '@/hooks/useColleges';

interface CollegeGridProps {
  colleges: College[];
  compareIds: number[];
  onCompareToggle: (id: number) => void;
  savedIds: number[];
  onSaveToggle: (id: number) => void;
}

export const CollegeGrid: React.FC<CollegeGridProps> = ({
  colleges,
  compareIds,
  onCompareToggle,
  savedIds,
  onSaveToggle,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
      {colleges.map((college) => (
        <CollegeCard
          key={college.id}
          college={college}
          isComparing={compareIds.includes(college.id)}
          onCompareToggle={() => onCompareToggle(college.id)}
          isSaved={savedIds.includes(college.id)}
          onSaveToggle={() => onSaveToggle(college.id)}
        />
      ))}
    </div>
  );
};
