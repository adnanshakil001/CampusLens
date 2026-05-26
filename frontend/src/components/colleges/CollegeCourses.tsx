import * as React from 'react';
import { Course } from '@/hooks/useCollege';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BookOpen } from 'lucide-react';

interface CollegeCoursesProps {
  courses: Course[];
}

export const CollegeCourses: React.FC<CollegeCoursesProps> = ({ courses }) => {
  const [levelFilter, setLevelFilter] = React.useState<'All' | 'UG' | 'PG'>('All');

  const filteredCourses = React.useMemo(() => {
    if (levelFilter === 'All') return courses;
    return courses.filter((c) => c.level === levelFilter);
  }, [courses, levelFilter]);

  const formatFees = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border-subtle/80">
        <div>
          <h3 className="text-xl font-bold text-on-surface">Available Courses & Fees</h3>
          <p className="text-xs font-semibold text-on-surface-variant mt-1">
            Browse through under-graduate and post-graduate engineering courses offered by the institute.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex bg-surface-muted p-1 rounded-xl border border-border-subtle">
          {(['All', 'UG', 'PG'] as const).map((lvl) => (
            <button
              key={lvl}
              onClick={() => setLevelFilter(lvl)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                levelFilter === lvl
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {lvl === 'All' ? 'All Degrees' : lvl === 'UG' ? 'Undergraduate' : 'Postgraduate'}
            </button>
          ))}
        </div>
      </div>

      {filteredCourses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border-subtle text-outline uppercase tracking-wider text-xs font-bold">
                <th className="py-3 px-4">Course Name</th>
                <th className="py-3 px-4">Degree</th>
                <th className="py-3 px-4">Duration</th>
                <th className="py-3 px-4">Seat Intake</th>
                <th className="py-3 px-4 text-right">Annual Fees</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((c) => (
                <tr key={c.id} className="border-b border-border-subtle/40 hover:bg-surface-muted/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-on-surface">{c.name}</td>
                  <td className="py-4 px-4">
                    <Badge variant={c.level === 'UG' ? 'primary' : 'secondary'}>{c.level}</Badge>
                  </td>
                  <td className="py-4 px-4 font-semibold text-on-surface-variant">{c.duration}</td>
                  <td className="py-4 px-4 font-semibold text-on-surface-variant">{c.intake || 'N/A'} Seats</td>
                  <td className="py-4 px-4 text-right font-extrabold text-primary">{formatFees(c.fees)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 flex flex-col items-center gap-3">
          <BookOpen size={36} className="text-outline/40" />
          <p className="text-sm font-bold text-on-surface">No courses available for selected degree level.</p>
        </div>
      )}
    </Card>
  );
};
