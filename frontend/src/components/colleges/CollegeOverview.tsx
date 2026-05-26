import * as React from 'react';
import { Card } from '@/components/ui/Card';
import { College } from '@/hooks/useColleges';
import { Landmark, Calendar, Award, MapPin } from 'lucide-react';

interface CollegeOverviewProps {
  college: College;
}

export const CollegeOverview: React.FC<CollegeOverviewProps> = ({ college }) => {
  const stats = [
    { label: 'Established', value: college.established || 'N/A', icon: Calendar },
    { label: 'NIRF Ranking', value: college.ranking ? `#${college.ranking}` : 'N/A', icon: Award },
    { label: 'College Type', value: college.type, icon: Landmark },
    { label: 'Location', value: college.location, icon: MapPin },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Overview text body */}
      <div className="lg:col-span-2 flex flex-col gap-6">
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-4">About the University</h3>
          <p className="text-sm font-semibold text-on-surface-variant leading-relaxed whitespace-pre-line">
            {college.overview}
          </p>
        </Card>
      </div>

      {/* Side Stats grid summary */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm">
          <h3 className="text-base font-bold text-on-surface mb-5 uppercase tracking-wider">Quick Information</h3>
          <div className="flex flex-col gap-5">
            {stats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div key={idx} className="flex items-center gap-4 py-1 border-b border-border-subtle/40 last:border-0 pb-3 last:pb-0">
                  <div className="p-2.5 rounded-xl bg-surface-muted text-primary">
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-outline uppercase tracking-wider">{stat.label}</p>
                    <p className="text-sm font-extrabold text-on-surface mt-0.5">{stat.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
