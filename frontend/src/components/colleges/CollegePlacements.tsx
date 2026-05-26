import * as React from 'react';
import { Placement } from '@/hooks/useCollege';
import { Card } from '@/components/ui/Card';
import { TrendingUp, Award, Sparkles, Building2 } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

interface CollegePlacementsProps {
  placements: Placement[];
}

export const CollegePlacements: React.FC<CollegePlacementsProps> = ({ placements }) => {
  const latest = placements[0];

  if (!latest) {
    return (
      <Card className="bg-white border-border-subtle p-8 text-center rounded-xl shadow-sm">
        <p className="text-sm font-bold text-on-surface">No placement data available for this college.</p>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Overview stats cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-secondary/10 text-secondary">
            <Sparkles size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-outline uppercase tracking-wider">Highest Package</p>
            <p className="text-2xl font-extrabold text-on-surface mt-0.5">₹{latest.highest_package} LPA</p>
          </div>
        </Card>

        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-primary/10 text-primary">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-outline uppercase tracking-wider">Average Package</p>
            <p className="text-2xl font-extrabold text-primary mt-0.5">₹{latest.average_package} LPA</p>
          </div>
        </Card>

        <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-status-success/10 text-status-success">
            <Award size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-outline uppercase tracking-wider">Placement Ratio</p>
            <p className="text-2xl font-extrabold text-on-surface mt-0.5">{latest.placement_percentage}%</p>
          </div>
        </Card>
      </div>

      {/* Recruiter block & Placement history table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recruiter block */}
        <div className="lg:col-span-2">
          <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm h-full">
            <h3 className="text-lg font-bold text-on-surface mb-5 flex items-center gap-2">
              <Building2 size={20} className="text-primary" />
              Top Recruiters ({latest.year})
            </h3>
            {latest.recruiters && latest.recruiters.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {latest.recruiters.map((recruiter, index) => (
                  <div
                    key={index}
                    className="bg-surface-muted border border-border-subtle rounded-xl py-3 px-6 text-sm font-extrabold text-on-surface shadow-xs hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all duration-300"
                  >
                    {recruiter}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-semibold text-on-surface-variant">No top recruiter list listed.</p>
            )}
          </Card>
        </div>

        {/* History Table */}
        <div className="lg:col-span-1">
          <Card className="bg-white border-border-subtle p-6 rounded-xl shadow-sm">
            <h3 className="text-base font-bold text-on-surface mb-4 uppercase tracking-wider">Placement History</h3>
            <div className="flex flex-col gap-4">
              {placements.map((p) => (
                <div key={p.id} className="flex items-center justify-between border-b border-border-subtle/40 last:border-0 pb-3 last:pb-0">
                  <span className="text-sm font-extrabold text-on-surface">Year {p.year}</span>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-on-surface-variant">Avg: ₹{p.average_package} LPA</p>
                    <p className="text-xs font-semibold text-outline mt-0.5">Max: ₹{p.highest_package} LPA</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

      </div>
    </div>
  );
};
